import React, { Component } from "react";
import { Button, Spinner, Container, Item, Body } from "native-base";
import { Text, View, AsyncStorage, Dimensions } from "react-native";
import { styles } from "../../styles/LiveSummary.styles";
import { Header } from "react-native-elements";
import HTML from "react-native-render-html";
import { ScrollView } from "react-native-gesture-handler";

export default class LiveSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      exam: null,
      portion1: [],
      portion2: [],
      score: {}
    };
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
        `https://www.gorporbyken.com/api/exam/score?exam=` + exam.id,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      let responseJson = await examStartResponse.json();
      if (responseJson.success) {
        console.log(responseJson);
        this.setState({
          portion1: responseJson.success.portion1,
          portion2: responseJson.success.portion2,
          score: responseJson.success.score,
          isLoading: false
        });
      } else {
        this.setState({ isLoading: false });
        console.log(examStartResponse);
      }
    } catch (error) {
      this.setState({ isLoading: false });
      alert(
        "There is some issue with result details. Visit Website for details!"
      );
      this.props.navigation.navigate("Dashboard");
      console.log("error", error);
      // this.props.navigation.navigate("Signin");
    }
  }

  render() {
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
          <ScrollView style={{ flex: 10 }}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white"
              }}
            >
              {this.state.isLoading ? (
                <Container
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#white"
                  }}
                >
                  <Spinner />
                </Container>
              ) : (
                <React.Fragment>
                  <Body style={{ marginTop: 10 }}>
                    <Text style={{ color: "#012060", fontSize: 22 }}>
                      Poriton 1
                    </Text>
                  </Body>
                  {this.state.portion1.map(por => {
                    return (
                      <View id={por.id} style={{ paddingTop: 10 }}>
                        <Text style={{ fontSize: 18, alignSelf: "center" }}>
                          Question
                        </Text>
                        <HTML
                          html={por.question}
                          imagesMaxWidth={Dimensions.get("window").width}
                        />
                        <Text style={{ alignSelf: "center" }}>
                          Correct: {this.state.score[por.id].answer}
                        </Text>
                        <Text style={{ alignSelf: "center" }}>
                          Attempted: {this.state.score[por.id].attempted}
                        </Text>
                        <Text style={{ alignSelf: "center" }}>
                          True/False:{" "}
                          <Text
                            style={
                              this.state.score[por.id].true == 0
                                ? { color: "red" }
                                : { color: "green" }
                            }
                          >
                            {this.state.score[por.id].true == 0
                              ? "false"
                              : "true"}
                          </Text>
                        </Text>
                      </View>
                    );
                  })}
                  <Body style={{ marginTop: 10 }}>
                    <Text style={{ color: "#012060", fontSize: 22 }}>
                      Poriton 2
                    </Text>
                  </Body>
                  {this.state.portion2.map(por => {
                    return (
                      <View id={por.id} style={{ paddingTop: 10 }}>
                        <Text style={{ fontSize: 18, alignSelf: "center" }}>
                          Question
                        </Text>
                        <HTML
                          html={por.question}
                          imagesMaxWidth={Dimensions.get("window").width}
                        />
                        <Text style={{ alignSelf: "center" }}>
                          Correct: {this.state.score[por.id].answer}
                        </Text>
                        <Text style={{ alignSelf: "center" }}>
                          Attempted: {this.state.score[por.id].attempted}
                        </Text>
                        <Text style={{ alignSelf: "center" }}>
                          True/False:{" "}
                          <Text
                            style={
                              this.state.score[por.id].true == 0
                                ? { color: "red" }
                                : { color: "green" }
                            }
                          >
                            {this.state.score[por.id].true == 0
                              ? "false"
                              : "true"}
                          </Text>
                        </Text>
                      </View>
                    );
                  })}
                </React.Fragment>
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.buttonView}>
          <Button
            style={styles.button}
            onPress={() => this.props.navigation.navigate("Dashboard")}
          >
            <Text style={styles.buttonText}>Proceed to Dashboard</Text>
          </Button>
        </View>
        {/* <CustomFooter navigation={this.props.navigation} /> */}
      </React.Fragment>
    );
  }
}

// {
//   id: 2267,
//   question:
//     '<p>What is the value of expression if x=3?</p><p><img alt="\\frac{x}{x^{2}}" src="https://latex.codecogs.com/gif.latex?%5Cfrac%7Bx%7D%7Bx%5E%7B2%7D%7D" /></p>',
//   answer: "1",
//   answer_row: "2",
//   is_image: "0",
//   explanation: "<p>This is the description</p>",
//   statement: null,
//   marks: "10",
//   parent: "9",
//   parent_type: "exam",
//   created_at: "2019-05-28 22:19:37",
//   updated_at: "2019-05-28 22:19:37"
// }
// score: {
//   "2267": {
//     id: 156,
//     user: 4,
//     exam: 12,
//     exam_name: "Testing",
//     portion: 1,
//     level: 1,
//     booking: 28,
//     question: 2267,
//     answer: 2,
//     attempted: 2,
//     true: 1,
//     created_at: "2019-05-28 23:17:07",
//     updated_at: "2019-05-28 23:17:07"
//   },
//   "2268": {
//     id: 157,
//     user: 4,
//     exam: 12,
//     exam_name: "Testing",
//     portion: 1,
//     level: 1,
//     booking: 28,
//     question: 2268,
//     answer: 2,
//     attempted: 2,
//     true: 1,
//     created_at: "2019-05-28 23:17:07",
//     updated_at: "2019-05-28 23:17:07"
//   }
// }
