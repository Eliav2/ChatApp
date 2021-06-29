import React, { Component } from "react";
import DevicesTable from "./DevicesTable.jsx";
import GitlabApp from "./GitlabApp.jsx";
import ChatApp from "./ChatComponents/ChatApp.jsx";
import io from "socket.io-client";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
// import DeviceConfig from "./DeviceConfig.jsx";

let allowedOrigins = "*";
const socket = io("localhost:5000", { origins: allowedOrigins });

class App extends Component {
  constructor() {
    super();
    this.state = { curPage: "index", tableData: [] };
  }

  componentDidMount() {
    socket.on(
      "devices",
      function (response) {
        let data = { name: response.results[0], ip: response.results[1] };
        this.setState({
          tableData: this.state.tableData.concat(data),
        });
      }.bind(this)
    );
  }

  render() {
    return (
      <Router>
        <Route exact path="/">
          {/* <div style={{ backgroundColor: "#282a36" }}>
            <h2 className="headings">Devices List</h2>
            <DevicesTable data={this.state.tableData} />
          </div> */}
          <Redirect to="/chat/" />
        </Route>
        <Route path="/chat">
          <Redirect to="/chat/127.0.0.0" />
        </Route>
        <Route path="/chat/:dev_name" component={(R) => <ChatApp socket={socket} firstDeviceIp={R.match.params.dev_name} />} />
        <Route path="/gitlab/:dev_name" component={GitlabApp} />
      </Router>
    );
  }
}
export default App;
