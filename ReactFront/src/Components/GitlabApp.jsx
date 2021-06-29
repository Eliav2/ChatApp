import React, { Component } from "react";
import "./GitlabApp.css";
import "../index.css";

class GitlabApp extends Component {
  constructor() {
    super();
    this.state = { name: "", commit_history: "", commit: "" };
  }

  componentDidMount() {
    const { dev_name } = this.props.match.params;
    this.setState({ name: dev_name });
    fetch(`http://127.0.0.1:5000/gitlab/${dev_name}`)
      .then(response => response.json())
      .then(
        data => (
          this.setState({
            commit: data.commit,
            commit_history: data.commit_history
          }),
          console.log(data)
        )
      );
  }

  handleClick = commit => {
    this.setState({ commit: this.state.commit_history[commit] });
  };

  render() {
    return (
      <div className="wrapper">
        <div id="centered-div">
          <div>
            <h2 className="headings">{this.state.name} config</h2>
          </div>
          <div className="commitsContainer">
            <div className="commitsList">
              {Object.keys(this.state.commit_history).map((commit, i) => (
                <div key={i} className="commitBox" onClick={() => this.handleClick(commit)}>
                  {commit}
                </div>
              ))}
            </div>
            <div className="commit">
              <p>{this.state.commit}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default GitlabApp;
