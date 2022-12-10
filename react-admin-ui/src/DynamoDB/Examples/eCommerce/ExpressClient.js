class ExpressClient {

    constructor() {
      this.ch19Root = "http://localhost:3002/dynamodb/ch19/ecommerce"
    }

    jsonHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    getCustomers = () => {
        return fetch(`${this.ch19Root}/customers`);
    };
    postCustomer = (customer) => {
      return fetch(`${this.ch19Root}/customers`, {
        method: 'POST',
        headers: this.jsonHeaders,
        body: JSON.stringify(customer)
      });
    };
  }

export default ExpressClient;