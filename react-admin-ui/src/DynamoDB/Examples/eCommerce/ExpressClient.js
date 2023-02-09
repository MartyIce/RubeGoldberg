class ExpressClient {

  constructor() {
    this.ch19Root = "http://localhost:3002/dynamodb/ch19/ecommerce"
  }

  jsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  getAll = () => {
    return fetch(`${this.ch19Root}`);
  };
  getCustomers = () => {
    return fetch(`${this.ch19Root}/customers`);
  };
  getCustomersRaw = () => {
    return fetch(`${this.ch19Root}/customers?raw=true`);
  };
  getOrders = () => {
    return fetch(`${this.ch19Root}/orders`);
  };
  getOrdersRaw = () => {
    return fetch(`${this.ch19Root}/orders?raw=true`);
  };
  getCustomer = (username) => {
    return fetch(`${this.ch19Root}/customers/${username}`);
  };
  getCustomerOrders = (username) => {
    return fetch(`${this.ch19Root}/customers/${username}/orders`);
  };
  deleteCustomer = (username) => {
    return fetch(`${this.ch19Root}/customers/${username}`,
      {
        method: 'DELETE'
      }
    );
  };
  deleteOrder = (customerId, orderId) => {
    return fetch(`${this.ch19Root}/customers/${customerId}/orders/${orderId}`,
      {
        method: 'DELETE'
      }
    );
  };
  postCustomer = (customer) => {
    return fetch(`${this.ch19Root}/customers`, {
      method: 'POST',
      headers: this.jsonHeaders,
      body: JSON.stringify(customer)
    });
  };
  putCustomer = (customer) => {
    return fetch(`${this.ch19Root}/customers/${customer.username}`, {
      method: 'PUT',
      headers: this.jsonHeaders,
      body: JSON.stringify(customer)
    });
  };
  postCustomerOrder = (username, customerOrder) => {
    return fetch(`${this.ch19Root}/customers/${username}/orders`, {
      method: 'POST',
      headers: this.jsonHeaders,
      body: JSON.stringify(customerOrder)
    });
  };
}

export default ExpressClient;