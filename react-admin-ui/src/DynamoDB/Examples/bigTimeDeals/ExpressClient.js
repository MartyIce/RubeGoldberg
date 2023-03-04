import { post, get } from '../../../Common/restUtils'

class ExpressClient {

  constructor() {
    this.root = "http://localhost:3002/dynamodb/ch20/bigTimeDeals"
  }
  getAll = () => get(this.root, '');
  getDeals = () => get(this.root, 'deals');
  getDealsRaw = () => get(this.root, 'deals?raw=true');
  postDeal = (deal) => post(this.root, 'deals', deal);
}

export default ExpressClient;