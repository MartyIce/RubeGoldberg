import React from "react";
import FindEntity from "../../../Common/FindEntity";
import EditEntity from "../../../Common/EditEntity";
import EditEntityList from "../../../Common/EditEntityList";

class EditCustomer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      addresses: props.results.addresses ?? []
    };
  }

  componentDidUpdate() {
    if(this.props.results && this.props.results.length > 0) {
      let addresses = this.props.results[0].addresses ?? [];
      if(JSON.stringify(addresses) !== JSON.stringify(this.state.addresses))
        this.setState({...this.state, addresses});
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
    street1: {},
    city: {},
    state: {},
  }

  find = (values) => this.props.retrieve(values.username);

  save = (values) => {
    return this.props.save(values.username, values.name, this.state.addresses);
  }

  saveAddresses = (address, index) => {
    let addresses = this.state.addresses;
    addresses[index] = address;
    this.setState({...this.state, addresses })
    return this.props.save(this.props.results[0].username, this.props.results[0].name, addresses);
  }

  addAddress = (address) => {
    let addresses = this.state.addresses;
    addresses.push(address)
    this.setState({...this.state, addresses })
  }

  displayResults = () => this.props.results.length > 0 && 
    (<div className="grid grid-cols-4 gap-4">
      <EditEntity entity={this.props.results[0]} fields={this.fields} save={this.save} />
      <EditEntityList entityList={this.state.addresses} fields={this.addressFields} save={(address, index) => this.saveAddresses(address, index)} addNew={this.addAddress}/>
    </div>)
  
  render() {
    return (
      <div>
      <FindEntity searchFields={{ username: '' }} find={this.find} displayResults={this.displayResults} />

      </div>
    )
  }
}
export default EditCustomer