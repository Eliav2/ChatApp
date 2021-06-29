import React, { Component } from "react";
import ReactTable from "react-table";
//import {useTable} from "react-table";
import "react-table/react-table.css";
import "./DevicesTable.css";
import GitLabButton from "./GitLabButton.jsx";
import ChatButton from "./ChatButton";
import { Link } from "react-router-dom";

class DevicesTable extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    fetch("http://127.0.0.1:5000/get_table_data")
      .then(response => response.json())
      .then(table_data => this.setState({ data: table_data.data }));
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({ data: this.props.data });
    }
  }
  render() {
    const data = this.state.data;
    const columns = [
      {
        Header: "Device Name",
        accessor: "name", // String-based value accessors!
        className: "devName"
      },
      {
        Header: "IP Address",
        accessor: "ip",
        className: "ip"
      },
      {
        Header: "Operations",
        accessor: "operations",
        Cell: cell => (
          <div>
            <Link to={`/gitlab/${cell.original.name}`} target="_blank">
              <GitLabButton dev={cell.original.name} className="gitlab" />
            </Link>
            <Link to={`/chat/${cell.original.ip}`} target="_blank">
              <ChatButton className="chat" />
            </Link>
          </div>
        )
      }
    ];

    return (
      <div className="DevicesTable">
        <ReactTable data={data} columns={columns} />
      </div>
    );
  }
}
export default DevicesTable;
