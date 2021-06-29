import React, { Component } from "react";
import ChatBar from "./ChatBar";
import DevicesBar from "./DevicesBar";
import "./chat_app_style.css";
import "./material-icons.css";
import { Link } from "react-router-dom";

const flaskAddres = "http://127.0.0.1:5000";
// const flaskAddres = "http://localhost:5000";

class ChatApp extends Component {
  state = {
    devices: [
      {
        ip: "123.123.123",
        vendor: "",
        deviceName: "",
        msgs: [{ time: "", content: "", sentBy: "" }],
        chatBarMsg: "",
        // mod: user
        // key: 1     // the devices list is ordered by key and the key is genererated according to the order of the recived devices
      },
      {
        ip: "123.123.124",
        vendor: "",
        deviceName: "",
        msgs: [{ time: "", content: "", sentBy: "" }],
        chatBarMsg: "",
        // mod: user
        // key: 2
      },
      // ...
    ],
    filteredDevices: [],
    curPath: null,
    firstDevice: null,
    chatInitialized: false,
    sideBarOpen: false,
    msgsSearchOpen: false,
    curSelDevice: null,
    prevSelDevice: null,
    devicesChoosed: [],
    curMsg: "",
    curMsgIndex: -1,
    lastMsg: "",
    curDeviceSearch: "",
    curMsgsSearch: "",
    chatInputRef: null,
    devicesInputRef: null,
    devicesChatsRefs: [],
    msgsSearchRef: null,
    messagesEndRef: null,
    chatPageRef: null,
    scrollToBottom: false,
    waitingToResponse: false,
    noNewMsgs: false,
    // connection_id: null,
    prevChatPageHeight: 0,
  };

  constructor(props) {
    super(props);
    // this.pressedKeys = [];
    this.consts = { loadFromPixels: 200 };
  }

  componentDidMount() {
    // console.log(this.props.socket);

    this.state.curPath = this.props.firstDeviceIp;
    // this.props.socket.on("connect", a => console.log("a", a));
    this.props.socket.emit("requestDevices");

    this.props.socket.on("responseDevices", (devices) => {
      for (let i = 0; i < devices.length; i++) {
        devices[i].selected = false;
        devices[i].key = i;
        devices[i].msgs = [];
        devices[i].mod = "user";
        devices[i].connected = false;
      }
      // this.state.connection_id = connection_id;
      let firstDeviceIndex = devices.map((d) => d.ip).indexOf(this.props.firstDeviceIp);
      this.state.firstDevice = devices[firstDeviceIndex];
      this.setState({ devices: devices, filteredDevices: devices }, () => {
        this.selectDevice(this.state.firstDevice);
      });
    });

    this.props.socket.on("responseDeviceMsgs", (device, msgs) => {
      if (msgs.length === 0) {
        this.state.waitingToResponse = false;
        this.state.noNewMsgs = true;
        return;
      }
      if (this.state.waitingToResponse) {
        this.state.waitingToResponse = false;
        console.log(device.ip, this.state.curSelDevice.ip);
        if (device.ip !== this.state.curSelDevice.ip) {
          this.selectDevice(device);
        } else {
          this.updateDeviceMsgs(device, msgs);
        }
      }
    });

    this.props.socket.on("responseSendMsg", (msg, ip) => {
      console.log("responseSendMsg", ip);
      let deviceIndex = this.state.devices.map((e) => e.ip).indexOf(ip);
      this.setState((state) => {
        state.devices[deviceIndex].msgs.push(JSON.parse(msg));
        state.thereIsNewMsg = true;
        console.log(state.devices[deviceIndex].msgs);
        return { ...state };
      });
    });

    this.props.socket.on("deviceConnection", (deviceIp, requestingUrl) => {
      if (requestingUrl !== this.state.curPath) return;
      let deviceIndex = this.state.devices.map((device) => device.ip).indexOf(deviceIp);
      this.state.devices[deviceIndex].connected = true;
      if (deviceIp === this.state.curSelDevice.ip) this.forceUpdate();
      console.log("connected", deviceIp);
    });

    this.props.socket.on("Error", (e) => alert(e));

    window.addEventListener("keydown", (e) => {
      this.controlLayOut(e);
    });
  }

  componentDidUpdate() {
    if (this.state.thereIsNewMsg) {
      this.state.messagesEndRef.scrollIntoView({ behavior: "smooth" });
      this.state.thereIsNewMsg = false;
    }
  }

  componentWillUnmount() {}

