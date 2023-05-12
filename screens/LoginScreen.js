import {
  Text,
  ToastAndroid,
  View,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { Button } from "@react-native-material/core";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [invalidEmail, setInvalidEmail] = useState("");
  const [invalidPass, setInvalidPass] = useState("");

  function validation() {
    let isValid = false;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    // else if (reg.test(email) === false) {
    //   setInvalidEmail("Invalid Email");
    //   isValid = false;
    // }
    if (email === "") {
      setInvalidEmail("Email should not be empty");
      isValid = false;
    } else if (password === "") {
      setInvalidPass("Password should not be empty");
      isValid = false;
    } else {
      setInvalidEmail("");
      setInvalidPass("");
      isValid = true;
    }
    return isValid;
  }

  checkEmail = (e) => {
    if (e === "") {
      setInvalidEmail("Email should not be empty");
    } else {
      setInvalidEmail("");
    }
  };

  checkPassword = (e) => {
    if (e === "") {
      setInvalidPass("Password should not be empty");
    } else {
      setInvalidPass("");
    }
  };

  const loginAuthenticate = async () => {
    try {
      const response = await fetch(
        "http://132.148.73.104:8082/core/ver1.0/verification/validate-greeter",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email.trim(),
            userpasscode: password.trim(),
          }),
        }
      );

      const statusCode = response.status;
      if (statusCode == 200) {
        const json = await response.json();
        console.log(json.isSuccess);

        if (json.isSuccess == true) {
          let obj = {
            userId: Object.values(json.greeterContext)[0],
            customerId: Object.values(json.greeterContext)[12],
            userName: Object.values(json.greeterContext)[1],
            emailAddress: Object.values(json.greeterContext)[5],
            firstName: Object.values(json.greeterContext)[6],
            lastName: Object.values(json.greeterContext)[7],
            fullName: Object.values(json.greeterContext)[8],
            mobileNo: Object.values(json.greeterContext)[9],
          };

          // storeData;
          const jsonValue = JSON.stringify(obj);

          AsyncStorage.setItem("loginDetails", jsonValue);
          navigation.navigate("BottomNavigation");
        } else {
          ToastAndroid.show(json.resultMessage, ToastAndroid.SHORT);
        }
        // setData(json.Pairings)
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.driversLogin}>Driver&#39;s {"\n"}Login</Text>
      <TextInput
        placeholder="email / mobile"
        onTouchStart={() => setInvalidEmail("")}
        onChangeText={(emailid) => setEmail(emailid)}
        style={styles.emailMobile}
      ></TextInput>
      <Text style={styles.errorText}>{invalidEmail}</Text>
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        onTouchStart={() => setInvalidPass("")}
        onChangeText={(pass) => setPassword(pass)}
        style={styles.textInput}
      ></TextInput>
      <Text style={styles.errorText}>{invalidPass}</Text>
      <Button
        title="Login"
        uppercase={false}
        style={styles.materialButtonPrimary}
        onPress={() => {
          if (validation()) {
            loginAuthenticate();
          }
        }}
      />

      {/* <Text style={styles.loremIpsum}>
          New to Driver&#39;s app ? Register here
        </Text> */}
    </View>
  );
}

// export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emailMobile: {
    fontFamily: "sans-serif",
    color: "#121212",
    height: 43,
    backgroundColor: "rgba(233,233,233,1)",
    borderRadius: 6,
    marginTop: 52,
    marginLeft: 28,
    marginRight: 28,
    paddingLeft: 10,
  },
  textInput: {
    fontFamily: "sans-serif",
    color: "#121212",
    height: 43,
    backgroundColor: "rgba(233,233,233,1)",
    borderRadius: 6,
    letterSpacing: 0,
    marginTop: 16,
    marginLeft: 28,
    marginRight: 28,
    paddingLeft: 10,
  },
  driversLogin: {
    fontWeight: "bold",
    fontFamily: "sans-serif",
    color: "#18599a",
    height: 80,
    width: 219,
    fontSize: 32,
    marginTop: 150,
    marginLeft: 28,
  },

  errorText: {
    fontFamily: "sans-serif",
    fontSize: 12,
    color: "red",
    marginLeft: 28,
  },

  materialButtonPrimary: {
    borderTopEndRadius: 25,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    borderTopStartRadius: 25,
    marginTop: 21,
    marginEnd: 28,
    marginStart: 28,
    backgroundColor: "#18599a",
  },
  loremIpsum: {
    fontFamily: "sans-serif",
    color: "#18599a",
    height: 26,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
    marginTop: 28,
    marginEnd: 28,
    marginStart: 28,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
});
