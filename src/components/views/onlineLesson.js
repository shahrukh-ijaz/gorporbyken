import React, { Component, Fragment } from "react";
import { Content, List, ListItem, Spinner, Container } from "native-base";
import { Text, View, AsyncStorage } from "react-native";
import { styles } from "../../styles/onlineLesson.styles";
import CustomFooter from "../customComponents/footer";
import { Header } from "react-native-elements";

export default class OnlineLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      membershipStatus: 0,
      isLoading: false
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    this.setState({ membershipStatus: await AsyncStorage.getItem("Member") });
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await fetch("https://www.gorporbyken.com/api/lesson", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({})
      });
      const responseJson = await response.json();
      // console.log(responseJson);
      if (responseJson.success.length) {
        this.setState(state => ({
          ...state,
          lessons: responseJson.success,
          isLoading: false
        }));
      }
    } catch (error) {
      console.log("errorrrrrrrr", error);
    }
  }

  render() {
    const {
      state: { lessons }
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

        <View style={styles.titleView}>
          <Text style={styles.title}>ONLINE LESSONS</Text>
        </View>

        <View style={styles.body}>
          <Content>
            <List>
              <ListItem itemHeader first style={styles.itemHeader}>
                <Text style={styles.itemHeaderText}>Download Document</Text>
              </ListItem>
              <ListItem>
                <Text style={styles.itemText}>Export E-Book</Text>
              </ListItem>
              {lessons &&
                lessons.map((object, index) => (
                  <Fragment key={index}>
                    <ListItem itemHeader style={styles.itemHeader}>
                      <Text style={styles.itemHeaderText}>{object.name}</Text>
                    </ListItem>
                    {object.videos &&
                      object.videos.length &&
                      object.videos[0].map((videoObject, key) => (
                        <ListItem
                          key={key}
                          onPress={() => {
                            // console.log(
                            //   object.paid,
                            //   this.state.membershipStatus
                            // );
                            if (
                              object.paid == 1 &&
                              this.state.membershipStatus != 1
                            ) {
                              alert(
                                "This is a premium lecture. To buy a premium account proceed to Profile -> Membership."
                              );
                            } else {
                              this.props.navigation.navigate("LessonVideo", {
                                link: videoObject.link
                              });
                            }
                          }}
                        >
                          <Text style={styles.itemText}>
                            {videoObject.title}
                          </Text>
                        </ListItem>
                      ))}
                  </Fragment>
                ))}
            </List>
          </Content>
        </View>
        <CustomFooter navigation={this.props.navigation} />
      </React.Fragment>
    );
  }
}
