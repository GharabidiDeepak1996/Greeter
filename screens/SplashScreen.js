import AnimatedLottieView from "lottie-react-native";
import { Text, StyleSheet, View, StatusBar } from "react-native";

export default function SplashScreen({ navigation }) {
  setTimeout(() => {
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
