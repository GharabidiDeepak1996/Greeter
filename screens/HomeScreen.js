import React, { useRef, useEffect, useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
//import * as TaskManager from "expo-task-manager";

//const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

//import * as Permissions from "expo-permissions";

import {
  SafeAreaView,
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Linking,
  ToastAndroid,
  RefreshControl,
  Platform,
} from "react-native";
import { Button } from "@react-native-material/core";
import MaterialCommunityIcons from "react-native-vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import { format } from "date-fns";
import Calendar from "../components/Calender";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    console.log("handling a notification", notification);

    return {
      shouldShowAlert: true,
      //  shouldPlaySound: true,
      //  shouldSetBadge: true,
    };
  },
  handleSuccess: (notificationId) =>
    console.log(`Notification ${notificationId} successfully handled.`),
  handleError: (notificationId, error) =>
    console.log(
      `Notification ${notificationId} wasn't successfully handled.`,
      error
    ),
});

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    name: "Pratik Maske",
    pickupFrom: "BOM Airport",
    noOfPickups: "3",
    dropOffAdd: "CSMT Station",
    pickUpTime: "4:30 PM",
    contact: "8433681861",
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-d53abb28ba",
    name: "Deepak Gharabidi",
    pickupFrom: "Orient House, Fort, Mumbai",
    noOfPickups: "2",
    dropOffAdd: "Kurla Station",
    pickUpTime: "5:30 PM",
    contact: "8433681861",
  },
  {
    id: "bd7acbea-c1b1-46c2ed5-3ad53abb28ba",
    name: "Aboli Mane",
    pickupFrom: "Orient House, Fort, Mumbai",
    noOfPickups: "4",
    dropOffAdd: "Kalyan Station",
    pickUpTime: "5:40 PM",
    contact: "8433681861",
  },
];

const jobStatus = async (
  statusid,
  tripId,
  latitudeLocation,
  longitudeLocation
) => {
  try {
    const response = await fetch(
      "http://132.148.73.104:8082/core/ver1.0/greeter/job/status",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id: parseInt(tripId),
          greeter_id: 0,
          status_time: moment(new Date(), "YYYY-MM-DDTHH:mm:ss.sssZ").format(
            "MM/DD/YYYY HH:mm"
          ),
          status_Id: parseInt(statusid),
          latitude: latitudeLocation,
          longitude: longitudeLocation,
        }),
      }
    );

    const statusCode = response.status;
    const json = await response.json();

    if (statusCode == 200) {
      if (json.isSuccess == true) {
        //window.location.reload(false);
      } else {
        ToastAndroid.show(json.resultMessage, ToastAndroid.SHORT);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
  }
};

