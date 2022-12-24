import React from "react";
import eCommerceClient from "./eCommerceClient";
import CreateCustomer from "./CreateCustomer";
import CreateCustomerOrder from "./CreateCustomerOrder";
import EditCustomer from "./EditCustomer";
import ErrorMsg from '../../../Common/ErrorMsg'
import { Accordion } from "flowbite-react";
import { accordionPanel } from '../../../Common/UIFragmentUtils'
import EntityList from "../../../Common/EntityList";
import JsonList from "../../../Common/JsonList";

class ECommerceExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allRaw: [],
      customers: [],
      customersRaw: [],
      orders: [],
      retrieveCustomerResults: []
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

    this.eCommerceClient.getAll(
      (allRaw) => this.setState({ allRaw: allRaw }),
      (error) => this.setState({ errorText: JSON.stringify(error) }));

    this.eCommerceClient.getCustomers(
      (customers) => this.setState({ customers: customers }),
      (error) => this.setState({ errorText: JSON.stringify(error) }));

    this.eCommerceClient.getCustomersRaw(
      (customersRaw) => this.setState({ customersRaw: customersRaw }),
      (error) => this.setState({ errorText: JSON.stringify(error) }));

    this.eCommerceClient.getOrders(
      (orders) => this.setState({ orders: orders }),
      (error) => this.setState({ errorText: JSON.stringify(error) }));
  }

  createCustomer = (username, email, name) => {
    this.setState({ errorText: '' });
    return this.eCommerceClient.createCustomer(username, email, name,
      () => this.refreshItems(), this.error);
  }

  createCustomerOrder = (username, item_id, status, amount, number_items) => {
    this.setState({ errorText: '' });
    return this.eCommerceClient.createCustomerOrder(username,
      {
        item_id: item_id,
        status: status,
        amount: amount,
        number_items: number_items
      },
      () => this.refreshItems(), this.error);
  }

  updateCustomer = (username, name, addresses) => {
    this.setState({ errorText: '' });
    return this.eCommerceClient.updateCustomer(username, name, addresses,
      () => {
        this.retrieveCustomer(username);
        this.refreshItems();
      }, this.error);
  }

  retrieveCustomer = (username) => {
    this.setState({ errorText: '' });
    return this.eCommerceClient.getCustomer(username,
      (items) => this.setState({ retrieveCustomerResults: items }), this.error);
  }

  deleteCustomer = (customer) => {
    this.setState({ errorText: '' });
    return this.eCommerceClient.deleteCustomer(customer.username,
      () => {
        this.refreshItems();
      }, this.error);
  }

  selectCustomer = (customer) => {
    this.setState({ errorText: '' });
    return this.retrieveCustomer(customer.username);
  }

  currentUsername = () => this.state.retrieveCustomerResults && this.state.retrieveCustomerResults.length > 0 ?
    this.state.retrieveCustomerResults[0].username : '';

  fields = {
    username: {
    },
    email: {
    },
    name: {
    },
  }

  render() {
    return (
      <div>
        {this.state.errorText && <ErrorMsg errorText={this.state.errorText} hideError={() => this.setState({ errorText: '' })} />}
        <Accordion alwaysOpen={true}>
          {accordionPanel("All Raw", <JsonList results={this.state.allRaw} />)}
          {accordionPanel("Customers", <EntityList results={this.state.customers} fields={this.fields} delete={this.deleteCustomer} select={this.selectCustomer} />)}
          {accordionPanel("Customers Raw", <JsonList results={this.state.customersRaw} />)}
          {accordionPanel("Create Customer", <CreateCustomer username={this.currentUsername()} create={this.createCustomer} />)}
          {accordionPanel("Edit Customer", <EditCustomer save={this.updateCustomer} retrieve={this.retrieveCustomer} results={this.state.retrieveCustomerResults} />)}
          {accordionPanel("Orders Raw", <JsonList results={this.state.orders} />)}
          {accordionPanel("Create Customer Order", <CreateCustomerOrder create={this.createCustomerOrder} />)}
        </Accordion>
      </div>
    );
  }
}
export default ECommerceExample