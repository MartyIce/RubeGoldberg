import ExpressClient from "./ExpressClient";
import { exec } from "../../../Common/Utils"

class eCommerceClient {
    expressClient = new ExpressClient();

    getCustomers = (success, error) => {
        return exec(this.expressClient.getCustomers(), success, error);
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
}

export default eCommerceClient;