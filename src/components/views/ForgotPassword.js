import React, { Component } from "react";
import { WebView } from "react-native";
import { View } from "react-native";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mute: false,
      shouldPlay: true
    };
  }

  render() {
    return (
      <View
        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
      >
        <WebView
          style={{ flex: 1, marginTop: 25 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ uri: "https://www.gorporbyken.com/password/reset" }}
        />
      </View>
    );
  }
}