  selectDevice = (device) => {
    window.history.pushState("", device.ip, device.ip);
    document.title = device.ip;
    let devices = this.state.devices;
    let deviceIndex = devices.map((e) => e.ip).indexOf(device.ip);
    this.setState(
      (state) => {
        state.curPath = device.ip;
        // this.state.noNewMsgs = false;
        state.noNewMsgs = false;
        state.devices[deviceIndex].selected = true;
        state.prevSelDevice = state.curSelDevice;
        let prevDevice = state.curSelDevice;
        console.log(prevDevice);
        state.curSelDevice = state.devices[deviceIndex];
        state.chatInitialized = true;
        state.curMsgIndex = -1;
        if (prevDevice == null) prevDevice = state.curSelDevice;
        let prevdeviceIndex = devices.map((e) => e.ip).indexOf(prevDevice.ip);
        if (device.ip !== prevDevice.ip) {
          state.devices[prevdeviceIndex].selected = false;
          if (typeof state.curMsg == "undefined") state.curMsg = "";
          if (typeof state.devices[deviceIndex].chatBarMsg == "undefined") state.devices[deviceIndex].chatBarMsg = "";
          let tmp = state.curMsg;
          state.curMsg = state.devices[deviceIndex].chatBarMsg;
          state.devices[prevdeviceIndex].chatBarMsg = tmp;
        }
        return state;
      },
      () => {
        if (this.state.scrollToBottom) {
          this.state.messagesEndRef.scrollIntoView();
        }
        if (this.state.curSelDevice.msgs.length === 0)
          this.requestNewMsgs(this.state.devices[deviceIndex], this.state.devices[deviceIndex].msgs.length);
      }
    );
  };

  updateDeviceMsgs = (device, msgs) => {
    let parsedMsgsData;
    if (typeof msgs === "undefined") parsedMsgsData = this.state.curSelDevice.msgs;
    parsedMsgsData = msgs.map((msg) => JSON.parse(msg));
    let deviceIndex = this.state.devices.map((e) => e.ip).indexOf(device.ip);
    let devices = this.state.devices;
    if (this.state.chatPageRef !== null) {
      this.state.prevChatPageHeight = this.state.chatPageRef.current.scrollHeight;
    }
    devices[deviceIndex].msgs.splice(0, 0, ...parsedMsgsData);
    // let updatedDevice = devices[deviceIndex];
    // devices.splice(deviceIndex, 1);
    // devices.splice(0, 0, updatedDevice);
    this.setState({ devices }, () => {
      let { chatPageRef, prevChatPageHeight } = this.state;
      if (chatPageRef !== null) {
        chatPageRef.current.scrollBy(0, chatPageRef.current.scrollHeight - prevChatPageHeight);
      }
      if (chatPageRef.current.scrollTop < this.consts.loadFromPixels)
        this.requestNewMsgs(devices[deviceIndex], devices[deviceIndex].msgs.length);
    });
  };

