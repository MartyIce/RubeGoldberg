import React from "react";
import CreateEntity from "../../../Common/CreateEntity";

const { v4: uuidv4 } = require('uuid');

class CreateSession extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      sessionToken: '',
      ttl: 604800
    };
  }

  extraControls = {
    sessionToken: (formState) => {
      return <button className="btn btn-blue" type="button" onClick={() => this.genUuid(formState)}>
        Generate
      </button>
    }
  }

  genUuid(formState) {
    this.setState({ ...formState, sessionToken: uuidv4() });
  }

  createSession = (values) => {
    return this.props.createSession(values.username, values.sessionToken, values.ttl);
  }

  render() {
    return (
      <CreateEntity entity={this.state} create={this.createSession} extraControls={this.extraControls}/>
    )
  }
}
export default CreateSession