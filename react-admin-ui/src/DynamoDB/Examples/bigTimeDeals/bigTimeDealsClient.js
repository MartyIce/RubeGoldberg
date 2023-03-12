import { post, get, del } from '../../../Common/restUtils'
import { exec } from "../../../Common/Utils"

class bigTimeDealsClient {
    constructor() {
        this.root = "http://localhost:3002/dynamodb/ch20/bigTimeDeals"
    }
    getAll = (success, error) => exec(get(this.root, ''), success, error);
    getDeals = (success, error) => exec(get(this.root, 'deals'), success, error);
    getDealsForDate = (date, lastSeen, limit, success, error) => exec(get(this.root, 
        `deals/${date}?last_seen=${lastSeen ?? '$'}&limit=${limit}`), success, error);
    getDealsRaw = (success, error) => exec(get(this.root, 'deals?raw=true'), success, error);
    postDeal = (deal, success, error) => exec(post(this.root, 'deals', deal), success, error);
    deleteDeal = (dealId, success, error) => exec(del(this.root, `deals/${dealId}`), success, error)
}

export default bigTimeDealsClient;