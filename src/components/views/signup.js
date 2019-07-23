import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Item,
  Input,
  Button,
  CardItem,
  Spinner
} from "native-base";
import { StyleSheet, Text, View, Image } from "react-native";
import { styles } from "../../styles/signup.styles";
import Toast from "react-native-root-toast";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      visible: false
    };
  }

  _signup = async () => {
    console.log(this.state);
    if (this.state.name.length < 1) {
      this.setState(() => ({ nameError: "First name is required." }));
    } else {
      this.setState(() => ({ nameError: null }));
      if (this.state.email.trim() === "") {
        this.setState(() => ({ emailError: "Email is required." }));
      } else {
        this.setState(() => ({ emailError: null }));
        if (this.state.password.length < 8) {
          this.setState(() => ({
            passwordError: "Password should atleast be 8 characters long "
          }));
        } else {
          this.setState(() => ({ passwordError: null }));
          if (
            this.state.password.localeCompare(this.state.password_confirmation)
          ) {
            this.setState(() => ({
              confirmPasswordError: "Password doesn't match"
            }));
          } else {
            this.setState(() => ({ confirmPasswordError: null }));
            this.setState({ isLoading: true });
            try {
              let response = await fetch(
                "https://www.gorporbyken.com/api/register",
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    email: this.state.email,
                    name: this.state.name,
                    password: this.state.password,
                    password_confirmation: this.state.password_confirmation
                  })
                }
              );
              let responseJson = await response.json();
              if (responseJson.success) {
                console.log("response", responseJson);
                // this.setState({ signUpError: null});
                this.setState({ visible: true, message: "Signup Successful!" });

                let toast = Toast.show(this.state.message, {
                  duration: Toast.durations.SHORT,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 2
                });

                // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
                setTimeout(function() {
                  Toast.hide(toast);
                }, 3000);

                this.props.navigation.navigate("Signin");
                // console.log("token", responseJson.success.token);
              } else {
                this.setState(() => ({
                  signUpError: "",
                  isLoading: false,
                  visible: true,
                  message:
                    "Signup Failed! This email is already registered. Try to signup from website http://www.gorporbyken.com/register"
                }));

                let toast = Toast.show(this.state.message, {
                  duration: Toast.durations.SHORT,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 2
                });

                // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
                setTimeout(function() {
                  Toast.hide(toast);
                }, 6000);
              }
            } catch (error) {
              console.log("error", error);
            }
          }
        }
      }
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
        <Container style={styles.header}>
          <Image
            style={{ width: 200, height: 200, borderRadius: 100 }}
            source={require("../../../assets/logo.jpeg")}
          />
        </Container>

        <Container style={styles.container}>
          <Content style={styles.content}>
            <Item style={styles.inputFields}>
              <Input
                placeholder="Full Name"
                onChangeText={name => this.setState({ name })}
              />
            </Item>
            {!!this.state.nameError && (
              <Text style={{ color: "red" }}>{this.state.nameError}</Text>
            )}
            <Item style={styles.inputFields}>
              <Input
                placeholder="Email"
                onChangeText={email => this.setState({ email })}
              />
            </Item>
            {!!this.state.emailError && (
              <Text style={{ color: "red" }}>{this.state.emailError}</Text>
            )}
            <Item style={styles.inputFields}>
              <Input
                secureTextEntry={true}
                placeholder="Password"
                onChangeText={password => this.setState({ password })}
              />
            </Item>
            {!!this.state.passwordError && (
              <Text style={{ color: "red" }}>{this.state.passwordError}</Text>
            )}
            <Item style={styles.inputFields}>
              <Input
                secureTextEntry={true}
                placeholder="Confirm Password"
                onChangeText={password_confirmation =>
                  this.setState({ password_confirmation })
                }
              />
            </Item>
            {!!this.state.confirmPasswordError && (
              <Text style={{ color: "red" }}>
                {this.state.confirmPasswordError}
              </Text>
            )}
            {!!this.state.signUpError && (
              <Text style={{ color: "red" }}>{this.state.signUpError}</Text>
            )}
            <View style={styles.buttonView}>
              <Button style={[styles.button]} onPress={() => this._signup()}>
                <Text style={{ color: "white" }}>Create Account</Text>
              </Button>
            </View>
          </Content>
        </Container>
        <Container style={styles.footer}>
          <View style={styles.buttonView}>
            <Button
              style={styles.signupButton}
              onPress={() => this.props.navigation.navigate("Signin")}
            >
              <Text style={{ color: "#012060", fontSize: 18 }}>Sign In</Text>
            </Button>
          </View>
        </Container>
      </React.Fragment>
    );
  }
}
