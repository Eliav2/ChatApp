import React, { Component } from "react";
import Device from "./Device";
import "./chat_app_style.css";

class DevicesBar extends Component {
  constructor(props) {
    super(props);
    this.devicesInputRef = React.createRef();
  }

  componentDidMount() {
    this.props.getRefrenceToDevicesSearch(this.devicesInputRef);
  }

  render() {
    return (
      <div
        className="devicesBarContainer smoothChange"
        style={this.props.sideBarOpen ? { width: "25%" } : { width: "0" }}
      >
        <input
          className="devicesSearch"
          id="devicesSearch"
          placeholder="Search for a device..."
          type="text"
          value={this.props.curDeviceSearch}
          onChange={e => this.props.onDeviceSearchChange(e.target.value)}
          ref={this.devicesInputRef}
        />
        <div className="devicesList">
          {this.props.filteredDevices.map(device => (
            <Device
              key={device.ip}
              onChatChoose={this.props.onChatChoose}
              device={device}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default DevicesBar;
