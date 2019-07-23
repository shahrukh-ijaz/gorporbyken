import { StyleSheet, Text, View } from "react-native";
import { Left } from "native-base";

export const styles = StyleSheet.create({
  container: {
    flex: 10,
    backgroundColor: "#012060"
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
    padding: 30,
    marginVertical: 30,
    marginHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#012060"
  },
  inputFields: {
    margin: 4,
    backgroundColor: "white",
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
    marginTop: 20,
    marginBottom: 30,
    marginHorizontal: 10
  },
  button: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#012060",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  }
});
