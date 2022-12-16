import React from "react";
import CreateEntity from "../../../Common/CreateEntity";

class CreateCustomer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      name: ''
    };
  }
  create = (values) => {
    return this.props.create(values.username, values.email, values.name);
  }

  render() {
    return (
      <CreateEntity entity={this.state} create={this.create} />
    )
  }
}
export default CreateCustomer