import React, { Component } from "react";
import ChatMsg from "./ChatMsg";

class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.chatPageRef = React.createRef();
  }

  componentDidMount() {
    this.props.getRefToChatPage(this.chatPageRef);
    this.props.setMessagesEndRef(this.messagesEnd);
  }

  componentDidUpdate() {
    // this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    this.props.setMessagesEndRef(this.messagesEnd);
    // console.log("ChatPage:componentDidUpdate", 6);
  }

  render() {
    return (
      <div
        className="chatPage"
        id="chatPage"
        ref={this.chatPageRef}
        onScroll={(e) => {
          this.props.chatPageSroll();
        }}
      >
        <div style={{ margin: "10px" }}></div>
        {this.props.curSelDevice.msgs
          .filter((msg) => {
            let string = msg.content; //+ new Date(Number(msg.time)).toLocaleString().replace(",", "");
            // if (!string) return false;
            return string.includes(this.props.curMsgsSearch);
          })
          .map((msg, i) => (
            <ChatMsg key={i} msg={msg} />
          ))}
        <div
          ref={(el) => {
            this.messagesEnd = el;
          }}
        ></div>
        <div style={{ margin: "10px" }}></div>
      </div>
    );
  }
}

export default ChatPage;
