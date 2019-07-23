import React, { Component } from "react";
import {
  Container,
  Content,
  Item,
  Input,
  Button,
  CardItem,
  Title,
  Icon
} from "native-base";
import { Header } from "react-native-elements";
import { StyleSheet, Text, View, Image } from "react-native";
import { styles } from "../../styles/dashboard.styles";
import { AsyncStorage } from "react-native";
import CustomFooter from "../customComponents/footer";
import Slideshow from "react-native-image-slider-show";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      name: "",
      position: 1,
      interval: null,
      dataSource: [
        { url: require("../../../assets/learn3.jpg") },
        {
          url: require("../../../assets/learn2.jpg")
        },
        {
          url: require("../../../assets/learn.jpg")
        }
      ]
    };
  }
  componentWillMount() {
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position:
            this.state.position === this.state.dataSource.length
              ? 0
              : this.state.position + 1
        });
      }, 2000)
    });
  }
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  async componentDidMount() {
    name = await AsyncStorage.getItem("userName");
    // console.log("name", name);
    this.setState({
      name: name
    });
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
        <Container style={styles.surname}>
          <Icon
            name="ios-person"
            style={{
              fontSize: 36,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderRadius: 25,
              marginHorizontal: 10
            }}
          />
          <Text
            style={{
              fontSize: 26,
              color: "gray",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            {this.state.name}
          </Text>
        </Container>

        <Container style={styles.header}>
          <Slideshow
            dataSource={this.state.dataSource}
            position={this.state.position}
            onPositionChanged={position => this.setState({ position })}
          />
        </Container>

        <Container style={styles.body}>
          <Content style={styles.content}>
            <View style={styles.buttonView}>
              <Button
                style={[styles.button]}
                onPress={() => this.props.navigation.navigate("BookingETest")}
              >
                <Image
                  style={{ height: 50, width: 50, marginHorizontal: 5 }}
                  source={require("../../../assets/lesson.png")}
                />
                <Text style={styles.buttonText}>Booking E-Test</Text>
              </Button>
            </View>
            <View style={styles.buttonView}>
              <Button
                style={[styles.button]}
                onPress={() => this.props.navigation.navigate("OnlineLesson")}
              >
                <Image
                  style={{ height: 50, width: 50, marginHorizontal: 5 }}
                  source={require("../../../assets/booking.png")}
                />
                <Text style={styles.buttonText}>Online Lesson</Text>
              </Button>
            </View>
            <View style={styles.buttonView}>
              <Button
                style={[styles.button]}
                onPress={() => this.props.navigation.navigate("Quiz")}
              >
                <Image
                  style={{ height: 50, width: 50, marginHorizontal: 5 }}
                  source={require("../../../assets/quiz.png")}
                />
                <Text style={styles.buttonText}>Quiz</Text>
              </Button>
            </View>
          </Content>
        </Container>
        <CustomFooter navigation={this.props.navigation} />
      </React.Fragment>
    );
  }
}