  controlLayOut = (e) => {
    // console.log(e);
    if (e.key === "ArrowUp" && e.shiftKey) {
      e.preventDefault();
      this.state.chatPageRef.current.scrollBy(0, -30);
      return;
    }
    if (e.key === "ArrowDown" && e.shiftKey) {
      e.preventDefault();
      this.state.chatPageRef.current.scrollBy(0, 30);
      return;
    }
    if (e.key === "ArrowRight" && e.shiftKey) {
      e.preventDefault();
      this.state.chatPageRef.current.scrollBy(30, 0);
      return;
    }
    if (e.key === "ArrowLeft" && e.shiftKey) {
      e.preventDefault();
      this.state.chatPageRef.current.scrollBy(-30, 0);
      return;
    }

    if (e.key === "ArrowRight" && e.ctrlKey) {
      e.preventDefault();
      this.closeSideBar();
      return;
    }
    if (e.key === "ArrowLeft" && e.ctrlKey) {
      e.preventDefault();
      this.openSideBar();
      return;
    }

    if (e.key === "ArrowDown" && e.ctrlKey) {
      e.preventDefault();
      var devices = this.state.filteredDevices;
      var keys = devices.map((a) => a.key);
      if (devices.length > 0) {
        var i = 0;
        while (!keys.includes(i)) i++;
        i = keys.indexOf(i);
        while (i < devices.length) {
          if (devices[i].key > this.state.curSelDevice.key) {
            this.requestNewChat(devices[i]);
            return;
          }
          i++;
        }
      }
    }
    if (e.key === "ArrowUp" && e.ctrlKey) {
      e.preventDefault();
      var devices = this.state.filteredDevices;
      var keys = devices.map((a) => a.key);
      if (devices.length > 0) {
        var i = this.state.curSelDevice.key;
        // if (i > devices.length) i = Math.max(...devices.map(a => a.key));
        while (!keys.includes(i)) i--;
        i = keys.indexOf(i);
        while (i >= 0) {
          if (devices[i].key < this.state.curSelDevice.key) {
            this.requestNewChat(devices[i]);
            return;
          }
          i--;
        }
      }
    }
    if (e.key === "f" && e.ctrlKey) {
      e.preventDefault();
      this.handleMsgsSearchToggle();
      return;
    }
    if (e.key === "ArrowDown" && e.ctrlKey) {
      //optional
      e.preventDefault();
      this.setState({ msgsSearchOpen: false });
      this.state.chatInputRef.current.focus();
      return;
    }
    if (document.activeElement.id === "chatInputMsg") {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.state.curMsgIndex === -1) this.state.lastMsg = this.state.curMsg;
        let msgLen = this.state.curSelDevice.msgs.length;
        if (this.state.curMsgIndex === msgLen - 1) {
          this.requestNewMsgs(this.state.curSelDevice, this.state.curSelDevice.msgs.length);
        }
        if (this.state.curMsgIndex < msgLen - 1) {
          this.state.curMsgIndex++;
          let nextMsg = this.state.curSelDevice.msgs[msgLen - 1 - this.state.curMsgIndex];
          while (nextMsg.sentBy === "device" && this.state.curMsgIndex < msgLen - 1)
            nextMsg = this.state.curSelDevice.msgs[msgLen - 1 - ++this.state.curMsgIndex];
          if (nextMsg.sentBy !== "device") this.setState({ curMsg: nextMsg.content });
        }
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        let msgLen = this.state.curSelDevice.msgs.length;
        if (this.state.curMsgIndex >= 0) {
          this.state.curMsgIndex--;
          let nextMsg = this.state.curSelDevice.msgs[msgLen - 1 - this.state.curMsgIndex];
          while (this.state.curMsgIndex > 0 && nextMsg.sentBy === "device") {
            nextMsg = this.state.curSelDevice.msgs[msgLen - 1 - --this.state.curMsgIndex];
          }
          if (this.state.curMsgIndex >= 0 && nextMsg.sentBy === "device") --this.state.curMsgIndex;
          if (this.state.curMsgIndex === -1) {
            this.setState({ curMsg: this.state.lastMsg });
            return;
          } else if (nextMsg.sentBy !== "device") this.setState({ curMsg: nextMsg.content });
        }
      }
    }

    if (e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!["chatInputMsg", "msgsSearch", "devicesSearch"].includes(document.activeElement.id)) {
      if (this.state.chatInputRef.current !== null) this.state.chatInputRef.current.focus();
    }
    return;
  };

  chatPageSroll = () => {
    let downFromTop = this.state.chatPageRef.current.scrollTop;
    if (downFromTop < this.consts.loadFromPixels) {
      this.requestNewMsgs(this.state.curSelDevice, this.state.curSelDevice.msgs.length);
    }
  };

  openMsgsSearch = () => {
    this.state.msgsSearchRef.current.focus();
    this.setState({ msgsSearchOpen: true, curMsgsSearch: "" });
  };
  closeMsgsSearch = () => {
    this.state.chatInputRef.current.focus();
    this.setState({ msgsSearchOpen: false, curMsgsSearch: "" });
  };

  handleMsgsSearchToggle = () => {
    if (this.state.msgsSearchOpen) this.closeMsgsSearch();
    else this.openMsgsSearch();
  };

  openSideBar = () => {
    this.state.devicesInputRef.current.focus();
    this.setState({ sideBarOpen: true });
  };
  closeSideBar = () => {
    this.state.chatInputRef.current.focus();
    this.filterDevices("");
    this.setState({ sideBarOpen: false, curDeviceSearch: "" });
  };

  handleSideBarToggle = () => {
    if (this.state.sideBarOpen) this.closeSideBar();
    else this.openSideBar();
  };

  requestNewMsgs = (device, lastMsgIndex) => {
    // console.log("requestDeviceMsgs", device);
    let MsgsAmount = Math.round(this.state.chatPageRef.current.clientHeight / 60) + 5; // the amount is dependent on size of window plus some extra msgs
    if (!this.state.noNewMsgs) {
      if (this.state.waitingToResponse === false) {
        this.props.socket.emit(
          "requestDeviceMsgs",
          device,
          // this.state.prevSelDevice,
          lastMsgIndex
          // MsgsAmount,
          // this.state.curPath
        );
        this.state.waitingToResponse = true;
      }
    }
  };

  requestNewChat = (device) => {
    this.state.scrollToBottom = true;
    this.selectDevice(device);
  };

  handleChatChoose = (device) => {
    // in case the user clicked a new chat with the mouse
    this.requestNewChat(device);
    if (this.state.chatInputRef.current != null) this.state.chatInputRef.current.focus();
  };

  setMouseCursorOnChatInput = (chatInputRef) => {
    this.setState(
      (state) => {
        state.chatInputRef = chatInputRef;
        return state;
      },
      () => {
        if (this.state.chatInputRef.current != null) this.state.chatInputRef.current.focus();
      }
    );
  };

  getRefrenceToDevicesSearch = (devicesInputRef) => {
    this.state.devicesInputRef = devicesInputRef;
  };

  getRefToChatPage = (chatPageRef) => {
    this.state.chatPageRef = chatPageRef;
  };

  setMessagesEndRef = (messagesEndRef) => {
    this.state.messagesEndRef = messagesEndRef;
    // this.state.scrollToBottom = true;
  };

  getRefrenceToMsgsSearch = (msgsSearchRef) => {
    this.state.msgsSearchRef = msgsSearchRef;
  };

  handleMsgSent = (msgContent) => {
    if (msgContent === "") return;
    let d = new Date();
    let t = d.getTime();
    let msg = { time: String(t), content: msgContent, sentBy: "user" }; // structre of each message
    this.setState({ thereIsNewMsg: true, curMsg: "" });
    let updateRedis = {
      ip: this.state.curSelDevice.ip,
      deviceType: this.state.curSelDevice.vendor,
      msg: JSON.stringify(msg),
    };
    let deviceIndex = this.state.devices.map((e) => e.ip).indexOf(this.state.curSelDevice.ip);
    this.setState((state) => {
      state.devices[deviceIndex].msgs.push(msg);
      state.thereIsNewMsg = true;
      return { ...state };
    });

    this.props.socket.emit("requestSendMsg", updateRedis);
  };

  handleInputBarChange = (e) => this.setState({ curMsg: e });

  handleDeviceSearchChange = (e) => {
    this.setState({ curDeviceSearch: e });
    this.filterDevices(e);
  };

  handleMsgsSearchChange = (e) => {
    this.setState({ curMsgsSearch: e });
  };

  filterDevices = (filterFor) => {
    let devices = this.state.devices;
    var filteredList = [];
    for (var i = 0; i < devices.length; i++) {
      let { ip, vendor, deviceName } = devices[i];
      let string = ip + vendor + deviceName;
      if (string.includes(filterFor)) filteredList.push(devices[i]);
    }
    // return filterdList;
    this.setState({ filteredDevices: filteredList });
  };

  render() {
    // console.log(this.state.curDeviceSearch);
    return (
      <div className="app" id="app">
        <DevicesBar
          devices={this.state.devices}
          onChatChoose={this.handleChatChoose}
          onInputBarChange={this.handleInputBarChange}
          onDeviceSearchChange={this.handleDeviceSearchChange}
          curDeviceSearch={this.state.curDeviceSearch}
          devicesChoosed={this.state.devicesChoosed}
          curSelDevice={this.state.curSelDevice}
          sideBarOpen={this.state.sideBarOpen}
          getRefrenceToDevicesSearch={this.getRefrenceToDevicesSearch}
          filteredDevices={this.state.filteredDevices}
        />
        <ChatBar
          curSelDevice={this.state.curSelDevice}
          onMsgSent={this.handleMsgSent}
          chatInitialized={this.state.chatInitialized}
          onInputBarChange={this.handleInputBarChange}
          curMsg={this.state.curMsg}
          onMsgsSearchChange={this.handleMsgsSearchChange}
          curMsgsSearch={this.state.curMsgsSearch}
          chatInputRef={this.state.chatInputRef}
          setMouseCursorOnChatInput={this.setMouseCursorOnChatInput}
          handleSideBarToggle={this.handleSideBarToggle}
          sideBarOpen={this.state.sideBarOpen}
          getRefrenceToMsgsSearch={this.getRefrenceToMsgsSearch}
          getRefToChatPage={this.getRefToChatPage}
          setMessagesEndRef={this.setMessagesEndRef}
          handlesMsgsSearchToggle={this.handleMsgsSearchToggle}
          msgsSearchOpen={this.state.msgsSearchOpen}
          chatPageSroll={this.chatPageSroll}
        />
      </div>
    );
  }
}

export default ChatApp;
