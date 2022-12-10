import React from "react";
import JsonList from '../../../Common/JsonList'
import FindEntity from "../../../Common/FindEntity";

class CreateSession extends React.Component {

  find = (values) => this.props.findSession(values.sessionToken);
  displayResults = () => <JsonList results={this.props.results} />;
  render() {
    return (
      <FindEntity searchFields={{ sessionToken: '' }} find={this.find} displayResults={this.displayResults} />
    )
  }
}
export default CreateSession