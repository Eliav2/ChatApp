import React, { Component } from "react";

class ChatMsg extends Component {
  constructor(props) {
    super(props);
    this.msgsSearchInputRef = React.createRef();
  }

  componentDidMount() {
    this.props.getRefrenceToMsgsSearch(this.msgsSearchInputRef);
  }

  render() {
    let { deviceName, vendor, ip } = this.props.curSelDevice;
    let titleName = ip + ": " + deviceName + " (" + vendor + ")";
    let sideBarBtnTitle = this.props.sideBarOpen
      ? "Close side bar"
      : "Open side bar";
    return (
      <div
        className="chatInfoBar"
        id="chatInfoBar"
        title={this.props.curSelDevice.ip}
      >
        <i
          className="material-icons sideBarBtnIcon"
          style={{ fontSize: "30px" }}
          title={sideBarBtnTitle}
          onClick={this.props.handleSideBarToggle}
        >
          {this.props.sideBarOpen
            ? "keyboard_arrow_left"
            : "keyboard_arrow_right"}
        </i>
        {titleName}
        <input
          className={
            "msgsSearch" + (this.props.msgsSearchOpen ? "" : " disappear")
          }
          id="msgsSearch"
          placeholder="Search for messages..."
          type="text"
          value={this.props.curMsgsSearch}
          onChange={e =>
            this.props.msgsSearchOpen
              ? this.props.onMsgsSearchChange(e.target.value)
              : null
          }
          ref={this.msgsSearchInputRef}
        />
        <i
          className="material-icons searchIcon"
          style={{ fontSize: "30px" }}
          title="Search for messages in this chat"
          onClick={this.props.handlesMsgsSearchToggle}
        >
          search
        </i>
      </div>
    );
  }
}

export default ChatMsg;
