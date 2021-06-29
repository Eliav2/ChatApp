import React, { Component } from "react";

class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.chatInputRef = React.createRef();
  }

  componentDidMount() {
    this.props.setMouseCursorOnChatInput(this.chatInputRef);
  }

  render() {
    // if (!this.props.curSelDevice.connected)
    //   return <div className="chatInputForm">Connecting to device, Please wait...</div>;

    let mod = this.props.curSelDevice.mod;
    let modChar = mod === "user" ? ">" : mod === "privilege" ? "#" : mod === "configure" ? "(conf)" : null;
    return (
      <form className="chatInputForm" onSubmit={(e) => e.preventDefault()}>
        <pre className="deviceName">{this.props.curSelDevice.deviceName + modChar}</pre>
        <input
          className="chatInputMsg"
          value={this.props.curMsg}
          type="text"
          placeholder="Type a message..."
          onChange={(e) => this.props.onInputBarChange(e.target.value)}
          onKeyPress={(event) => (event.key === "Enter" ? this.props.onMsgSent(this.props.curMsg) : null)}
          ref={this.chatInputRef}
          id="chatInputMsg"
          autoComplete="off"
        />
        <input className="sendButton" type="button" value="Send" onClick={() => this.props.onMsgSent(this.props.curMsg)} />
      </form>
    );
  }
}

export default ChatInput;
