import React, { Component } from "react";
import {
  Text,
  View,
  AsyncStorage,
  ScrollView,
  Dimensions,
  Modal,
  TouchableOpacity
} from "react-native";
import { styles } from "../../styles/exam.styles";
import CustomFooter from "../customComponents/footer";
import {
  Button,
  Radio,
  Spinner,
  List,
  ListItem,
  Content,
  Container,
  Icon
} from "native-base";

import HTML from "react-native-render-html";
import { Header } from "react-native-elements";
import { ProgressBar, Colors } from "react-native-paper";

export default class Exam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      questions: [],
      answers: [],
      index: null,
      totalQuestions: null,
      quizCompleted: false,
      isLoading: false,
      answered: false,
      ansInd: [],
      btn: false
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  async componentDidMount() {
    const authToken = await AsyncStorage.getItem("authToken");
    const {
      props: {
        navigation: {
          state: {
            params: { id, type }
          }
        }
      }
    } = this;
    // console.log(id, type);
    this.setState({ isLoading: true });
    try {
      let response = await fetch(
        "https://api.gorporbyken.com/api/quiz/details?id=" + id,
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
      // console.log("Questions", responseJson.success.questions);
      if (responseJson.success) {
        this.setState({ questions: responseJson.success.questions });
        // console.log(this.state.questions.length);
        this.setState({
          totalQuestions: this.state.questions.length - 1,
          index: 0,
          isLoading: false
        });
      } else {
        // this.setState(() => ({
        //   loginError: "Email or Password doesn't match",
        //   isLoading: false
        // }));
      }
    } catch (error) {
      console.log("error", error);
      // this.props.navigation.navigate("Signin");
    }
  }

  answerQuestion = async (answer, index) => {
    // console.log(answer, index);
    let ans = this.state.answers;
    ans[index] = answer;

    await this.setState({
      answers: ans,
      answered: true,
      ansIndx: index,
      answr: answer,
      btn: true
    });
    // console.log(this.state.ansInd, '-----');
    // console.log(index, '--index---');
    // console.log(this.state);
  };

  evaluateQuiz = () => {
    let questions = this.state.questions;
    let answers = this.state.answers;
    // console.log(answers);
    let total = 0;
    let marks = 0;
    let result;
    for (i = 0; i < this.state.answers.length; i++) {
      total = total + parseInt(questions[i].marks, 10);
      if (questions[i].answer == answers[i]) {
        marks = marks + parseInt(questions[i].marks, 10);
      }
    }
    result = marks / total;
    if (this.state.index == this.state.totalQuestions) {
      return (
        <React.Fragment>
          <Text style={result >= 0.5 ? styles.pass : styles.fail}>
            Result: {result >= 0.5 ? "Pass" : "Fail"}
          </Text>
          <Text>You obtained {marks} marks</Text>
        </React.Fragment>
      );
    } else {
      return null;
    }
  };

  getQuestion = (question, index) => {
    let qNo = index + 1;
    if (question) {
      // console.log(question , 'question****');
      return (
        <React.Fragment key={question.id}>
          <ProgressBar
            style={{ marginHorizontal: 20 }}
            progress={(index + 1) / this.state.questions.length}
            color={"#012060"}
          />
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => { }}
          >
            <View style={{ marginTop: 22, marginHorizontal: 30 }}>
              <Text>Explanation</Text>
              <ScrollView>
                <HTML
                  html={question.explanation}
                  imagesMaxWidth={Dimensions.get("window").width}
                />
                <View style={styles.buttonView}>
                  <Button
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}
                    style={styles.nextButton}
                  >
                    <Text style={styles.buttonText}>Hide Explanation</Text>
                  </Button>
                </View>
              </ScrollView>
            </View>
          </Modal>
          <Text style={{ fontSize: 18 }}>Question:</Text>
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
          {question.options.map((opt, ind) => {
            var num = ind;
            var n = num.toString();
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
                      ? question.answer === n
                        ?
                        { borderWidth: 2, borderColor: "green", opacity: 1 }
                        :
                        { borderWidth: 2, borderColor: "red", opacity: 1 }
                      :
                      { borderWidth: 2, borderColor: "grey", opacity: 0.7 },
                    this.state.btn &&
                    question.answer === n
                    &&
                    { borderWidth: 2, borderColor: "green", opacity: 1 }
                  ]}
                >
                  <View style={{ flex: 7 }}>
                    <TouchableOpacity
                      onPress={() => this.answerQuestion(opt.row - 1, index)}
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
          <View style={index > 0 ? [styles.buttonView, { justifyContent: 'space-between' }] : styles.buttonView}>
            {index > 0
              &&
              <Button
                style={styles.button}
                onPress={() => {
                  var arrAns = this.state.ansInd;
                  arrAns.pop()
                  this.setState({ index: index - 1, btn: false })
                }}
              >
                <Icon
                  name="md-arrow-back"
                  style={{ color: "white", fontSize: 20 }}
                />
              </Button>}
            {this.state.btn &&
              <Button
                style={styles.button}
                key={question.id}
                title="Submit Answer"
                onPress={
                  () =>
                  // this.state.answered
                  // ?
                  {
                    if (this.state.answers.length != index) {
                      var answr = this.state.answr;
                      var arr = this.state.ansInd;
                      arr.push(answr)
                      let ans = this.state.answers;
                      ans[index] = null;
                      this.setState({
                        answers: ans,
                        answered: true,
                        ansInd: arr
                      });
                    }
                    index < this.state.totalQuestions
                      ? this.setState({ index: index + 1, answered: false, btn: false })
                      : this.setState({ quizCompleted: true });
                  }
                  // : null
                }
              >
                <Icon
                  name="md-arrow-forward"
                  style={{ color: "white", fontSize: 20 }}
                />
                {/* <Text style={styles.buttonText}>Next</Text> */}
              </Button>
            }
          </View>
        </React.Fragment>
      );
    } else {
      return null;
    }
  };

  generateQuizKey = () => {
    let result = this.evaluateQuiz();
    let { answers, questions, ansInd } = this.state;
    console.log(ansInd, '*******');

    let keyView = (
      // <View style={{ flexDirection: "column", flex: 5 }}>
      <View>
        {result}
        <Content>
          <List>
            {questions.map(function (question, i) {
              // console.log(question , 'question++++++');

              return (
                <ListItem
                  key={question.id}
                  style={{
                    flexDirection: "column",
                    flex: 1,
                    borderWidth: 1,
                    justifyContent: "space-between",
                    marginTop: 10
                  }}
                >
                  <HTML
                    style={{ borderWidth: 1 }}
                    html={question.question}
                    imagesMaxWidth={Dimensions.get("window").width}
                  />
                  <Text key={ansInd[i]}>Answer:</Text>
                  {ansInd[i] != null ? (
                    <HTML
                      html={question.options[parseInt(ansInd[i])].option}
                      imagesMaxWidth={Dimensions.get("window").width}
                    />
                  ) : null}
                  <Text key={question.id}>Correct:</Text>
                  <HTML
                    html={question.options[parseInt(question.answer)].option}
                    imagesMaxWidth={Dimensions.get("window").width}
                  />
                  {/* <Text key={answers[i]}>Answer: {parseInt(answers[i])}</Text>
                  <Text key={question.id}>
                    Correct: {parseInt(question.answer)}
                  </Text> */}
                </ListItem>
              );
            })}
          </List>
          <View style={styles.buttonView}>
            <Button
              style={styles.button}
              onPress={() => this.props.navigation.navigate("Dashboard")}
            >
              <Text style={styles.buttonText}> Close</Text>
            </Button>
          </View>
        </Content>
      </View>
    );
    return keyView;
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
              style: { color: "yellow", fontSize: 28 }
            }}
          />
          <View style={styles.body}>
            <ScrollView style={styles.questionView}>
              {this.state.quizCompleted ? this.generateQuizKey() : questions}
            </ScrollView>
          </View>
          <CustomFooter navigation={this.props.navigation} />
        </React.Fragment>
      );
  }
}
