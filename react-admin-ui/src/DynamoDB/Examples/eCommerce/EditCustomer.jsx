import React from "react";
import FindEntity from "../../../Common/FindEntity";
import EditEntity from "../../../Common/EditEntity";
import EditEntityList from "../../../Common/EditEntityList";

class EditCustomer extends React.Component {

  constructor(props) {
    super(props);
    const addresses = this.mapToArrayBased(props.results.addresses);
    this.state = {
      addresses: addresses,
    };
  }

  mapToArrayBased(propBasedItems, propName) {
    const items = [];
    if (propBasedItems) {
      const keys = Object.keys(propBasedItems);
      items.push(...keys.map(k => {
        const ret = {
          ...propBasedItems[k]
        }
        ret[propName] = k;
        return ret;
      }));
    }
    return items;
  }

  mapToPropertyBased(arrayBasedAddresses, propName) {
    const mappedAddresses = {};
    arrayBasedAddresses.forEach(a => {
      const name = a[propName];
      delete a[propName];
      mappedAddresses[name] = a;
    });
    return mappedAddresses;
  }

  componentWillReceiveProps(props) {
    if(props.results && props.results.length > 0) {
      const addresses = this.mapToArrayBased(props.results[0].addresses, 'name');
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

  find = (values) => {
    return this.props.retrieve(values.username);
  } 

  save = (values) => {
    return this.props.save(values.username, values.name, this.mapToPropertyBased(this.state.addresses, 'name'));
  }

  saveAddresses = (address, index) => {
    let addresses = this.state.addresses;
    addresses[index] = address;
    this.setState({ ...this.state, addresses })    
    return this.props.save(this.props.results[0].username, this.props.results[0].name, this.mapToPropertyBased(addresses, 'name'));
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
    return this.props.save(this.props.results[0].username, this.props.results[0].name, this.mapToPropertyBased(addresses, 'name'));
  }

  displayResults = () => this.props.results.length > 0 &&
    (<div className="grid grid-cols-2 gap-4">
      <EditEntity entity={this.props.results[0]} fields={this.fields} save={this.save} />
      <EditEntityList entityList={this.state.addresses ?? []} fields={this.addressFields} save={(address, index) => this.saveAddresses(address, index)} addNew={this.addAddress} delete={this.deleteAddress} />
    </div>)
    
  render() {
    return (<div>
        <FindEntity searchFields={{ username: '' }} find={this.find} displayResults={this.displayResults} />
      </div>)
  }
}
export default EditCustomer