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
  const navigateBack=async()=>{
    navigation.goBack();
   // navigation.navigate("BottomNavigation");
  }
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 55,
          backgroundColor: "black",
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

      <View style={{ flexDirection: "column", backgroundColor: "#222222" }}>
        <Text
          style={{
            paddingHorizontal: 16,
            marginTop: 8,
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {passengerName}
        </Text>

        <View style={styles.header}>
          <Text style={styles.headerText}>Trip# {trip}</Text>

          <View style={styles.headerTime}>
            <MaterialCommunityIcons
              style={{ paddingRight: 5 }}
              name="time-outline"
              color={"#AEAEAE"}
              size={16}
            />
            <Text style={{ color: "#AEAEAE" }}>{pickUpTime}</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 18,
          flex: 1,
          marginVertical: 15,
        }}
      >
        {/* Boarded label */}
        {boardedLable ? (
          <View
            style={{
              backgroundColor: "#ffe1b0",
              borderRadius: 5,
              flexDirection: "row",
              marginBottom: 12,
              padding: 5,
            }}
          >
            <MaterialCommunityIcons
              style={{ paddingRight: 5, fontWeight: "800" }}
              name="time-outline"
              color={"#af7749"}
              size={18}
            />
            <Text style={{ color: "#af7749", fontWeight: "bold" }}>
              Boarded on {pickUpTime}
            </Text>
          </View>
        ) : null}

        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.containerPickupText}>PICK-UP</Text>
          <Text style={styles.airlineNameText}>{pickUp}</Text>
          <Text style={styles.airlineDetailsText}>
            {airlineCode} | {terminal}
          </Text>
        </View>

        <View>
          <Text style={styles.containerDropoffText}>DROP OFF</Text>

          <Text style={styles.airlineNameText}>
            {dropOff.split(",").shift()}
          </Text>
          <Text style={styles.airlineDetailsText}>
            {dropOff.slice(dropOff.indexOf(",") + 1)}
          </Text>
        </View>

        <View
          style={{
            borderStyle: "dotted",
            borderWidth: 1,
            borderRadius: 1,
            marginVertical: 16,
          }}
        />

        {/* <View style={{ paddingBottom: 16 }}>
          <Text style={styles.airlineDetailsText}>Pax Name</Text>
          <Text style={styles.airlineNameText}>{passengerName}</Text>
        </View> */}
        {/* 
        <View style={{ paddingBottom: 16 }}>
          <Text style={styles.airlineDetailsText}>Pax Type</Text>
          <Text style={styles.airlineNameText}>Pilot</Text>
        </View> */}

        <View style={{ paddingBottom: 16, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.airlineDetailsText}>Flight #</Text>
            <Text style={styles.airlineNameText}>{flightNo}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.airlineDetailsText}>Terminal</Text>
            <Text style={styles.airlineNameText}>{terminal}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.airlineDetailsText}>Gate #</Text>
            <Text style={styles.airlineNameText}>NA</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
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
          <Text style={{ color: "#ffff", fontSize: 16 }}>{mainButtonName}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: "100%",
    backgroundColor: "black",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 12,
    paddingTop: 12,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
});
