import React from "react";
import JsonList from '../../../Common/JsonList'
import FindEntity from "../../../Common/FindEntity";

class UserSessions extends React.Component {

  find = (values) => this.props.getUserSessions(values.username);
  displayResults = () => <JsonList results={this.props.results} />;
  render() {
    return (
      <FindEntity searchFields={{ username: '' }} find={this.find} displayResults={this.displayResults} />
    )
  }
}
export default UserSessions
