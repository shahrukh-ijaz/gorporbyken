import React, { Component } from "react";
import { Text } from "react-native";
import {
  Container,
  Content,
  Button,
  Footer,
  FooterTab,
  Icon
} from "native-base";
import { styles } from "../../styles/components/footer.components.styles";

export default class CustomFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <Container style={styles.footer}>
          <Content />
          <Button
            onPress={() => {}}
            style={{
              alignSelf: "center",
              position: "absolute",
              elevation: 4,
              height: 70,
              width: 70,
              bottom: 0,
              borderWidth: 1,
              borderColor: "lightgrey",
              borderRadius: 35,
              backgroundColor: "#f5f5f5",
              justifyContent: "center"
            }}
            active
          >
            <Icon active name="home" style={{ color: "black", fontSize: 32 }} />
          </Button>
          <Footer>
            <FooterTab style={{ backgroundColor: "white" }}>
              <Button onPress={() => this.props.navigation.navigate("Result")}>
                <Icon name="ios-stats" />
                <Text>Report</Text>
              </Button>
              <Button
                style={{ flex: 0, width: 70 }}
                onPress={() => this.props.navigation.navigate("Dashboard")}
              >
                <Icon active name="navigate" />
              </Button>
              <Button onPress={() => this.props.navigation.navigate("Profile")}>
                <Icon name="ios-person" />
                <Text>Profile</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </React.Fragment>
    );
  }
}
