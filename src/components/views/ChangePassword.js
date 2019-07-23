import React, { Component } from "react";
import {
  Container,
  Content,
  Item,
  Button,
  Icon,
  Spinner,
  Input
} from "native-base";
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  Linking,
  TouchableOpacity
} from "react-native";
import { styles } from "../../styles/confirmpassword.styles";
import CustomFooter from "../customComponents/footer";
import { Header } from "react-native-elements";
import { ImagePicker, Permissions } from "expo";

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _changePasswordRequest = async () => {
    if (
      this.state.newPassword === this.state.confirmPassword &&
      this.state.newPassword.length >= 8
    ) {
      const authToken = await AsyncStorage.getItem("authToken");
      var formData = new FormData();
      formData.append("old_password", this.state.oldPassword);
      formData.append("password", this.state.newPassword);
      formData.append("password_confirmation", this.state.confirmPassword);
      console.log("formData", formData);
      const response = await fetch(
        "https://www.gorporbyken.com/api/user/change-password",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`
          },
          body: formData
        }
      );
      const responseJson = await response.json();
      console.log("responseJson", responseJson);

      if (responseJson.success) {
        alert("Password Changed Successfully");
        this.props.navigation.navigate("Profile");
      } else if (responseJson.error) {
        alert(responseJson.error);
      }
    } else {
      alert(
        "Password length should be greater than 8 characters or your new Password and Confirm Password does'nt match"
      );
    }
  };

  render() {
    return this.state.isLoading ? (
      <Container
        style={{
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Spinner />
      </Container>
    ) : (
      <React.Fragment>
        <Header
          containerStyle={{ backgroundColor: "#012060" }}
          centerComponent={{
            text: "GOR. POR. By KEN",
            style: { color: "yellow", fontSize: 28 }
          }}
        />
        <Container style={styles.container}>
          <Content style={styles.content}>
            <Item style={styles.inputFields}>
              {/* <Text style={{ fontSize: 20, color: "white" }}>
                Old Password:{" "}
              </Text> */}
              <Input
                secureTextEntry={true}
                style={{ fontSize: 20, color: "#012060" }}
                placeholder="Old Password"
                onChangeText={oldPassword => this.setState({ oldPassword })}
              />
            </Item>
            <Item style={styles.inputFields}>
              {/* <Text style={{ fontSize: 20, color: "white" }}>
                New Password:{" "}
              </Text> */}
              <Input
                secureTextEntry={true}
                style={{ fontSize: 20, color: "#012060" }}
                placeholder="New Password"
                onChangeText={newPassword => this.setState({ newPassword })}
              />
            </Item>
            <Item style={styles.inputFields}>
              {/* <Text style={{ fontSize: 20, color: "#012060" }}>
                Confirm Password:{" "}
              </Text> */}
              <Input
                secureTextEntry={true}
                style={{ fontSize: 20, color: "#012060" }}
                placeholder="Confirm Password"
                onChangeText={confirmPassword =>
                  this.setState({ confirmPassword })
                }
              />
            </Item>
            <View style={styles.buttonView}>
              <Button
                style={[styles.button]}
                onPress={this._changePasswordRequest}
              >
                <Text style={styles.buttonText}>Change Password</Text>
              </Button>
            </View>
          </Content>
        </Container>
        <CustomFooter navigation={this.props.navigation} />
      </React.Fragment>
    );
  }
}
