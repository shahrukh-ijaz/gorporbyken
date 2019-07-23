import { StyleSheet, Text, View } from "react-native";
import { Left } from "native-base";

export const styles = StyleSheet.create({
    titleView: {
        flex: 1,
        backgroundColor: "#012060",
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    titleText: {
        color: "white"
    },
    body: {
        flex: 9
    },
    itemView: {
        backgroundColor: "white",
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    itemText:{
        color: "gray",
        fontSize: 16,
    }
});
