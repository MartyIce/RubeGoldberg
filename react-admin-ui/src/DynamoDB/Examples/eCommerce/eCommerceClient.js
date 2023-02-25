import ExpressClient from "./ExpressClient";
import { exec } from "../../../Common/Utils"

class eCommerceClient {
    expressClient = new ExpressClient();

    getAll = (success, error) => {
        return exec(this.expressClient.getAll(), success, error);
    };

    getCustomers = (success, error) => {
        return exec(this.expressClient.getCustomers(), success, error);
    };

    getCustomersRaw = (success, error) => {
        return exec(this.expressClient.getCustomersRaw(), success, error);
    };

    getOrders = (success, error) => {
        return exec(this.expressClient.getOrders(), success, error);
    };

    getOrdersRaw = (success, error) => {
        return exec(this.expressClient.getOrdersRaw(), success, error);
    };

    createCustomer = (username, email, name, success, error) => {
        return exec(this.expressClient.postCustomer(
            {
                username: username,
                email: email,
                name: name
            }
        ), success, error);
    };

    updateCustomer = (username, name, addresses, success, error) => {
        return exec(this.expressClient.putCustomer(
            {
                username: username,
                name: name,
                addresses: addresses
            }
        ), success, error);
    };

    getCustomer = (username, success, error) => {
        return exec(this.expressClient.getCustomer(username), success, error);
    };

    getCustomerOrders = (username, success, error) => {
        return exec(this.expressClient.getCustomerOrders(username), success, error);
    };

    deleteCustomer = (username, success, error) => {
        return exec(this.expressClient.deleteCustomer(username), success, error);
    };

    deleteCustomerOrder = (customerId, orderId, success, error) => {
        return exec(this.expressClient.deleteCustomerOrder(customerId, orderId), success, error);
    };

    updateCustomerOrder = (customerOrder, success, error) => {
        return exec(this.expressClient.putCustomerOrder(customerOrder), success, error);
    };

    createCustomerOrder = (username, customerOrder, success, error) => {
        return exec(this.expressClient.postCustomerOrder(username, customerOrder), success, error);
    };
}

export default eCommerceClient;