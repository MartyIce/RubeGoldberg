import React from "react";
import eCommerceClient from "./eCommerceClient";
import CreateCustomer from "./CreateCustomer";
import ErrorMsg from '../../../Common/ErrorMsg'
import { Accordion } from "flowbite-react";
import { accordionPanel } from '../../../Common/UIFragmentUtils'
import JsonList from "../../../Common/JsonList";

class ECommerceExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
    };
    this.eCommerceClient = new eCommerceClient();
  }

  componentDidMount() {
    this.refreshItems();
  }

  error = (errorText) => {
    this.setState({ errorText: errorText });
  }

  refreshItems = () => {
    this.setState({ errorText: '' });
    return this.eCommerceClient.getCustomers(
      (customers) => this.setState({ customers: customers }),
      (error) => this.setState({ errorText: JSON.stringify(error) }));
  }

  createCustomer = (username, email, name) => {
    this.setState({ errorText: '' });
    return this.eCommerceClient.createCustomer(username, email, name,
      () => this.refreshItems(), this.error);
  }


  render() {
    return (
      <div>
        {this.state.errorText && <ErrorMsg errorText={this.state.errorText} hideError={() => this.setState({ errorText: '' })} />}
        <Accordion alwaysOpen={true}>
          {accordionPanel("Customers Raw", <JsonList results={this.state.customers} />)}
          {accordionPanel("Create Customer", <CreateCustomer createCustomer={this.createCustomer} />)}
        </Accordion>
      </div>
    );
  }
}
export default ECommerceExample