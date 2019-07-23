import React, { Component } from "react";
import {
  Text,
  View,
  AsyncStorage,
  Dimensions,
  Alert,
  TouchableOpacity,
  Linking
} from "react-native";
import { styles } from "../../styles/liveExam.styles";
import { Icon, Button, Radio, Spinner, Container } from "native-base";
import HTML from "react-native-render-html";
import { ScrollView } from "react-native-gesture-handler";
import { ProgressBar } from "react-native-paper";

export default class LiveExam extends Component {
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
      answered: false
    };
  }

  static getDerivedStateFromProps(props) {
    props.timeFinished ? () => this._handlePortionComplete() : null;
    return {};
  }

  async componentDidMount() {
    let authToken = await AsyncStorage.getItem("authToken");
    const {
      props: { exam }
    } = this;

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
      answers: ans,
      answered: true
    });
    // console.log(ans);\
  };

  getQuestion = (question, index) => {
    // console.log(question);
    let qNo = index + 1;
    if (question) {
      return (
        <React.Fragment key={question.id}>
          <ProgressBar
            style={{ marginHorizontal: 20 }}
            progress={(index + 1) / this.state.questions.length}
            color={"#012060"}
          />
          <Text style={{ fontSize: 18 }}>Question:</Text>
          <HTML
            html={question.question}
            imagesMaxWidth={Dimensions.get("window").width}
          />
          <Text style={{ fontSize: 16 }}>{"Answers: \n"}</Text>
          {question.options.map(opt => {
            return (
              <React.Fragment key={opt.id}>
                <View
                  style={[
                    {
                      flexDirection: "row",
                      margin: 5,
                      borderRadius: 5,
                      padding: 5
                    },
                    this.state.answers[index] == opt.row - 1
                      ? { borderWidth: 2, borderColor: "#012060", opacity: 1 }
                      : { borderWidth: 2, borderColor: "grey", opacity: 0.7 }
                  ]}
                >
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
              onPress={() =>
                this.state.answered
                  ? this.setState({ index: index + 1, answered: false })
                  : null
              }
            >
              <Icon
                name="md-arrow-forward"
                style={{ color: "white", fontSize: 20 }}
              />
              {/* <Text style={styles.buttonText}>Next</Text> */}
            </Button>
          </View>
        </React.Fragment>
      );
    } else {
      return (
        <View style={styles.buttonView}>
          <Button
            style={styles.nextButton}
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
      props: { exam }
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
          let p = this.state.portionIndex;
          this.setState({
            questions: this.state.portions[this.state.portionIndex + 1]
              .questions,
            portionIndex: this.state.portionIndex + 1,
            answers: [],
            index: 0,
            isLoading: false
          });
          this.props.updateTime(this.state.portions[p + 1].time);
        } else {
          this.setState({
            finishedExam: true,
            examResult: responseJson.success,
            isLoading: false
          });
          console.log("Exam Result", responseJson);
          this.props.stop();
        }
      } else {
        // this.setState(() => ({
        //   loginError: "Email or Password doesn't match",
        //   isLoading: false
        // }));
      }
    } catch (error) {
      console.log("error", error);
      // alert("There is some issue with server. Please try again later!");
      // this.props.navigation.navigate("Dashboard");
      // console.log("error", error);
    }
  };

  _calculateResult = () => {
    const {
      props: { exam }
    } = this;
    return (
      <React.Fragment>
        {this.state.examResult.result ? (
          <Text style={{ fontSize: 20, color: "#012060" }}>
            Exam Result:{" "}
            {this.state.examResult.result == "Pass" ? (
              <Text style={{ color: "green" }}>Pass</Text>
            ) : (
              <Text style={{ color: "red" }}>Fail</Text>
            )}
          </Text>
        ) : null}
        {this.state.examResult.total ? (
          <Text style={{ fontSize: 20, color: "#012060" }}>
            Total Marks: {this.state.examResult.total}
          </Text>
        ) : null}
        {this.state.examResult.score ? (
          <Text style={{ fontSize: 20, color: "#012060" }}>
            Obtained Marks: {this.state.examResult.score}
          </Text>
        ) : null}
        <View style={styles.buttonView}>
          <Button
            style={styles.nextButton}
            onPress={() => this.props.navigation.navigate("Dashboard")}
            title="Proceed to Dashboard"
          >
            <Text style={styles.buttonText}>Proceed to Dashboard</Text>
          </Button>
        </View>
        <View style={styles.buttonView}>
          <Button
            style={styles.nextButton}
            onPress={() =>
              this.props.navigation.navigate("LiveSummary", { exam: exam })
            }
            title="Proceed to Dashboard"
          >
            <Text style={styles.buttonText}>Detailed Summary</Text>
          </Button>
        </View>
        <View style={styles.buttonView}>
          <Button
            style={styles.nextButton}
            onPress={() => {
              Linking.openURL(exam.solution);
            }}
            title="Proceed to Dashboard"
          >
            <Text style={styles.buttonText}>Check Solution</Text>
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
              {this._calculateResult()}
            </View>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <ScrollView style={styles.questionView}>{questions}</ScrollView>
          </React.Fragment>
        )}
      </View>
    );
  }
}
