import React from "react";
import CreateEntity from "../../../Common/CreateEntity";

class CreateCustomerOrder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      item_id: '',
      status: '',
      amount: '',
      number_items: ''
    };
  }
  create = (values) => {
    return this.props.create(values.username, values.item_id, values.status, values.amount, values.number_items);
  }

  render() {
    return (
      <CreateEntity entity={this.state} create={this.create} />
    )
  }
}
export default CreateCustomerOrder