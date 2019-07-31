import React, { Component } from "react";
import { Button, Spinner, Container, Item } from "native-base";
import { Text, View, AsyncStorage } from "react-native";
import { styles } from "../../styles/BeforeExam.styles";
import CustomFooter from "../customComponents/footer";
import { Header } from "react-native-elements";
import TimerCountdown from "react-native-timer-countdown";
import moment from "moment";

export default class BeforeExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      exam: null,
      rules: []
    };
  }

  async componentWillMount() {
    console.log("getting rules");
    let authToken = await AsyncStorage.getItem("authToken");
    try {
      let examStartResponse = await fetch(
        `https://api.gorporbyken.com/api/exam/rules`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      let responseJson = await examStartResponse.json();
      // console.log(responseJson);
      if (responseJson.success) {
        // console.log("Rules", responseJson.success);
        //this.props.navigation.navigate("Live");
        this.setState({ rules: responseJson.success, isLoading: false });
      } else {
        if (responseJson.error == "already completed") {
          alert("You have already given this exam! Proceed to Dashboard");
          this.props.navigation.navigate("BookingETest");
        }
      }
    } catch (error) {
      this.setState({ isLoading: false });
      alert("There is some issue with network. Try later!");
      this.props.navigation.navigate("Dashboard");
      console.log("error", error);
      // this.props.navigation.navigate("Signin");
    }
  }
  async componentDidMount() {
    let authToken = await AsyncStorage.getItem("authToken");
    const {
      props: {
        navigation: {
          state: {
            params: { exam }
          }
        }
      }
    } = this;
    console.log(exam);
    this.setState({ exam: exam });
    try {
      var formData = new FormData();
      formData.append("exam", exam.id);
      let examStartResponse = await fetch(
        `https://api.gorporbyken.com/api/exam/start`,
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
      let responseJson = await examStartResponse.json();
      if (responseJson.success) {
        // console.log("Getting Exam", exam);
        //this.props.navigation.navigate("Live");
        this.setState({ isLoading: false });
      } else {
        if (responseJson.error == "already completed") {
          alert("You have already given this exam! Proceed to Dashboard");
          this.props.navigation.navigate("BookingETest");
        }
      }
    } catch (error) {
      this.setState({ isLoading: false });
      alert("There is some issue with network. Try later!");
      this.props.navigation.navigate("Dashboard");
      console.log("error", error);
      // this.props.navigation.navigate("Signin");
    }
  }
  render() {
    const rules = this.state.rules.map(function(rule) {
      return (
        <Item key={rule.id}>
          <Text style={{ fontSize: 20 }}>{rule.rule}</Text>
        </Item>
      );
    });
    return (
      <React.Fragment>
        <Header
          containerStyle={{ backgroundColor: "#012060" }}
          centerComponent={{
            text: "GOR. POR. By KEN",
            style: { color: "yellow", fontSize: 28 }
          }}
        />
        <View style={styles.body}>
          {this.state.isLoading ? (
            <Container
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white"
              }}
            >
              <Spinner />
            </Container>
          ) : (
            <React.Fragment>
              <View style={{ marginHorizontal: 10 }}>
                <Text style={{ fontSize: 26 }}>Rules:</Text>
                {rules}
              </View>
              <Text style={styles.timer}>Exam starts in {"\n"}</Text>
              <Text style={styles.timer}>
                <TimerCountdown
                  initialMilliseconds={60 * 60 * 5}
                  formatMilliseconds={milliseconds => {
                    const remainingSec = Math.round(milliseconds / 1000);
                    const seconds = parseInt(
                      (remainingSec % 60).toString(),
                      10
                    );
                    const minutes = parseInt(
                      ((remainingSec / 60) % 60).toString(),
                      10
                    );
                    const hours = parseInt(
                      (remainingSec / 3600).toString(),
                      10
                    );
                    const s = seconds < 10 ? "0" + seconds : seconds;
                    const m = minutes < 10 ? "0" + minutes : minutes;
                    let h = hours < 10 ? "0" + hours : hours;
                    h = h === "00" ? "" : h + ":";
                    return h + m + ":" + s;
                  }}
                  onExpire={() => {
                    alert("Exam Started!");
                    this.props.navigation.navigate("Live", {
                      exam: this.state.exam
                    });
                  }}
                  allowFontScaling={true}
                />
              </Text>
            </React.Fragment>
          )}
        </View>
      </React.Fragment>
    );
  }
}
