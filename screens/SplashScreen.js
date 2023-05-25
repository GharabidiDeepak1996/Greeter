import AnimatedLottieView from "lottie-react-native";
import { Text, StyleSheet, View, StatusBar } from "react-native";
import * as Notifications from "expo-notifications";

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
export default function SplashScreen({ navigation }) {
  setTimeout(() => {
    // registerForPushNotificationsAsync();
    navigation.navigate("LoginScreen");
  }, 3000);

  return (
    <View style={styles.container}>
      <AnimatedLottieView source={require("../assets/logo.json")} />
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          fontFamily: "sans-serif",
          color: "rgba(64,109,151,1)",
        }}
      >
        Driver's App
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
