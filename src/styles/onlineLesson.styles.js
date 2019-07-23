import { StyleSheet, Text, View } from "react-native";
import { Left } from "native-base";

export const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    flex: 1
  },
  title: {
    color: "black",
    fontSize: 24,
    fontWeight: 'bold',
  },
    titleView: {
    flex: 1,
    marginVertical: 6,
    marginHorizontal: 6,
    backgroundColor: "yellow",
    alignItems: 'center',
    justifyContent: 'center'  
  },
  body:{
    flex: 9
  },
  itemHeader: {
    backgroundColor: "gray"
  },
  itemHeaderText: {
    color: 'white',
    fontSize: 16
  },
  itemText: {
    fontSize: 14
  }
});
