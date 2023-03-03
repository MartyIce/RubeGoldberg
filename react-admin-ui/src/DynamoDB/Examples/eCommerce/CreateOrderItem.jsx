import React from "react";
import CreateEntity from "../../../Common/CreateEntity";

class CreateOrderItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orderId: '',
      description: '',
      price: 0
    };
  }
  create = (values) => {
    return this.props.create(values.orderId, values.description, values.price);
  }

  render() {
    return (
      <CreateEntity entity={this.state} create={this.create} />
    )
  }
}
export default CreateOrderItem