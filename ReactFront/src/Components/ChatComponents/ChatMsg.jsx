import React, { Component } from "react";

class ChatMsg extends Component {
  state = {};
  getParsedDate = time => {
    let d = new Date(Number(time));
    return d.toLocaleString();
  };
  render() {
    let jsxMsg;
    if (this.props.msg.sentBy === "device")
      jsxMsg = (
        <div className="msgContainer justifyEnd">
          <pre className="msgTime">{this.getParsedDate(this.props.msg.time)}</pre>
          <pre className="msgBox userMsg">
            <pre className="msgContent">{this.props.msg.content}</pre>
          </pre>
        </div>
      );
    else
      jsxMsg = (
        <div className="msgContainer justifyStart">
          <div className="msgBox deviceMsg">
            <pre className="msgContent">{this.props.msg.content}</pre>
          </div>
          <pre className="msgTime">{this.getParsedDate(this.props.msg.time)}</pre>
        </div>
      );

    return <div>{jsxMsg}</div>;
  }
}

export default ChatMsg;
