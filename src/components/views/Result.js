import React, { Component } from "react";
import { Button, Spinner, Container, List, ListItem, Body } from "native-base";
import { Text, View, AsyncStorage, Alert } from "react-native";
import { styles } from "../../styles/bookingETest.styles";
import CustomFooter from "../customComponents/footer";
import { Header } from "react-native-elements";

export default class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exams: null,
      bookedExams: null,
      isLoading: false
    };
  }
  async componentDidMount() {
    this.setState({ isLoading: true });
    try {
      console.log("sending Request");
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await fetch(
        "https://www.gorporbyken.com/api/exam/attempted",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      const responseJson = await response.json();
      console.log(responseJson);
      if (responseJson.success.length) {
        this.setState(state => ({
          ...state,
          exams: responseJson.success,
          isLoading: false,
          noExam: false
        }));
      } else {
        this.setState({
          noExam: true,
          isLoading: false
        });
      }
    } catch (error) {
      console.log("errorrrrrrrr", error);
      alert("There is some issue with network. Try later!");
      this.props.navigation.navigate("Dashboard");
    }
  }

  render() {
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
          {this.state.noExam ? (
            <View
              style={{
                alignContent: "center",
                justifyContent: "center",
                flex: 1
              }}
            >
              <Text
                style={{ color: "#012060", fontSize: 20, alignSelf: "center" }}
              >
                No Exam Result Found
              </Text>
            </View>
          ) : null}
          {exams && (
            <List>
              {exams &&
                exams.map((object, index) => {
                  return (
                    <ListItem
                      id={object.id}
                      style={{ marginLeft: 5 }}
                      onPress={() =>
                        this.props.navigation.navigate("LiveSummary", {
                          exam: object
                        })
                      }
                    >
                      <Body>
                        <Text
                          id={object.name}
                          style={{ color: "#012060", fontSize: 18 }}
                        >
                          {object.name}
                        </Text>
                      </Body>
                    </ListItem>
                  );
                })}
            </List>
          )}
        </View>
        <CustomFooter navigation={this.props.navigation} />
      </React.Fragment>
    );
  }
}
