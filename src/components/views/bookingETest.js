import React, { Component } from "react";
import { Button, Spinner, Container } from "native-base";
import { Text, View, AsyncStorage, Alert } from "react-native";
import { styles } from "../../styles/bookingETest.styles";
import Swiper from "react-native-swiper";
import CustomFooter from "../customComponents/footer";
import { Header } from "react-native-elements";
import TimerCountdown from "react-native-timer-countdown";
import moment from "moment";
import momentTz from 'moment-timezone'

export default class BookingETest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exams: null,
      bookedExams: null,
      isLoading: false
    };
  }
  async componentDidMount() {
    let m = await AsyncStorage.getItem("Member");
    this.setState({ membershipStatus: m, isLoading: true });
    try {
      console.log("sending Request");
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await fetch("https://www.gorporbyken.com/api/exam", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${authToken}`
        }
      });
      const responseJson = await response.json();
      console.log(responseJson);
      if (responseJson.success.length) {
        this.setState(state => ({
          ...state,
          exams: responseJson.success,
          isLoading: false
        }));
      }
    } catch (error) {
      console.log("errorrrrrrrr", error);
      alert("There is some issue with network. Try later!");
      this.props.navigation.navigate("Dashboard");
    }
  }
  
  render() {
    function convertToThiland(time)
    {
      var date = moment(time, "YYYY-MM-DD HH:mm:ss")
      .add(420, 'minutes')
      .format('YYYY-MM-DD HH:mm:ss');

        // var date = moment.utc(time).format('YYYY-MM-DD HH:mm:ss');
        // date = moment(time, "YYYY-MM-DD HH:mm:ss").add(5, 'hour');
        // console.log("check " ,date); // 2015-09-13 03:39:27
        // ///let new_date = 
        return date;
    }
    function getExamStartDifference(date1)
    {
      let date = convertToThiland(date1);
      console.log("in thiland time ", date);


      var today = new Date();
      var date_= today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = (today.getHours()+2) + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date_+' '+time;
      console.log(dateTime, "abhi ka h re");


      var res = Math.abs(date - dateTime) / 1000;

      var hours = Math.floor(res / 3600) % 24;   

      console.log("difference ye h ", hours);

  
      return hours;

    }
    const {
      state: { exams }
    } = this;
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
          <View style={styles.body}>
            {exams && (
              <Swiper>
                {exams &&
                  exams.map((object, index) => {                    
                    // console.log(momentTz('2019-06-28 12:15:00').tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss"), 'moment');
                    return (
                      <View key={index} style={{ flex: 1 }}>
                        <View style={styles.titleView}>
                          <Text style={styles.title}>{object.name}</Text>
                        </View>
                        <View style={styles.textView}>
                          <Text style={styles.text}>
                            Round For {`${object.name}\n`}
                          </Text>
                          <Text style={styles.text}>     
                            {`abc ${getExamStartDifference(object.start_time)}\n`}       
                            {`\nStart Time: ${convertToThiland(object.start_time)}\nEnd Time:${
                              convertToThiland(object.end_time)
                              }\n`}
                          </Text>
                        </View>
                        <View style={styles.buttonView}>
                          {object.booking ? (
                            momentTz(
                              object.start_time
                            ).tz('Asia/Bangkok').diff(momentTz()) > 0 ? (
                                <Button
                                  style={styles.button}
                                  onPress={() => {
                                    {
                                      Alert.alert("Exam", "Exam not started yet");
                                    }
                                  }}
                                >
                                  <Text style={styles.buttonText}>
                                    <TimerCountdown
                                      initialMilliseconds={momentTz(
                                        object.start_time
                                      ).tz('Asia/Bangkok').diff(momentTz())}
                                      formatMilliseconds={milliseconds => {
                                        const remainingSec = Math.round(
                                          milliseconds / 1000
                                        );
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
                                        const s =
                                          seconds < 10 ? "0" + seconds : seconds;
                                        const m =
                                          minutes < 10 ? "0" + minutes : minutes;
                                        let h = hours < 10 ? "0" + hours : hours;
                                        h = h === "00" ? "" : h + ":";
                                        return h + m + ":" + s;
                                      }}
                                      allowFontScaling={true}
                                    />
                                  </Text>
                                </Button>
                              ) : momentTz(object.end_time).tz('Asia/Bangkok').diff(momentTz()) > 0 ? (
                                <Button
                                  style={styles.button}
                                  onPress={() => {
                                    this.props.navigation.navigate("BeforeExam", {
                                      exam: object
                                    });
                                  }}
                                >
                                  <Text style={styles.buttonText}>Start Exam</Text>
                                </Button>
                              ) : (
                                  <Button
                                    style={styles.button}
                                    onPress={() => alert("This Exam is finished")}
                                  >
                                    <Text style={styles.buttonText}>
                                      Exam Finished
                              </Text>
                                  </Button>
                                )
                          ) : (
                              <Button
                                style={[styles.button, { backgroundColor: "grey" }]}
                                onPress={() => {
                                  if (
                                    object.paid == 1 &&
                                    this.state.membershipStatus != 1
                                  ) {
                                    alert(
                                      "This is a premium lecture. To buy a premium account proceed to Profile -> Membership."
                                    );
                                  } else {
                                    this.props.navigation.navigate("Level", {
                                      exam: object
                                    });
                                  }
                                }}
                              >
                                <Text
                                  style={[styles.buttonText, { color: "black" }]}
                                >
                                  Book Exam
                            </Text>
                              </Button>
                            )}
                        </View>
                        <View style={styles.buttonView} />
                      </View>
                    );
                  })}
              </Swiper>
            )}
          </View>
          <CustomFooter navigation={this.props.navigation} />
        </React.Fragment>
      );
  }
}
