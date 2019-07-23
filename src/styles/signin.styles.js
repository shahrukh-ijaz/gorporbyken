import { StyleSheet, Text, View } from "react-native";
import { Left } from "native-base";
import { red } from "ansi-colors";

export const styles = StyleSheet.create({
  header: {
    flex: 4,
    paddingTop: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    alignItems: "center",
    justifyContent: "center"
  },
  body: {
    flex: 5,
    backgroundColor: "green"
  },
  content: {
    marginTop: 30,
    marginHorizontal: 30
  },
  footer: {
    flex: 1
  },
  button: {
    flex: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  signupButton: {
    flex: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#012060",
    marginHorizontal: 4
  },
  buttonView: {
    flexDirection: "row"
  },
  inputFields: {
    borderRadius: 7
  },
  forgotPasswordView: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginTop: 10
  },
  forgotPasswordText: {
    fontSize: 14,
    marginTop: 8,
    color: "gray"
  }
});
