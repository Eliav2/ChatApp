import React, { Component } from "react";
import ChatInfoBar from "./ChatInfoBar";
import ChatPage from "./ChatPage";
import ChatInput from "./ChatInput";
import "./chat_app_style.css";

class ChatBar extends Component {
  // componentDidMount() {
  //   window.addEventListener("scroll", this.scrollChatToButtom);
  // }

  // scrollChatToButtom = event => {
  //   let scrollTop = event.srcElement.body.scrollTop,
  //     itemTranslate = Math.min(0, scrollTop / 3 - 60);
  //   console.log(scrollTop);

  //   this.setState({
  //     transform: itemTranslate
  //   });
  // };

  render() {
    if (!this.props.chatInitialized) return <div className="firstChatBarContainer">No Available Devices</div>;
    return (
      <div
        id="chatBarContainer"
        className="chatBarContainer smoothChange"
        style={this.props.sideBarOpen ? { width: "75%" } : { width: "100%" }}
      >
        <ChatInfoBar
          sideBarOpen={this.props.sideBarOpen}
          curSelDevice={this.props.curSelDevice}
          onMsgsSearchChange={this.props.onMsgsSearchChange}
          handleSideBarToggle={this.props.handleSideBarToggle}
          getRefrenceToMsgsSearch={this.props.getRefrenceToMsgsSearch}
          chatInputRef={this.props.chatInputRef}
          handlesMsgsSearchToggle={this.props.handlesMsgsSearchToggle}
          msgsSearchOpen={this.props.msgsSearchOpen}
        />
        <ChatPage
          curSelDevice={this.props.curSelDevice}
          curMsgsSearch={this.props.curMsgsSearch}
          setMessagesEndRef={this.props.setMessagesEndRef}
          getRefToChatPage={this.props.getRefToChatPage}
          chatPageSroll={this.props.chatPageSroll}
        />
        <ChatInput
          onMsgSent={this.props.onMsgSent}
          onInputBarChange={this.props.onInputBarChange}
          curMsg={this.props.curMsg}
          curSelDevice={this.props.curSelDevice}
          // chatInputRef={this.props.chatInputRef}
          setMouseCursorOnChatInput={this.props.setMouseCursorOnChatInput}
        />
      </div>
    );
  }
}

export default ChatBar;
