import react, { useState } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/Ionicons";

export default function TripDetailsScreen({ navigation, route }) {
  // function refreshPage() {
  //   window.location.reload(false);
  // }

  const {
    passengerName,
    pickUp,
    dropOff,
    pickUpTime,
    trip,
    noPax,
    airlineCode,
    flightNo,
    terminal,
    flightSchTime,
    newGreeterId,
    greeterName,
    newStatusId,
    statusName,
  } = route.params;

  const [statusID, setStatusID] = useState(newStatusId);
  const [mainButtonName, setMainButtonName] = useState(statusName);
  const [boardedLable, setBoardedLable] = useState(false);

  var abc = parseInt(newGreeterId);
  var xyz = parseInt(statusID);

  // const terminalF = () => {
  //   if (terminal === "") {
  //     return -
  //   } else {
  //     return terminal;
  //   }
  // };

  function validati() {
    if (statusID == 1515) {
      setMainButtonName("Board");
      setStatusID(1516);
      //setNewStatusId(1516)
    }

    if (statusID == 1516) {
      setMainButtonName("Complete this trip");
      setStatusID(1519);
      //setNewStatusId(1519)
    }

    if (statusID == 1519) {
      navigation.navigate("BottomNavigation");
      setStatusID(0);
      //setNewStatusId(0)
    }
  }

  const jobStatus = async (stat) => {
    setStatusID(stat);
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
            trip_id: trip,
            greeter_id: 0,
            status_time: "04/14/2023 10:22",
            status_Id: parseInt(stat),
            latitude: 15.0,
            longitude: 87.36,
          }),
        }
      );

      const statusCode = response.status;
      const json = await response.json();

      if (statusCode == 200) {
        if (json.isSuccess == true) {
          //window.location.reload(false);
          setStatusID(stat);
        } else {
          ToastAndroid.show(json.resultMessage, ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  const navigateBack = async () => {
    navigation.goBack();
    // navigation.navigate("BottomNavigation");
  };
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 55,
          backgroundColor: "#360063",
          borderBottomColor: "grey",
        }}
      >
        <View style={{ marginStart: 10, alignSelf: "center" }}>
          <MaterialCommunityIcons
            onPress={navigateBack}
            name={"arrow-back"}
            color={"white"}
            size={26}
          />
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
            marginStart: 10,
            textAlignVertical: "center",
          }}
        >
          Current Trip
        </Text>
      </View>
      <View style={{ backgroundColor: "white", flex: 1 }}>
        {/* overll screen pading */}
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 12,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{ fontWeight: "600", fontSize: 15, color: "#360063" }}
              >
                Started at{" "}
              </Text>
              <Text
                style={{ fontWeight: "600", fontSize: 15, color: "#360063" }}
              >
                2:30 PM
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{ fontWeight: "600", fontSize: 15, color: "#360063" }}
              >
                Trip#
              </Text>
              <Text
                style={{ fontWeight: "600", fontSize: 15, color: "#360063" }}
              >
                122645632
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#EEE9F3",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: "#360063",
                paddingLeft: 12,
                paddingVertical: 5,
              }}
            >
              Customer Info
            </Text>
          </View>
          <View style={{ padding: 14 }}>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 2 }}>
                <Text style={{ color: "#121212" }}>Customer</Text>
                <Text style={{ fontWeight: "600", fontSize: 17 }}>
                  Kay S. Johnson
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#121212" }}>Pax#</Text>
                <Text style={{ fontWeight: "600", fontSize: 17 }}>05</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 16,
              }}
            >
              <View style={{ flex: 2 }}>
                <Text style={{ color: "#121212" }}>Type</Text>
                <Text style={{ fontWeight: "600", fontSize: 17 }}>
                  VIP Customer
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#121212" }}>Mobile</Text>
                <Text style={{ fontWeight: "600", fontSize: 17 }}>
                  7977390526
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#EEE9F3",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: "#360063",
                paddingLeft: 12,
                paddingVertical: 5,
              }}
            >
              Trip Info
            </Text>
          </View>
          <View style={{ padding: 14 }}>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 2 }}>
                <Text style={{ color: "#121212" }}>Pick-up Date</Text>
                <Text style={{ fontWeight: "600", fontSize: 17 }}>
                  05/25/2023 12:00
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#121212" }}>Flight#</Text>
                <Text style={{ fontWeight: "600", fontSize: 17 }}>AA1352</Text>
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={{ color: "#121212" }}>Pick-up</Text>
              <Text style={{ fontWeight: "600", fontSize: 17 }}>
                JKF Airport
              </Text>
            </View>
            <View style={{ marginTop: 16 }}>
              <Text style={{ color: "#121212" }}>Drop-off</Text>
              <Text style={{ fontWeight: "600", fontSize: 17 }}>
                Hotel Hilton
              </Text>
              <Text style={{ color: "gray" }}>
                144-02 135th Avq, Queens, NY 11436,USA
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#EEE9F3",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: "#360063",
                paddingLeft: 12,
                paddingVertical: 5,
              }}
            >
              Instructions
            </Text>
          </View>
          <View style={{ padding: 14 }}>
            <View>
              <Text style={{ color: "#121212" }}>Pick-up Notes</Text>
              <Text style={{ fontWeight: "600", fontSize: 17 }}>
                Please pick-me up at terminal A. I have 5 baggage. I need
                wheelchair
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomView}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (statusID == 1515) {
                Alert.alert("Alert", "Have you reached on location?", [
                  {
                    text: "No",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      setMainButtonName("Passanger at site");
                      jobStatus(1516);
                    },
                  },
                ]);
              } else if (statusID == 1516) {
                Alert.alert("Alert", "Is everyone boarded?", [
                  {
                    text: "No",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      // validati();
                      setBoardedLable(true);
                      setMainButtonName("Complete");
                      jobStatus(1519);
                    },
                  },
                ]);
              } else if (statusID == 1519) {
                Alert.alert(
                  "Alert",
                  "Are you sure you want to complete this trip?",
                  [
                    {
                      text: "No",
                      onPress: () => console.log("No Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        //validati();
                        //jobStatus();
                        navigation.navigate("BottomNavigation");
                      },
                    },
                  ]
                );
              }
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <View
                style={{
                  height: 25,
                  width: 25,
                  backgroundColor: "black",
                  borderRadius: 30,
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name={"ios-call"}
                  color={"white"}
                  size={14}
                  style={{ alignSelf: "center" }}
                />
              </View>

              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                  fontWeight: "bold",
                  paddingLeft: 5,
                }}
              >
                Call Customer
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (statusID == 1515) {
                Alert.alert("Alert", "Have you reached on location?", [
                  {
                    text: "No",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      setMainButtonName("Passanger at site");
                      jobStatus(1516);
                    },
                  },
                ]);
              } else if (statusID == 1516) {
                Alert.alert("Alert", "Is everyone boarded?", [
                  {
                    text: "No",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      // validati();
                      setBoardedLable(true);
                      setMainButtonName("Complete");
                      jobStatus(1519);
                    },
                  },
                ]);
              } else if (statusID == 1519) {
                Alert.alert(
                  "Alert",
                  "Are you sure you want to complete this trip?",
                  [
                    {
                      text: "No",
                      onPress: () => console.log("No Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        //validati();
                        //jobStatus();
                        navigation.navigate("BottomNavigation");
                      },
                    },
                  ]
                );
              }
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <View
                style={{
                  height: 25,
                  width: 25,
                  backgroundColor: "black",
                  borderRadius: 30,
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name={"arrow-forward-outline"}
                  color={"white"}
                  size={16}
                  style={{ alignSelf: "center" }}
                />
              </View>

              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                  fontWeight: "bold",
                  paddingLeft: 5,
                }}
              >
                On Location
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomView: {
    //backgroundColor: "red",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 4,
    width: "100%",
    height: 60,
    flexDirection: "row",
    position: "absolute", //Here is the trick
    bottom: 0, //Here is the trick
  },
  header: {
    backgroundColor: "#222222",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingTop: 5,
    paddingHorizontal: 16,
  },
  headerText: {
    color: "#AEAEAE",
    fontSize: 14,
    flex: 1,
  },
  headerTime: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  headerTransportDetails: {
    marginVertical: 15,
    marginHorizontal: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 0.24,
  },
  containerPickupText: {
    backgroundColor: "#27Ae60",
    color: "white",
    paddingStart: 6,
    paddingVertical: 2,

    width: 50,
    fontSize: 10,
  },
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
    fontSize: 16,
    fontWeight: "400",
    color: "black",
  },
  locationButton: {
    borderTopEndRadius: 25,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    borderTopStartRadius: 25,
    width: "90%",
    height: 50,
    backgroundColor: "#18599a",
    verticalAlign: "bottom",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 20,
  },

  button: {
    backgroundColor: "white",
    height: 35,
    width: "48%",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
});
