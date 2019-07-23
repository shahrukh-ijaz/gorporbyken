import React, { Component } from "react";
import { List, ListItem, Spinner, Container } from "native-base";
import { Text, View } from "react-native";
import { styles } from "../../styles/level.styles";
import Swiper from "react-native-swiper";
import CustomFooter from "../customComponents/footer";
import { Header } from "react-native-elements";

export default class Level extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  render() {
    const {
      props: {
        navigation: {
          state: {
            params: { exam }
          }
        }
      }
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
          <Text style={styles.titleText}>PLEASE SELECT YOUR LEVEL</Text>
        </View>
        <View style={styles.body}>
          <List>
            <ListItem
              style={styles.itemView}
              onPress={() =>
                this.props.navigation.navigate("AfterLevel", {
                  level: 1,
                  exam: exam
                })
              }
            >
              <Text style={styles.itemText}>LEVEL 1</Text>
            </ListItem>
            <ListItem
              style={styles.itemView}
              onPress={() =>
                this.props.navigation.navigate("AfterLevel", { level: 2, exam })
              }
            >
              <Text style={styles.itemText}>LEVEL 2</Text>
            </ListItem>
            <ListItem
              style={styles.itemView}
              onPress={() =>
                this.props.navigation.navigate("AfterLevel", { level: 3, exam })
              }
            >
              <Text style={styles.itemText}>LEVEL 3</Text>
            </ListItem>
            <ListItem
              style={styles.itemView}
              onPress={() =>
                this.props.navigation.navigate("AfterLevel", { level: 4, exam })
              }
            >
              <Text style={styles.itemText}>LEVEL 4</Text>
            </ListItem>
          </List>
        </View>
        <CustomFooter navigation={this.props.navigation} />
      </React.Fragment>
    );
  }
}
