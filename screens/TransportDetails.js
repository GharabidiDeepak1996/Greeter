 import React, { useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/Ionicons";
import { Button } from "@react-native-material/core";
import getDirections from 'react-native-google-maps-directions'
import {Linking} from 'react-native'


export default function TransportDetails({navigation,route}){
  handleGetDirections = () => {
    const data = {
       source: {
        latitude: 18.935708,
        longitude: 432.8382718
      },
      destination: {
        latitude: 19.09015275,
        longitude: 72.86371349
      },
      params: [
        {
          key: "travelmode",
          value: "driving"        // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate"       // this instantly initializes navigation using the given travel mode
        }
      ],
      waypoints: [
        // {
        //   latitude: -33.8600025,
        //   longitude: 18.697452
        // },
        // {
        //   latitude: -33.8600026,
        //   longitude: 18.697453
        // },
        //    {
        //   latitude: -33.8600036,
        //   longitude: 18.697493
        // }
      ]
    }
 
    getDirections(data)
  }
  const [mainButtonName, setMainButtonName] = useState("On Location");
  const {
    passengerName,
    pickUp,
    pickUpTime,
    pickUpNo,
    dropOff,
    contactNumber,
  } = route.params;

  function validati() {
    if (mainButtonName === "On Location") {
      setMainButtonName("Board");
    }

    if (mainButtonName === "Board") {
      setMainButtonName("Complete this trip");
    }

    if (mainButtonName === "Complete this trip") {
      navigation.navigate("BottomNavigation")
    }
  }

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 55,
          backgroundColor: "white",
          borderBottomColor: "grey",
        }}
      >
        <View style={{ marginStart: 10, alignSelf: "center" }}>
          <MaterialCommunityIcons
          onPress={()=>{
            console.log('back')
            navigation.navigate("BottomNavigation")
          }}
            name={"arrow-back"}
            color={"#18599a"}
            size={26}
          />
        </View>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#18599a",
            marginStart: 10,
            textAlignVertical: "center",
          }}
        >
          Ride Details tat
        </Text>
      </View>

      <View style={{ alignSelf: "flex-start", marginStart: 10, padding: 10 }}>
        <Text style={{ fontSize: 12, color: "grey" }}>PICKUP TIME</Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 30,
              paddingBottom: 5,
              alignSelf: "center",
              fontWeight: "600",
            }}
          >
            {pickUpTime}
          </Text>
        </View>
      </View>

      <View
        style={{
          alignSelf: "flex-start",
          padding: 10,
          backgroundColor: "white",
          width: "100%",
          flexDirection: "row",
        }}
      >
        <View style={{ alignSelf: "center" }}>
          <MaterialCommunityIcons
            name={"location"}
            color={"#18599a"}
            size={25}
          />
        </View>

        <View style={{ marginStart: 10 }}>
          <Text style={{ fontSize: 12, color: "grey" }}>PICKUP</Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {pickUp}
          </Text>
        </View>

        <View
          style={{
            alignItems: "flex-end",
            flex: 1,
            alignSelf: "center",
          }}
        >
          <Button
            title="Direction"
            uppercase={false}
            onPress={this.handleGetDirections}
            style={styles.materialButtonPrimary}
           
          />
        </View>
      </View>

      <View style={{ display: "flex", flexDirection: "row" }}>
        <View
          style={{
            marginStart: 15,
            padding: 10,
            flex: 3,
          }}
        >
          <View>
            <Text style={{ fontSize: 12, color: "grey" }}>PASSENGER NAME</Text>
            <Text
              style={{
                fontSize: 20,
                marginTop: 5,
                fontWeight: "400",
              }}
            >
              {passengerName}
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            padding: 10,
            flex: 3,
          }}
        >
          <View>
            <Text style={{ fontSize: 12, color: "grey" }}>PAX COUNT</Text>
            <Text
              style={{
                fontSize: 20,
                marginTop: 5,
                fontWeight: "400",
              }}
            >
              {pickUpNo}
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: "flex-end",
            marginEnd: 15,
            padding: 10,
            flex: 3,
          }}
        >
          <View>
            <Text style={{ fontSize: 12, color: "grey" }}>TYPE</Text>
            <Text
              style={{
                fontSize: 20,
                marginTop: 5,
                fontWeight: "400",
              }}
            >
              P, F
            </Text>
          </View>
        </View>
      </View>

      <View style={{width:"90%", height:0.5,backgroundColor:"grey"}}/>

      <View style={{ display: "flex", flexDirection: "row" }}>
        <View
          style={{
            marginStart: 15,
            padding: 10,
            flex: 3,
          }}
        >
          <View>
            <Text style={{ fontSize: 12, color: "grey" }}>FLIGHT#</Text>
            <Text
              style={{
                fontSize: 20,
                marginTop: 5,
                fontWeight: "400",
              }}
            >
              AA1254
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            padding: 10,
            flex: 3,
          }}
        >
          <View>
            <Text style={{ fontSize: 12, color: "grey" }}>TERMINAL</Text>
            <Text
              style={{
                fontSize: 20,
                marginTop: 5,
                fontWeight: "400",
              }}
            >
              T2
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: "flex-end",
            marginEnd: 15,
            padding: 10,
            flex: 3,
          }}
        >
          <View>
            <Text style={{ fontSize: 12, color: "grey" }}>GATE</Text>
            <Text
              style={{
                fontSize: 20,
                marginTop: 5,
                fontWeight: "400",
              }}
            >
              G123
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.addresscontainer}>
        <View style={styles.headingUi}>
          <Text style={{ fontSize: 16, color: "white" }}>Contact </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 16,
              marginStart: 5,
              paddingTop: 5,
              paddingBottom: 5,
              fontWeight: "600",
              alignSelf: "center",
            }}
          >
            {contactNumber}
          </Text>

          <View
            style={{
              padding: 8,
              alignItems: "flex-end",
              marginEnd: 5,
              flex: 1,
            }}
          >
            <Button
              title="call passenger"
              uppercase={false}
              style={styles.materialButtonPrimary}
              onPress={() => {
                Linking.openURL(`tel:${8433681861}`)
              }}
            />
          </View>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          marginTop: 20,
        }}
      >
        <Button
          title={mainButtonName}
          uppercase={false}
          style={styles.locationButton}
          onPress={() => {
            if (mainButtonName === "On Location") {
              Alert.alert("Alert", "Have you reached on location?", [
                {
                  text: "No",
                  onPress: () => console.log("No Pressed"),
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    validati();
                    console.log(mainButtonName);
                  },
                },
              ]);
            } else if (mainButtonName === "Board") {
              Alert.alert("Alert", "Is everyone boarded?", [
                {
                  text: "No",
                  onPress: () => console.log("No Pressed"),
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    validati();
                    console.log(mainButtonName);
                  },
                },
              ]);
            }else if (mainButtonName === "Complete this trip") {
              Alert.alert("Alert", "Are you sure you want to complete this trip?", [
                {
                  text: "No",
                  onPress: () => console.log("No Pressed"),
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    validati();
                    console.log(mainButtonName);
                  },
                },
              ]);
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileImage: {
    animation: "slide_from_right",
    backgroundColor: "#edf2f7",
    borderRadius: 8,
    marginTop: 50,
    borderWidth: 0,
    paddingTop: 5,
    paddingBottom: 5,
    height: 120,
    width: 120,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#18599a",
  },
  addresscontainer: {
    backgroundColor: "#edf2f7",
    borderRadius: 8,
    elevation: 3,
    marginTop: 20,
    width: "90%",
  },
  headingUi: {
    backgroundColor: "#18599a",
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    padding: 5,

    width: "100%",
  },
  materialButtonPrimary: {
    borderTopEndRadius: 25,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    borderTopStartRadius: 25,
    marginStart: 0,

    backgroundColor: "seagreen",
  },
  locationButton: {
    borderTopEndRadius: 25,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    borderTopStartRadius: 25,
    width: "90%",
    alignSelf: "center",
    height: 50,
    justifyContent: "center",
    backgroundColor: "#18599a",
  },
});
