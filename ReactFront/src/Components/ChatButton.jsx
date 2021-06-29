import React, { Component } from "react";
import logo from "../images/chat.png";
import IconButton from "@material-ui/core/IconButton";

class ChatButton extends Component {
  constructor() {
    super();
    this.state = {};
  }

  chatOnClick() {
    console.log("chat worked");
  }

  render() {
    return (
      <IconButton onClick={() => this.chatOnClick()}>
        <img src={logo} alt="chat" />
      </IconButton>
    );
  }
}
export default ChatButton;
