import React, { Component } from "react";
import { Text, View, AsyncStorage } from "react-native";
import { styles } from "../../styles/quiz.styles";
import CustomFooter from "../customComponents/footer";
import { Button, Content, Container, Spinner } from "native-base";
import { Header } from "react-native-elements";

export default class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      isLoading: false
    };
  }

  async componentDidMount() {
    const authToken = await AsyncStorage.getItem("authToken");
    console.log("fetching categories");
    this.setState({ isLoading: true });
    try {
      let response = await fetch(
        "https://www.gorporbyken.com/api/quiz-category",
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
      // console.log("QuizResponse", responseJson);
      if (responseJson.success) {
        this.setState({ categories: responseJson.success });
        this.setState({ isLoading: false });
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

  render() {
    let quizCategories = this.state.categories.map(cat => {
      return (
        <View key={cat.id} style={styles.buttonView}>
          <Button
            style={[styles.button]}
            onPress={() =>
              this.props.navigation.navigate("TakeQuiz", { category: cat.id })
            }
          >
            <Text style={styles.buttonText}>{cat.name}</Text>
          </Button>
        </View>
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

        {this.state.isLoading ? (
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
            <Content style={styles.content}>{quizCategories}</Content>
          </View>
        )}
        <CustomFooter navigation={this.props.navigation} />
      </React.Fragment>
    );
  }
}
