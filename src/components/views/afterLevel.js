import React, { Component } from "react";
import { Button, Container } from "native-base";
import { Text, View, AsyncStorage } from "react-native";
import { styles } from "../../styles/afterLevel.styles";
import Swiper from "react-native-swiper";
import { CheckBox } from "react-native-elements";
import CustomFooter from "../customComponents/footer";
import { Header } from "react-native-elements";

export default class AfterLevel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  _bookExam = async () => {
    const {
      props: {
        navigation: {
          state: {
            params: { exam, level }
          }
        }
      }
    } = this;
    this.setState({ isLoading: true });

    try {
      var formData = new FormData({ x: "abc" });
      formData.append("exam", exam.id);
      formData.append("level", level);
      console.log("formData", formData);
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await fetch(
        "https://www.gorporbyken.com/api/exam/booking",
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
      if (responseJson.success == "Already Booked") {
        alert(responseJson.success);
        this.props.navigation.navigate("Dashboard");
      } else if (responseJson.success.id) {
        alert("Booking Successful!");
        this.props.navigation.navigate("Dashboard");
      }
    } catch (error) {
      console.log("errorrrrrrrr", error);
      alert("Booking Failed! Try again Later!");
    }
  };

  render() {
    const {
      props: {
        navigation: {
          state: {
            params: { exam }
          }
        }
      }
    } = this;
    return (
      <React.Fragment>
        <Header
          containerStyle={{ backgroundColor: "#012060" }}
          centerComponent={{
            text: "GOR. POR. By KEN",
            style: { color: "yellow", fontSize: 28 }
          }}
        />
        <View style={styles.textView}>
          <Text>
            BOOKING E-EXAM{"\n"}Plaese select the E-Exam round{"\n"}Select only
            one round{"\n"}per E-Exam set
          </Text>
        </View>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{exam.name}</Text>
        </View>
        <View style={styles.body}>
          <Swiper>
            <View style={{ flex: 1 }}>
              <Text style={styles.bodyHeading}>Date: {exam.start_date}</Text>
              <CheckBox
                checked={this.state.checkbox1}
                onPress={() =>
                  this.setState({ checkbox1: !this.state.checkbox1 })
                }
                style={styles.checkBox}
                title={`${exam.start_time} - ${exam.end_time}`}
              />
              <View style={styles.buttonView}>
                <Button style={styles.button} onPress={this._bookExam}>
                  <Text style={styles.buttonText}>Book Now</Text>
                </Button>
              </View>
            </View>
          </Swiper>
        </View>
        <CustomFooter navigation={this.props.navigation} />
      </React.Fragment>
    );
  }
}
