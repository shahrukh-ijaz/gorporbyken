import { StyleSheet, Text, View } from "react-native";

export const styles = StyleSheet.create({
  instructionView: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderWidth: 1,
    padding: 10
  },
  timer: {
    fontSize: 28,
    color: "#012060"
  },
  body: {
    flex: 9,
    borderWidth: 1,
    margin: 10,
    paddingTop: 15
  },
  questionView: {
    // flex: 9,
    margin: 5,
    padding: 20
  },
  button: {
    flex: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonView: {
    flexDirection: "row",
    marginVertical: 6
  },
  buttonText: {
    color: "white",
    fontSize: 18
  }
});
