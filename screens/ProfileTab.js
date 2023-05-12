import { useState } from "react";
import { Image, View, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileTab() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  AsyncStorage.getItem("loginDetails").then((val) => {
    const parsed = JSON.parse(val);
    //let name =parsed.userName
    setUserName(parsed.userName);
    setUserEmail(parsed.emailAddress);
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContent}>
        <Image
          style={styles.avatar}
          source={{
            uri: "https://bootdey.com/img/Content/avatar/avatar1.png",
          }}
        />
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.name}>{userEmail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  headerContent: {
    top: 60,
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  name: {
    color: "white",
    fontSize: 15,
  },
});
