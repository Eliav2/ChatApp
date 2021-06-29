import React, { Component } from "react";
import "./chat_app_style.css";

class Device extends Component {
  state = { mouseOver: false };

  setMarking = () => {
    var sel = this.props.device.selected;
    if (sel) return "deviceSelected";
    else if (this.state.mouseOver) return "deviceOver";
    return "deviceOut";
  };

  clickDevice = sel => () => {
    this.props.onChatChoose(this.props.device);
    if (!sel) {
      this.setState({ mouseOver: false });
    }
  };

  render() {
    var sel = this.props.device.selected;
    return (
      <div
        className={"device " + this.setMarking()}
        onClick={this.clickDevice(sel)}
        onMouseOut={() => (sel ? null : this.setState({ mouseOver: false }))}
        onMouseOver={() => (sel ? null : this.setState({ mouseOver: true }))}
      >
        {this.props.device.ip + " - " + this.props.device.deviceName}
      </div>
    );
  }
}

export default Device;
