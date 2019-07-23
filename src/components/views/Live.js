import React, { Component } from "react";
import {
  Text,
  View,
  AsyncStorage,
  Dimensions,
  Alert,
  Modal,
  TouchableOpacity
} from "react-native";
import { styles } from "../../styles/live.styles";
import CustomFooter from "../customComponents/footer";
import { Button, Radio, Spinner, Container } from "native-base";
import { Header } from "react-native-elements";
import HTML from "react-native-render-html";
import { ScrollView } from "react-native-gesture-handler";
import TimerCountdown from "react-native-timer-countdown";
import LiveExam from "./LiveExam";
import moment from "moment";

export default class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      questions: [],
      answers: [],
      index: null,
      totalQuestions: null,
      isLoading: true,
      portionTime: 1,
      startTime: null,
      timeFinished: false,
      examFinished: false
    };
  }

  updateTime = newTime => {
    let x = moment(this.state.startTime).diff(moment());
    console.log("Diff", x);
    x = x / (1000 * 60);
    console.log("Diff", x);
    x = parseInt(this.state.portionTime + x);
    console.log("Diff", x);
    this.setState({
      portionTime: parseInt(newTime) + x
    });
  };
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

    _stop = () => {
      this.setState({ examFinished: true });
    };

    try {
      let response = await fetch(
        `https://www.gorporbyken.com/api/exam/details?id=${exam.id}&level=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      let responseJson = await response.json();
      // console.log("2nd request", responseJsone);
      if (responseJson.success) {
        this.setState({
          portions: responseJson.success.portions,
          questions: responseJson.success.portions[0].questions,
          portionTime: responseJson.success.portions[0].time,
          startTime: moment(),
          portionIndex: 0,
          index: 0,
          isLoading: false
        });
        console.log(this.state.questions.length);
      } else {
        if (responseJson.error == "already completed") {
          Alert.alert(
            "Exam Completed",
            "You have already given this exam! Proceed to Dashboard"
          );
          this.props.navigation.navigate("BookingETest");
        }
      }
    } catch (error) {
      alert("Error: " + error);
    }
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  answerQuestion = async (answer, index, questionId) => {
    let ans = this.state.answers;
    if (ans.length - 1 < index) {
      ans.push({ [questionId]: answer });
    } else {
      ans[ans.length - 1] = {
        [questionId]: answer
      };
    }
    this.setState({
      answers: ans
    });
    console.log(ans);
    // console.log(this.state);
  };

  getQuestion = (question, index) => {
    // console.log(question);
    let qNo = index + 1;
    if (question) {
      return (
        <React.Fragment key={question.id}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
          >
            <View style={{ marginTop: 22, marginHorizontal: 30 }}>
              <Text>Explanation</Text>
              <View>
                <HTML
                  html={question.explanation}
                  imagesMaxWidth={Dimensions.get("window").width}
                />
                <View style={styles.buttonView}>
                  <Button
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Hide Explanation</Text>
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
          <HTML
            html={question.question}
            imagesMaxWidth={Dimensions.get("window").width}
          />
          <Text
            onPress={() => {
              this.setModalVisible(true);
            }}
            style={{
              marginVertical: 5,
              color: "grey",
              fontSize: 14,
              alignContent: "flex-end",
              textDecorationStyle: "solid"
            }}
          >
            See Explanation
          </Text>
          <Text style={{ fontSize: 16 }}>{"Answers: \n"}</Text>
          {question.options.map(opt => {
            return (
              <React.Fragment key={opt.id}>
                <View style={{ flexDirection: "row" }}>
                  <Radio
                    id={opt.row + question.id}
                    key={opt.id}
                    style={{ flex: 1, marginTop: 5 }}
                    onPress={() =>
                      this.answerQuestion(opt.row, index, question.id)
                    }
                    selected={
                      this.state.answers.length &&
                      this.state.answers[this.state.answers.length - 1][
                        question.id
                      ] == opt.row
                        ? true
                        : false
                    }
                  />
                  <View style={{ flex: 7 }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.answerQuestion(opt.row, index, question.id)
                      }
                    >
                      <HTML
                        html={opt.option}
                        imagesMaxWidth={Dimensions.get("window").width}
                      />
                    </TouchableOpacity>
                  </View>
                  {/* <Text style={{ flex: 7 }}>{opt.option}</Text> */}
                </View>
              </React.Fragment>
            );
          })}
          <View style={styles.buttonView}>
            <Button
              style={styles.button}
              key={question.id}
              title="Next"
              onPress={() => this.setState({ index: index + 1 })}
            >
              <Text style={styles.buttonText}>Next</Text>
            </Button>
          </View>
        </React.Fragment>
      );
    } else {
      return (
        <View style={styles.buttonView}>
          <Button
            style={styles.button}
            title="Next Portion"
            onPress={() => this._handlePortionComplete()}
          >
            <Text style={styles.buttonText}>Next Portion</Text>
          </Button>
        </View>
      );
    }
  };

  _handlePortionComplete = async () => {
    const authToken = await AsyncStorage.getItem("authToken");
    const {
      props: {
        navigation: {
          state: {
            params: { exam }
          }
        }
      }
    } = this;
    // console.log(id, type);
    this.setState({ isLoading: true });
    try {
      var formData = new FormData();
      formData.append("exam", exam.id);
      formData.append("portion", this.state.portionIndex + 1);
      for (i = 0; i < this.state.answers.length; i++) {
        formData.append(
          "question[" + this.state.questions[i].id + "]",
          this.state.answers[i][this.state.questions[i].id]
        );
      }
      // console.log(formData);
      let response = await fetch(`https://www.gorporbyken.com/api/exam/save`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`
        },
        body: formData
      });
      let responseJson = await response.json();
      console.log(responseJson);
      if (responseJson.success) {
        if (this.state.portionIndex != this.state.portions.length - 1) {
          this.setState({
            questions: this.state.portions[this.state.portionIndex + 1]
              .questions,
            portionTime: this.state.portions[this.state.portionIndex + 1].time,
            portionIndex: this.state.portionIndex + 1,
            answers: [],
            index: 0,
            isLoading: false
          });
        } else {
          this.setState({
            finishedExam: true,
            examResult: responseJson.success,
            isLoading: false
          });
          console.log("Exam Result", responseJson);
        }
      } else {
        // this.setState(() => ({
        //   loginError: "Email or Password doesn't match",
        //   isLoading: false
        // }));
      }
    } catch (error) {
      // alert("There is some issue with server. Please try again later!");
      // this.props.navigation.navigate("Dashboard");
      console.log("error", error);
    }
  };

  _calculateResult = () => {
    return (
      <React.Fragment>
        {this.state.examResult.result ? (
          <Text style={{ fontSize: 20 }}>
            Exam Result: {this.state.examResult.result}
          </Text>
        ) : null}
        {this.state.examResult.level ? (
          <Text style={{ fontSize: 20 }}>
            Exam level: {this.state.examResult.level}
          </Text>
        ) : null}
        {this.state.examResult.portion1 ? (
          <Text style={{ fontSize: 20 }}>
            Portion 1:{" "}
            {this.state.examResult.portion1 == 1 ? "Completed" : "Incompleted"}
          </Text>
        ) : null}
        {this.state.examResult.portion2 ? (
          <Text style={{ fontSize: 20 }}>
            Portion 2:{" "}
            {this.state.examResult.portion2 == 1 ? "Completed" : "Incompleted"}
          </Text>
        ) : null}
        {this.state.examResult.total ? (
          <Text style={{ fontSize: 20 }}>
            Total Marks: {this.state.examResult.total}
          </Text>
        ) : null}
        {this.state.examResult.score ? (
          <Text style={{ fontSize: 20 }}>
            Obtained Marks: {this.state.examResult.score}
          </Text>
        ) : null}
        <View style={styles.buttonView}>
          <Button
            style={styles.button}
            onPress={() => this.props.navigation.navigate("Dashboard")}
            title="Proceed to Dashboard"
          >
            <Text style={styles.buttonText}>Proceed to Dashboard</Text>
          </Button>
        </View>
      </React.Fragment>
    );
  };

  render() {
    let questions = this.getQuestion(
      this.state.questions[this.state.index],
      this.state.index
    );
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
            style: { color: "yellow", fontSize: 28, flex: 1 }
          }}
        />
        <View style={styles.body}>
          {this.state.finishedExam ? (
            <React.Fragment>
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  marginHorizontal: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 18 }}>Exam Result</Text>
                {this._calculateResult()}
              </View>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!this.state.examFinished ? (
                <Text style={styles.timer}>
                  Time Remaining:
                  <TimerCountdown
                    initialMilliseconds={1000 * 60 * this.state.portionTime}
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
                      Alert.alert(
                        "Portion Time Finished",
                        "Time Finished. Starting Next Potion!"
                      );
                      this._handlePortionComplete();
                      this.setState({
                        timeFinished: true
                      });
                    }}
                    allowFontScaling={true}
                  />
                </Text>
              ) : null}
              <LiveExam
                updateTime={this.updateTime}
                exam={this.props.navigation.state.params.exam}
                timeFinished={this.state.timeFinished}
                navigation={this.props.navigation}
                stop={this._stop}
              />
            </React.Fragment>
          )}
        </View>
        <CustomFooter navigation={this.props.navigation} />
      </React.Fragment>
    );
  }
}
