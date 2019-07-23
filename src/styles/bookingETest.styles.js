import { StyleSheet, Text, View } from "react-native";
import { Left } from "native-base";

export const styles = StyleSheet.create({
  instructionsView: {
    flex: 3,
    margin: 10,
    borderWidth: 2,
    paddingLeft: 30,
    paddingTop: 5
  },
  body: {
    flex: 10
  },
  instructionsText: {
    fontSize: 18
  },
  titleView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#b5b5b5",
    flexDirection: "row",
    margin: 10
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  textView: {
    flex: 4,
    padding: 30
  },
  text: {
    fontSize: 16
  },
  buttonView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  }
});
