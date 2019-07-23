import React, { Component } from "react";
import { Container, Content, Item, Button, Icon, Spinner } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  Linking,
  TouchableOpacity,
  Alert
} from "react-native";
import { styles } from "../../styles/profile.styles";
import CustomFooter from "../customComponents/footer";
import { Header } from "react-native-elements";
import { ImagePicker, Permissions } from "expo";
import img from '../../../assets/avatar.png'

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: "",
        name: "",
        photo: null
      },
      hasCameraPermission: false,
      isLoading: true
    };
  }

  async componentDidMount() {
    const authToken = await AsyncStorage.getItem("authToken");
    const name = await AsyncStorage.getItem("userName");
    this.setState({
      user: {
        ...this.state.user,
        name: name
      },
      isLoading: false
    });
    try {
      let response = await fetch(
        "https://www.gorporbyken.com/api/user/details",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      let responseJson = await response.json();
      console.log("Profile", responseJson);
      // console.log("responseJson.success",responseJson.success);

      if (responseJson.success) {
        await AsyncStorage.setItem("userName", responseJson.success.name);
        AsyncStorage.setItem("Member", responseJson.success.paid);
        this.setState({ user: responseJson.success, isLoading: false });
      } else {
        // this.setState(() => ({
        //   loginError: "Email or Password doesn't match",
        //   isLoading: false
        // }));
      }
    } catch (error) {
      console.log("error", error);
      this.props.navigation.navigate("Signin");
    }
  }

  _requestCameraPermission = async () => {
    const status = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    console.log("status", status.status);
    this.setState({
      hasCameraPermission: status.status === "granted"
    });
  };

  _changeProfile = async () => {
    console.log("image picker");
    await this._requestCameraPermission();
    console.log("hasCameraPermission", this.state.hasCameraPermission);
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
      quality: 0.6
    });

    // console.log(result);

    if (!result.cancelled) {
      this.setState(
        {
          photo: result.uri,
          isLoading: true
        },
        async () => {
          var formData = new FormData();
          formData.append("image", result.base64);
          // console.log("formData", formData);
          const authToken = await AsyncStorage.getItem("authToken");
          const response = await fetch(
            "https://www.gorporbyken.com/api/user/update-profle-photo",
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
            this.setState({
              user: {
                ...this.state.user,
                photo: responseJson.success
              },
              isLoading: false
            });
          }
        }
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
            rightComponent={
              <Text
                style={{ flex: 1, paddingTop: 15 }}
                onPress={async () => {
                  this.setState({ isLoading: true });
                  await AsyncStorage.clear();
                  this.props.navigation.navigate("Auth");
                }}
              >
                <Icon name="ios-power" style={{ color: "red" }} />
              </Text>
            }
          />
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#012060"
            }}
          />
          <Container style={styles.header}>
            <TouchableOpacity onPress={this._changeProfile}>
              {this.state.user.photo === null ?
                <Image
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    borderColor: "yellow",
                    borderWidth: 2
                  }}
                  source={img}
                />
                :
                <Image
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    borderColor: "yellow",
                    borderWidth: 2
                  }}
                  source={{
                    uri:
                      "https://www.gorporbyken.com/public/" + this.state.user.photo
                  }}
                />
              }
            </TouchableOpacity>
          </Container>
          <Container style={styles.container}>
            <Content style={styles.content}>
              <View style={styles.inputFields}>
                <Icon name="ios-person" style={{ color: "#012060", flex: 1 }} />
                <Text style={{ fontSize: 18, color: "#012060", flex: 5 }}>
                  {this.state.user.name}
                </Text>
              </View>
              <View style={styles.inputFields}>
                <Icon name="ios-mail" style={{ color: "#012060", flex: 1 }} />
                <Text style={{ fontSize: 18, color: "#012060", flex: 5 }}>
                  {this.state.user.email}
                </Text>
              </View>
              <View style={styles.inputFields}>
                <Icon name="ios-cash" style={{ color: "#012060", flex: 1 }} />

                <Text style={{ fontSize: 18, color: "#012060", flex: 5 }}>
                  {this.state.user.paid == 0 ? "Free" : "Premium"}
                </Text>
              </View>
            </Content>
            <View style={styles.buttonView}>
              <Button
                style={[styles.button]}
                onPress={() => this.props.navigation.navigate("ChangePassword")}
              >
                <Text style={styles.buttonText}>Change Password</Text>
              </Button>
            </View>
            {this.state.user.paid ? (
              <View style={styles.buttonView}>
                <Button
                  style={[styles.button]}
                  onPress={() =>
                    Alert.alert(
                      'Get Premium!',
                      `"We are redirect you to web now kindly login and make payment using web for get premium membership"`,
                      [
                          { text: 'OK', onPress: () => Linking.openURL("https://gorporbyken.com/login") },
                      ],
                      { cancelable: true },
                  )
                    
                  }
                >
                  <Text style={styles.buttonText}>
                    <Icon style={styles.buttonText} name="ios-cash" />
                    {"  "}
                    Get Premium!
                </Text>
                </Button>
              </View>
            ) : null}
          </Container>
          <CustomFooter navigation={this.props.navigation} />
        </React.Fragment>
      );
  }
}
