import { StyleSheet, Text, View } from "react-native";
import { Left } from "native-base";

export const styles = StyleSheet.create({
  container: {
    flex: 6
  },
  header: {
    backgroundColor: "#012060",
    flex: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    marginTop: 15,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#012060",
    marginBottom: 15
  },
  inputFields: {
    backgroundColor: "transparent",
    margin: 4,
    paddingHorizontal: 5,
    height: 40,
    flexDirection: "row",
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
    flexDirection: "row",
    marginBottom: 30,
    marginHorizontal: 10
  },
  button: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#012060"
  }
});