const Item = ({
  bookingId,
  tripId,
  companyId,
  branchId,
  customerId,
  customerName,
  serviceType,
  pickupTime,
  noPax,
  pickupNotes,
  title,
  name,
  mobile,
  email,
  airlineCode,
  flightNo,
  terminal,
  flightSchTime,
  commissionAgentId,
  greeterId,
  greeterName,
  statusId,
  statusName,
  onSiteTime,
  boardTime,
  pickupFrom,
  dropOffAdd,
  // name,
  // pickupFrom,
  // noOfPickups,
  // dropOffAdd,
  // pickUpTime,
  // contact,
  // flightNo,
  // gate,
  // terminal,
  navigation,
}) => (
  <View key={tripId} style={styles.containerNew}>
    {/* <View
      style={{
        backgroundColor: "#000000",
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
        padding: 7,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "white",
          marginStart: 3,
        }}
      >
        Web Meet and Greet
      </Text>
    </View> */}

    {/* top label */}
    <View
      style={{
        flexDirection: "row",
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,

        paddingHorizontal: 15,
        paddingVertical: 10,
        elevation: 0,

        backgroundColor: "black",
      }}
    >
      <View>
        <View style={{ flexDirection: "row" }}>
          {/* <MaterialCommunityIcons
            name={"person-outline"}
            color={"white"}
            size={17}
            style={{ justifyContent: "center", top: 5, marginRight: 5 }}
          /> */}
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            {name}
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons
            name={"business-outline"}
            color={"gray"}
            size={17}
            style={{ justifyContent: "center", marginRight: 5 }}
          />
          <Text
            style={{
              fontSize: 16,
              color: "gray",
              fontWeight: "400",
            }}
          >
            {customerName}
          </Text>
        </View>
      </View>

      <View
        style={{
          alignItems: "flex-end",
          flex: 1,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            marginStart: 6,
            color: "white",
            fontWeight: "bold",
          }}
        >
          {noPax}{" "}
          <Text
            style={{
              fontSize: 18,
              marginStart: 6,
              color: "white",
              fontWeight: "400",
            }}
          >
            Pax
          </Text>
        </Text>
        <Text style={{ fontSize: 16, color: "gray" }}>{"# " + tripId}</Text>
      </View>
    </View>

    <View style={{ width: "100%", height: 1, backgroundColor: "#D3D3D3" }} />

    {/* //middle label */}
    <View
      style={{
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 5,
      }}
    >
      <View style={styles.namePaxContainer}>
        <View style={{ flexDirection: "column" }}>
          <View style={{ paddingBottom: 14 }}>
            <Text style={styles.infoLabel}>PICK-UP</Text>
            <Text style={styles.title}>{pickupFrom}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "#5A5A5A" }}>Fight :</Text>
              <Text style={{ color: "#5A5A5A" }}> {flightNo}</Text>
              <View
                style={{
                  borderWidth: 2.5,
                  height: 3,
                  borderRadius: 1,
                  marginStart: 5,
                  alignSelf: "center",
                  borderColor: "#5A5A5A",
                }}
              ></View>
              <Text style={{ color: "#5A5A5A" }}> Gate :</Text>
              <Text style={{ color: "#5A5A5A" }}> -</Text>
              <View
                style={{
                  borderWidth: 2.5,
                  height: 3,
                  borderRadius: 1,
                  marginStart: 5,
                  alignSelf: "center",
                  backgroundColor: "#5A5A5A",
                  borderColor: "#5A5A5A",
                }}
              ></View>
              <Text style={{ color: "#5A5A5A" }}> Terminal :</Text>
              <Text style={{ color: "#5A5A5A" }}> -</Text>
            </View>
            {/* <Text style={styles.flightDetails}>
              <Text>
                <Text>{flightNo} |</Text> {terminal}{" "}
              </Text>{" "}
              {""}
            </Text> */}
          </View>
        </View>

        <View
          style={{
            alignItems: "flex-end",
            flex: 1,
          }}
        >
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {pickupTime}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.containerDropoffText}>DROP OFF</Text>
        <Text style={styles.airlineNameText}>
          {dropOffAdd.split(",").shift()}
        </Text>
        <Text style={styles.airlineDetailsText}>
          {dropOffAdd.slice(dropOffAdd.indexOf(",") + 1).trim()}
        </Text>
      </View>
    </View>

    <View>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-around",
          paddingHorizontal: 15,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            borderWidth: 1,
            borderColor: "#979797",
            borderRadius: 25,
            marginEnd: 8,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 12,
          }}
        >
          <Text
            style={{
              fontWeight: "500",
              marginEnd: 10,
              marginStart: 10,
              color: "black",
              textAlign: "center",
              textAlignVertical: "center",
              fontSize: 15,
              textTransform: "uppercase",
            }}
            onPress={() => {
              Linking.openURL("tel:" + mobile);
            }}
          >
            {mobile}
          </Text>

          <View
            style={{
              height: 35,
              width: 35,
              backgroundColor: "seagreen",
              borderRadius: 30,
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name={"ios-call"}
              color={"white"}
              size={17}
              style={{ alignSelf: "center" }}
            />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Button
            title="Start Job"
            style={styles.materialButtonPrimary}
            onPress={() => {
              let latitudeLocation, longitudeLocation;

              async () => {
                let { status } =
                  await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                  Linking.openSettings();
                  console.log("user side", "decline");
                } else {
                  try {
                    let location = await Location.getCurrentPositionAsync({});

                    latitudeLocation = location.coords.latitude;
                    longitudeLocation = location.coords.longitude;
                    // setLongitudeLocation(location.coords.longitude);
                    // setLatitudeLocation(location.coords.latitude);

                    //  console.log("user location-->", location.coords.latitude);
                    // do something with location
                  } catch (e) {
                    alert(
                      "We could not find your position. Please make sure your location service provider is on"
                    );
                    console.log("Error while trying to get location: ", e);
                  }
                }
              };

              if (statusId == "1512") {
                jobStatus(1513, tripId, latitudeLocation, longitudeLocation);

                navigation.navigate("TripDetailsScreen", {
                  passengerName: name,
                  pickUp: pickupFrom,
                  dropOff: dropOffAdd,
                  pickUpTime: pickupTime,
                  trip: tripId,
                  noPax: noPax,
                  airlineCode: airlineCode,
                  flightNo: flightNo,
                  terminal: terminal,
                  flightSchTime: flightSchTime,
                  newGreeterId: greeterId,
                  greeterName: greeterName,
                  newStatusId: 1515,
                  statusName: "Greeter at Site",
                });
              } else if (
                statusId == "1513" ||
                statusId == "1515" ||
                statusId == "1516" ||
                statusId == "1517" ||
                statusId == "1518"
              ) {
                navigation.navigate("TripDetailsScreen", {
                  passengerName: name,
                  pickUp: pickupFrom,
                  dropOff: dropOffAdd,
                  pickUpTime: pickupTime,
                  trip: tripId,
                  noPax: noPax,
                  airlineCode: airlineCode,
                  flightNo: flightNo,
                  terminal: terminal,
                  flightSchTime: flightSchTime,
                  newGreeterId: greeterId,
                  greeterName: greeterName,
                  newStatusId: statusId,
                  statusName: statusName,
                });
              } else {
                ToastAndroid.show(statusName, ToastAndroid.SHORT);
              }
            }}
          />
        </View>
      </View>
    </View>
  </View>
);

