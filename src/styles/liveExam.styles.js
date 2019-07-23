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
    paddingTop: 15
  },
  questionView: {
    // flex: 9,
    margin: 5,
    paddingHorizontal: 10
  },
  nextButton: {
    flex: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
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
