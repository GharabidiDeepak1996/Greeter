import React, { useRef, useEffect, useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
//pratik
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
  ActivityIndicator,
  Alert,
} from "react-native";
import { Button } from "@react-native-material/core";
import MaterialCommunityIcons from "react-native-vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import { format } from "date-fns";
import Calendar from "../components/Calender";

export default function HomeScreen({ navigation }) {
  const fullDate = moment(Date()).format("YYYY-MM-DD");

  const [userID, setUserId] = useState(null);
  const [customerID, setCustomerId] = useState();
  const [greeterJob, setGreeterJob] = useState([]);
  const [greeterNoJob, setGreeterNoJob] = useState("");
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(fullDate);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [statusID, setStatusID] = useState("");
  const [longitudeLocation, setLongitudeLocation] = useState();
  const [latitudeLocation, setLatitudeLocation] = useState();

  const buttonStatus = (buttonName) => {
    if (buttonName == "Greeter Assigned") {
      //1511
      return "Accept Job";
    }
    if (buttonName == "Greeter Acknoledged") {
      //1512
      return "Start Job";
    }
    if (buttonName == "Greeter Accepted") {
      //1513
      return "onGoing job";
    }
    return null;
  };

  const jobStatus = async (statusid, tripId) => {
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
          setStatusID(json.resultMessage);
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

  const apiCall = async (userId) => {
    console.log(
      "DateCurrent",
      moment(selectedDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
      "userid--",
      userId
    );

    try {
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
            from_date: "05/25/2023 00:00", //moment(selectedDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
            to_date: "05/25/2023 00:00", //moment(selectedDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
            // from_date: moment(new Date(), "YYYY-MM-DDTHH:mm:ss.sssZ").format(
            //   "MM/DD/YYYY HH:mm"
            // ),
            // to_date: moment(new Date(), "YYYY-MM-DDTHH:mm:ss.sssZ").format(
            //   "MM/DD/YYYY HH:mm"
            // ),
            greeter_id: userId,
          }),
        }
      );
      const statuscode = response.status;
      if (statuscode === 200) {
        const json = await response.json();

        if (json.greeterJob.length > 0) {
          setGreeterJob(json.greeterJob);
        } else {
          setGreeterNoJob("No Job Assign");
          setGreeterJob(json.greeterJob);
        }
        console.log("jobListGreeter", json.greeterJob.length);
      }
    } catch (error) {
      console.log("jobListError", error);
    } finally {
    }
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        throw new Error("Permission not granted!");
      }
      console.log("checkPermission", finalStatus);
      //const token = (await Notifications.getExpoPushTokenAsync()).data;
      const token = (await Notifications.getDevicePushTokenAsync()).data;
      updateFCMToken(token);
      console.log("expo token", token);

      return token;
    } catch (error) {
      console.log("error", error);
      console.error(error);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("loginDetails").then(async (val) => {
      const parsed = await JSON.parse(val);
      setUserId(parsed.userId);
      setCustomerId(parsed.customerId);

      apiCall(parsed.userId);
      console.log("asyncStorage", userID);
    });

    registerForPushNotificationsAsync();

    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (fcmNotification) => {
        console.log(
          "FCMData--> ",
          fcmNotification.request.trigger.remoteMessage
        );
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [selectedDate, isFocused, refreshing, statusID]);

  const renderItem = ({ item, index }) => {
    getLocationAsync();

    return (
      <View key={item.trip_id} style={styles.containerNew}>
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
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
              >
                {item.title + "" + item.first_name + "" + item.last_name}
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
                {item.customer_name}
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
              {item.no_of_pax}{" "}
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
            <Text style={{ fontSize: 16, color: "gray" }}>
              {"# " + item.trip_id}
            </Text>
          </View>
        </View>

        <View
          style={{ width: "100%", height: 1, backgroundColor: "#D3D3D3" }}
        />

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
                <Text style={styles.title}>{item.pickup_address}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#5A5A5A" }}>Fight :</Text>
                  <Text style={{ color: "#5A5A5A" }}> {item.flight_no}</Text>
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
                  {moment(item.pickup_time, "dd/mm/yyyy HH:mm:ss").format(
                    "HH:mm"
                  )}
                </Text>
              </View>
            </View>
          </View>

          <View>
            <Text style={styles.containerDropoffText}>DROP OFF</Text>
            <Text style={styles.airlineNameText}>
              {item.dropoff_address.split(",").shift()}
            </Text>
            <Text style={styles.airlineDetailsText}>
              {item.dropoff_address
                .slice(item.dropoff_address.indexOf(",") + 1)
                .trim()}
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
                  Linking.openURL("tel:" + item.mobile);
                }}
              >
                {item.mobile}
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
                title={buttonStatus(item.status_name)}
                style={styles.materialButtonPrimary}
                onPress={() => {
                  if (item.status_id == "1511") {
                    Alert.alert("Job", "Do you want to accept this job", [
                      {
                        text: "No",
                        //onPress: () => Alert.alert("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          jobStatus(1512, item.trip_id);
                        },
                        //style: "cancel",
                      },
                    ]);
                  } else if (item.status_id == "1512") {
                    Alert.alert("Job", "Do you want to start this job", [
                      {
                        text: "No",
                        //onPress: () => Alert.alert("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          jobStatus(1513, item.trip_id);

                          navigation.navigate("TripDetailsScreen", {
                            passengerName:
                              item.title +
                              "" +
                              item.first_name +
                              "" +
                              item.last_name,
                            pickUp: item.pickup_address,
                            dropOff: item.dropoff_address,
                            pickUpTime: moment(
                              item.pickup_time,
                              "dd/mm/yyyy HH:mm:ss"
                            ).format("HH:mm"),
                            trip: item.trip_id,
                            noPax: item.no_of_pax,
                            airlineCode: item.airline_code,
                            flightNo: item.flight_no,
                            terminal: item.terminal,
                            flightSchTime: item.flight_sch_time,
                            newGreeterId: item.greeter_id,
                            greeterName: item.greeter_name,
                            newStatusId: 1515,
                            statusName: "On Location",
                          });
                        },
                        //style: "cancel",
                      },
                    ]);
                  } else if (
                    item.status_id == "1513" ||
                    item.status_id == "1515" ||
                    item.status_id == "1516" ||
                    item.status_id == "1517" ||
                    item.status_id == "1518"
                  ) {
                    navigation.navigate("TripDetailsScreen", {
                      passengerName:
                        item.title + "" + item.first_name + "" + item.last_name,
                      pickUp: item.pickup_address,
                      dropOff: item.dropoff_address,
                      pickUpTime: moment(
                        item.pickup_time,
                        "dd/mm/yyyy HH:mm:ss"
                      ).format("HH:mm"),
                      trip: item.trip_id,
                      noPax: item.no_of_pax,
                      airlineCode: item.airline_code,
                      flightNo: item.flight_no,
                      terminal: item.terminal,
                      flightSchTime: item.flight_sch_time,
                      newGreeterId: item.greeter_id,
                      greeterName: item.greeter_name,
                      newStatusId: item.status_id,
                      statusName: item.status_name,
                    });
                  } else {
                    ToastAndroid.show(item.status_name, ToastAndroid.SHORT);
                  }
                }}
              />
            </View>
          </View>
        </View>
      </View>
      // <View>
      //   {/* <Item
      //     bookingId={item.booking_id}
      //     tripId={item.trip_id}
      //     companyId={item.company_id}
      //     branchId={item.branch_id}
      //     customerId={item.customer_id}
      //     customerName={item.customer_name}
      //     serviceType={item.service_type}
      //     pickupTime={moment(item.pickup_time, "dd/mm/yyyy HH:mm:ss").format(
      //       "HH:mm"
      //     )}
      //     noPax={item.no_of_pax}
      //     pickupNotes={item.pickup_notes}
      //     title={item.title}
      //     name={item.title + "" + item.first_name + "" + item.last_name}
      //     mobile={item.mobile}
      //     email={item.email}
      //     airlineCode={item.airline_code}
      //     flightNo={item.flight_no}
      //     terminal={item.terminal}
      //     flightSchTime={item.flight_sch_time}
      //     commissionAgentId={item.commission_agent_id}
      //     greeterId={item.greeter_id}
      //     greeterName={item.greeter_name}
      //     statusId={item.status_id}
      //     statusName={item.status_name}
      //     onSiteTime={item.on_site_time}
      //     boardTime={item.board_time}
      //     pickupFrom={item.pickup_address}
      //     dropOffAdd={item.dropoff_address}
      //     navigation={navigation}
      //   /> */}
      // </View>
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
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

        {greeterJob.length > 0 ? (
          <FlatList
            data={greeterJob}
            renderItem={renderItem}
            keyExtractor={(item) => {
              item.booking_id;
            }}
          />
        ) : (
          <Text
            style={{
              textAlign: "center",
              textAlignVertical: "center",
              paddingVertical: 300,
            }}
          >
            {" "}
            No job found
          </Text>
        )}
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
