import { TextInput, View, StyleSheet } from "react-native";

const InputEditext = (props) => {

    return(
        <View>
            <TextInput
            placeholder= "email / mobile"
            style={styles.enterEmployeeId}
          />
        </View>
    );

}

export default InputEditext;

const styles = StyleSheet.create({
    enterEmployeeId: {
        fontFamily: "sans-serif",
        color: "#121212",
        height: 51,
        width: 224,
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 0.5,
        borderColor: "#000",
        borderStyle: "solid",
        borderRadius: 8,
        shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
          width: 3,
          height: 3,
        },
        paddingStart: 10,
        elevation: 0,
        shadowOpacity: 0.15,
        shadowRadius: 10,
        textAlign: "left",
        marginTop: 12,
      }
});