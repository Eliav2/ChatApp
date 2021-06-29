import React, { Component } from "react";
import logo from "../images/gitlab.png";
import "./GitLabButton.css";
import IconButton from "@material-ui/core/IconButton";

class GitLabButton extends Component {
  constructor() {
    super();
    this.state = {};
  }

  gitlabOnClick() {
    // console.log(this.props.dev);
  }

  render() {
    return (
      <IconButton className="gitlab" onClick={() => this.gitlabOnClick()}>
        <img src={logo} alt="gitlab" />
      </IconButton>
    );
  }
}
export default GitLabButton;
