import { post, get } from '../../../Common/restUtils'
import { exec } from "../../../Common/Utils"

class bigTimeDealsClient {

    constructor() {
        this.root = "http://localhost:3002/dynamodb/ch20/bigTimeDeals"
    }
    getAll = (success, error) => exec(get(this.root, ''), success, error);
    getDeals = (success, error) => exec(get(this.root, 'deals'), success, error);
    getDealsRaw = (success, error) => exec(get(this.root, 'deals?raw=true'), success, error);
    postDeal = (deal, success, error) => exec(post(this.root, 'deals', deal), success, error);
    /*

    expressClient = new ExpressClient();

    getAll = (success, error) => exec(this.expressClient.getAll(), success, error);
    getDeals = (success, error) => exec(this.expressClient.getDeals(), success, error);
    createDeal = (title, link, price, category, brand, createdAt, success, error) => {
        return exec(this.expressClient.postDeal(
            { title, link, price, category, brand, createdAt }
        ), success, error);
    };
    */
}

export default bigTimeDealsClient;