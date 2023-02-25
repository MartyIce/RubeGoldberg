import React from "react";
import EditEntity from "../../../Common/EditEntity";
import EditEntityList from "../../../Common/EditEntityList";
import { mapToArrayBased, mapToPropertyBased } from "../../../Common/Utils";

class EditCustomer extends React.Component {

  constructor(props) {
    super(props);
    const addresses = mapToArrayBased(props.customer.addresses);
    this.state = {
      addresses: addresses,
    };
  }

  componentWillReceiveProps(props) {
    if(props.customer) {
      const addresses = mapToArrayBased(props.customer.addresses, 'name');
      this.setState({ ...this.state, addresses });
    }
  }

  fields = {
    username: {
      disabled: true
    },
    email: {
      disabled: true
    },
    name: {
      disabled: false
    },
  }

  addressFields = {
    name: {},
    street1: {},
    city: {},
    state: {},
  }

  save = (values) => {
    return this.props.save(values.username, values.name, this.mapToPropertyBased(this.state.addresses, 'name'));
  }

  saveAddresses = (address, index) => {
    let addresses = this.state.addresses;
    addresses[index] = address;
    this.setState({ ...this.state, addresses })    
    return this.props.save(this.props.customer.username, this.props.customer.name, mapToPropertyBased(addresses, 'name'));
  }

  addAddress = (address) => {
    let addresses = this.state.addresses;
    addresses.push(address)
    this.setState({ ...this.state, addresses })
  }

  deleteAddress = (address) => {
    let addresses = this.state.addresses;
    addresses.splice(addresses.indexOf(address), 1);
    this.setState({ addresses: addresses })
    return this.props.save(this.props.customer.username, this.props.customer.name, mapToPropertyBased(addresses, 'name'));
  }

  render() {
    return <div className="grid grid-cols-2 gap-4">
      <EditEntity entity={this.props.customer} fields={this.fields} save={this.save} />
      <EditEntityList 
        entityList={this.state.addresses ?? []} 
        fields={this.addressFields} 
        save={(address, index) => this.saveAddresses(address, index)} 
        addNew={this.addAddress} 
        delete={this.deleteAddress} 
        />
    </div>;
  }
}
export default EditCustomer