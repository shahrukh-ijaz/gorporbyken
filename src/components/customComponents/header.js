import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Item,
  Input,
  Button,
  CardItem,
  Title,
  List,
  ListItem,
  SwipeRow,
  Footer,
  FooterTab,
  Icon
} from "native-base";
import { StyleSheet, Text, View, Image } from "react-native";
import { styles } from "../../styles/components/header.components.styles";
import Swiper from "react-native-swiper";
import { CheckBox } from "react-native-elements";
export default class header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <View style={styles.header}>
          <Header />
        </View>
        <View style={styles.body} />
      </React.Fragment>
    );
  }
}
