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
  pass: {
    color: "green",
    fontSize: 18
  },
  fail: {
    color: "red",
    fontSize: 18
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
    paddingHorizontal: 10
  },
  button: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonView: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  buttonText: {
    color: "white",
    fontSize: 18
  }
});
