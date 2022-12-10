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
  createCustomer = (values) => {
    return this.props.createCustomer(values.username, values.email, values.name);
  }

  render() {
    return (
      <CreateEntity entity={this.state} create={this.createCustomer} />
    )
  }
}
export default CreateCustomer