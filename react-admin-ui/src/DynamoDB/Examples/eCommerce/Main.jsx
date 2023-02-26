import React from "react";
import eCommerceClient from "./eCommerceClient";
import CreateCustomer from "./CreateCustomer";
import CreateCustomerOrder from "./CreateCustomerOrder";
import FindAndEditCustomer from "./FindAndEditCustomer";
import EditCustomer from './EditCustomer';
import ErrorMsg from '../../../Common/ErrorMsg'
import { Accordion } from "flowbite-react";
import { accordionPanel } from '../../../Common/UIFragmentUtils'
import EntityList from "../../../Common/EntityList";
import JsonList from "../../../Common/JsonList";
import EditEntity from "../../../Common/EditEntity"

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

    this.eCommerceClient.getOrdersRaw(
      (ordersRaw) => this.setState({ ordersRaw: ordersRaw }),
      (error) => this.setState({ errorText: JSON.stringify(error) }));
  }

  createCustomer = (username, email, name) => {
    this.setState({ errorText: '' });
    return this.eCommerceClient.createCustomer(username, email, name,
      () => this.refreshItems(), this.error);
  }

  createCustomerOrder = (username, item_id, status, amount, number_items) => {
    this.setState({ ...this.state, errorText: '' });
    return this.eCommerceClient.createCustomerOrder(username,
      {
        item_id: item_id,
        status: status,
        amount: amount,
        number_items: number_items
      },
      () => this.refreshItems(), this.error);
  }

  updateCustomerOrder = (customerOrder) => {
    this.setState({ ...this.state, errorText: '' });
    return this.eCommerceClient.updateCustomerOrder(customerOrder.customer, customerOrder,
      () => this.refreshItems(), this.error);
  }


  updateCustomer = (username, name, addresses) => {
    this.setState({ ...this.state, errorText: '' });
    return this.eCommerceClient.updateCustomer(username, name, addresses,
      () => {
        this.retrieveCustomer(username);
        this.refreshItems();
      }, this.error);
  }

  editCustomer = (customer) => <EditCustomer customer={customer} save={this.updateCustomer} />;
  editOrder = (order, saveComplete) => <EditEntity entity={order} fields={this.editOrderFields} save={this.updateCustomerOrder} saveComplete={saveComplete} />;

  retrieveCustomer = (username) => {
    this.setState({ errorText: '' });
    return this.eCommerceClient.getCustomer(username,
      (items) =>{
        console.log('main.retrieveCustomer', items);
        this.setState({ ...this.state, retrieveCustomerResults: items });
      }, this.error);
  }

  retrieveCustomerOrders = (username) => {
    this.setState({ errorText: '' });
    return this.eCommerceClient.getCustomerOrders(username,
      (items) => this.setState({ customerOrders: items }), this.error);
  }

  deleteCustomer = (customer) => {
    this.setState({ errorText: '' });
    return this.eCommerceClient.deleteCustomer(customer.username,
      () => {
        this.refreshItems();
      }, this.error);
  }

  deleteOrder = (order) => {
    this.setState({ errorText: '' });
    return this.eCommerceClient.deleteCustomerOrder(order.customer, order.orderId,
      () => {
        this.refreshItems();
        this.eCommerceClient.getCustomerOrders(order.customer,
          (items) => this.setState({ customerOrders: items }), this.error);
    }, this.error);
  }

  selectCustomer = (customer) => {
    this.setState({ errorText: '' });
    this.retrieveCustomer(customer.username);
    this.retrieveCustomerOrders(customer.username);
  }

  currentUsername = () => this.state.retrieveCustomerResults && this.state.retrieveCustomerResults.length > 0 ?
    this.state.retrieveCustomerResults[0].username : '';

  customerFields = {
    username: {
    },
    email: {
    },
    name: {
    },
  }

  orderFields = ['customer', 'orderId', 'createdAt', 'itemId', 'status', 'amount', 'numberItems'];
  editOrderFields = {
    customer: {      
      disabled: true
    },
    orderId: {      
      disabled: true
    },
    createdAt: {      
      disabled: true
    },
    itemId: {      
    },
    status: {      
    },
    amount: {      
    },
    numberItems: {      
    },
  }

  render() {
    return (
      <div>
        {this.state.errorText && <ErrorMsg errorText={this.state.errorText} hideError={() => this.setState({ errorText: '' })} />}
        <Accordion alwaysOpen={true}>
          {accordionPanel("Customers", <EntityList results={this.state.customers} fields={this.customerFields} delete={this.deleteCustomer} select={this.selectCustomer} edit={this.editCustomer} />)}
          {accordionPanel("Customer Orders", <EntityList results={this.state.customerOrders} fields={this.orderFields} delete={this.deleteOrder}  />)}
          {accordionPanel("Create Customer Order", <CreateCustomerOrder create={this.createCustomerOrder} />)}
          {accordionPanel("Create Customer", <CreateCustomer username={this.currentUsername()} create={this.createCustomer} />)}
          {accordionPanel("Edit Customer", <FindAndEditCustomer save={this.updateCustomer} retrieve={this.retrieveCustomer} results={this.state.retrieveCustomerResults} />)}
          {accordionPanel("Orders", <EntityList results={this.state.orders} fields={this.orderFields} delete={this.deleteOrder}  edit={this.editOrder}  />)}
          {accordionPanel("All Raw", <JsonList results={this.state.allRaw} />)}
          {accordionPanel("Customers Raw", <JsonList results={this.state.customersRaw} />)}
          {accordionPanel("Orders Raw", <JsonList results={this.state.ordersRaw} />)}
        </Accordion>
      </div>
    );
  }
}
export default ECommerceExample