const handleNewNotification = async (notificationObject) => {
  console.log("handleNewNotification ->", notificationObject);
  try {
    const newNotification = {
      id: notificationObject.messageId,
      date: notificationObject.sentTime,
      title: notificationObject.messageId,
      body: notificationObject.collapseKey,
      // data: JSON.parse(notificationObject.notification.body),
    };
    // add the code to do what you need with the received notification  and, e.g., set badge number on app icon
    console.log("handleNewNotification125ew", newNotification);
    await Notifications.setBadgeCountAsync(1);
  } catch (error) {
    console.error(error);
  }
};

// TaskManager.defineTask(
//   BACKGROUND_NOTIFICATION_TASK,
//   ({ data, error, executionInfo }) => handleNewNotification(data.notification)
// );

export default function HomeScreen({ navigation }) {
  const fullDate = moment(Date()).format("YYYY-MM-DD");

  const [userID, setUserId] = useState();
  const [customerID, setCustomerId] = useState();
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();
  const [addressTitle, setAddressTitle] = useState("");
  const [addressSubTitle, setAddressSubTitle] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(fullDate);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  AsyncStorage.getItem("loginDetails").then((val) => {
    const parsed = JSON.parse(val);
    setUserId(parsed.userId);
    console.log("parsedId" + parsed.userId);
    setCustomerId(parsed.customerId);
  });

  const apiCall = async () => {
    console.log("joblisting" + userID);
    console.log(
      "ApiCall" + " " + moment(selectedDate, "YYYY-MM-DD").format("MM/DD/YYYY")
    );
    try {
      //debugger;
      const response = await fetch(
        "http://132.148.73.104:8082/core/ver1.0/greeter/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: 0, //userID, //changes are here
            service_provider_id: 2,
            customer_id: 4, //customerID, //changes are here
            branch_id: 1,
            from_date: moment(selectedDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
            to_date: moment(selectedDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
            // from_date: moment(new Date(), "YYYY-MM-DDTHH:mm:ss.sssZ").format(
            //   "MM/DD/YYYY HH:mm"
            // ),
            // to_date: moment(new Date(), "YYYY-MM-DDTHH:mm:ss.sssZ").format(
            //   "MM/DD/YYYY HH:mm"
            // ),
            greeter_id: userID,
          }),
        }
      );
      const statuscode = response.status;
      if (statuscode === 200) {
        const json = await response.json();
        var date = new Date("2016-01-04 10:34:23");

        setData(json.greeterJob);
      }
    } catch (error) {
    } finally {
    }
  };

  async function registerForPushNotificationsAsync() {
    let token;

    // if (Platform.OS === "android") {
    //   await Notifications.setNotificationCategoryAsync("basic", {
    //     name: "default",
    //     importance: Notifications.AndroidImportance.MAX,
    //     sound: "default",
    //     vibrationPattern: [0, 250, 500, 250],
    //     lightColor: "#FF231F7C",
    //   });
    // }

    if (Device.isDevice) {
      //check existing status
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        //app permission
        console.log(finalStatus);
        alert("Failed to get push token for push notification!");
        return;
      }
      // token = (await Notifications.getExpoPushTokenAsync()).data;
      let token2 = (await Notifications.getDevicePushTokenAsync()).data;
      console.log("fcm token", token2);
      token = (await Notifications.getExpoPushTokenAsync(token2)).data;

      updateFCMToken(token);
      console.log("expo token", token);
    } else {
      alert("Must use physical device for Push Notifications");
    }
    // some android configuration
    // if (Platform.OS === "android") {
    //   Notifications.setNotificationChannelAsync("default", {
    //     name: "default",
    //     importance: Notifications.AndroidImportance.MAX,
    //     vibrationPattern: [0, 250, 250, 250],
    //     lightColor: "#FF231F7C",
    //   });
    // }
    return token;
  }

  useEffect(() => {
    //isFocused
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    //Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

    notificationListener.current =
      // const foregroundReceivedNotificationSubscription =
      Notifications.addNotificationReceivedListener(async (fcmNotification) => {
        console.log(
          "FCMData--> ",
          fcmNotification.request.trigger.remoteMessage
        );
        handleNewNotification(fcmNotification.request.trigger.remoteMessage);

        // fcmNotification.request.trigger.remoteMessage.notification.title
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    apiCall();
    // The listeners must be clear on app unmount
    return () => {
      // cleanup the listener and task registry
      //  foregroundReceivedNotificationSubscription.remove();
      //  Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);

      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [selectedDate, isFocused]);
  ``;
  const notificationCommonHandler = (notification) => {
    console.log("FCMData546--> ", notification);
    // Notifications.setNotificationHandler({
    //   handleNotification: async (notification) => {
    //     console.log("handling a notification", notification);

    //     return {
    //       shouldShowAlert: true,
    //       shouldPlaySound: true,
    //       shouldSetBadge: true,
    //     };
    //   },
    //   handleSuccess: (notificationId) =>
    //     console.log(`Notification ${notificationId} successfully handled.`),
    //   handleError: (notificationId, error) =>
    //     console.log(
    //       `Notification ${notificationId} wasn't successfully handled.`,
    //       error
    //     ),
    // });

    // save the notification to reac-redux store
    console.log("FCMNotificationData--->", notification.request);
  };

  const getItemCount = (data) => 20;

  const getItem = (data, index) => ({
    key: index,
    id: Math.random().toString(12).substring(0),
    title: "test",
  });

  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Item
          bookingId={item.booking_id}
          tripId={item.trip_id}
          companyId={item.company_id}
          branchId={item.branch_id}
          customerId={item.customer_id}
          customerName={item.customer_name}
          serviceType={item.service_type}
          pickupTime={moment(item.pickup_time, "dd/mm/yyyy HH:mm:ss").format(
            "HH:mm"
          )}
          noPax={item.no_of_pax}
          pickupNotes={item.pickup_notes}
          title={item.title}
          name={item.title + "" + item.first_name + "" + item.last_name}
          mobile={item.mobile}
          email={item.email}
          airlineCode={item.airline_code}
          flightNo={item.flight_no}
          terminal={item.terminal}
          flightSchTime={item.flight_sch_time}
          commissionAgentId={item.commission_agent_id}
          greeterId={item.greeter_id}
          greeterName={item.greeter_name}
          statusId={item.status_id}
          statusName={item.status_name}
          onSiteTime={item.on_site_time}
          boardTime={item.board_time}
          pickupFrom={item.pickup_address}
          dropOffAdd={item.dropoff_address}
          navigation={navigation}
        />
      </View>
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      apiCall();
      setRefreshing(false);
    }, 2000);
  }, []);

  async function updateFCMToken(fcmToken) {
    console.log(userID);
    console.log(fcmToken);
    try {
      const response = await fetch(
        "http://132.148.73.104:8082/core/ver1.0/notification/UserAsset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: 0,
            user_id: userID, //required
            asset_id: "`0`",
            asset_type: "0",
            asset_make: "0",
            asset_model: "0",
            asset_mfg_name: "0",
            asset_name: "0",
            asset_imie: Device.osBuildId, //required
            asset_os_version: Device.osVersion, //required
            data_state: "0",
            geolocation_status: "0",
            application_name: "Greeter App",
            application_version: "0",
            browser_name: "0",
            browser_version: "0",
            application_type_id: 0,
            firebase_token: fcmToken, //required
            firebase_token_created_at: moment(
              selectedDate,
              "YYYY-MM-DD"
            ).format("MM/DD/YYYY"),
          }),
        }
      );
      const statuscode = response.status;

      if (statuscode === 200) {
        const json = await response.json();
        console.log("ApiFCMTokenUpdate", json);
      }
    } catch (error) {
      console.log("ApiFCMTokenUpdate error", error);
    } finally {
    }
  }

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Linking.openSettings();
      console.log("user side", "decline");
    } else {
      try {
        let location = await Location.getCurrentPositionAsync({});

        setLongitudeLocation(location.coords.longitude);
        setLatitudeLocation(location.coords.latitude);

        console.log("user location-->", location.coords.latitude);
        // do something with location
      } catch (e) {
        alert(
          "We could not find your position. Please make sure your location service provider is on"
        );
        console.log("Error while trying to get location: ", e);
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", backgroundColor: "black" }}>
        <Text style={styles.driversLogin}>My Trips</Text>
      </View>

      <LinearGradient
        start={{ x: 1, y: -2 }}
        end={{ x: 0, y: 0 }}
        colors={["#ffff", "#ffff", "#ffff"]}
        style={{ alignItems: "center", paddingBottom: 2 }}
      >
        <Text style={{ color: "gray" }}>Swipe down to refresh</Text>
      </LinearGradient>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.container}
        horizontal={false}
      >
        <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => {
            item.booking_id;
          }}
          // getItemCount={getItemCount}
          // getItem={getItem}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerDropoffText: {
    backgroundColor: "#eb5757",
    color: "white",
    paddingStart: 6,
    paddingVertical: 2,
    width: 60,
    fontSize: 10,
  },

  airlineNameText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  airlineDetailsText: {
    color: "#5A5A5A",
    fontSize: 14,
    fontWeight: "400",
  },
  container: {
    //flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    backgroundColor: "#fff",
    padding: 0,
    borderRadius: 16,

    marginVertical: 8,
    marginHorizontal: 16,
  },
  containerNew: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 6,
    borderColor: "#18599a",
    marginVertical: 12,
    marginHorizontal: 16,
  },
  passengerContainer: {
    backgroundColor: "#edf2f7",
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 0,
    paddingTop: 5,
    paddingBottom: 5,
    borderColor: "#18599a",
  },
  pickupTimeContainer: {
    padding: 7,
  },

  namePaxContainer: {
    flexDirection: "row",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  pickUpTimeStyle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  driversLogin: {
    fontWeight: "bold",
    fontFamily: "sans-serif",
    color: "white",
    marginBottom: 6,
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 16,
  },
  infoLabel: {
    backgroundColor: "#27Ae60",
    fontWeight: "regular",
    alignSelf: "baseline",
    fontFamily: "sans-serif",
    color: "#fff",
    fontSize: 10,
    paddingStart: 5,
    paddingEnd: 5,
    paddingBottom: 2,
    paddingTop: 2,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  materialButtonPrimary: {
    borderTopEndRadius: 25,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    borderTopStartRadius: 25,
    marginTop: 11,
    marginBottom: 11,
    height: 45,
    marginStart: 8,
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    fontSize: 16,
    textTransform: "uppercase",
  },
  flightDetails: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
  },
});
