import bigTimeDealsClient from "./bigTimeDealsClient";

class bigTimeDealsService {
  constructor(component) {
    this.component = component
    this.component.state = {
      allRaw: [],
      deals: [],
      dealsRaw: [],
    };
    this.bigTimeDealsClient = new bigTimeDealsClient();
  }
  error = (errorText) => {
    this.component.setState({ errorText: errorText });
  }

  errorResult = (error) => {
    this.component.setState({ errorText: JSON.stringify(error) });
  }

  refreshItems = () => {
    this.error('');
    this.bigTimeDealsClient.getAll((ret) => this.component.setState({ allRaw: ret }), this.errorResult);
    this.bigTimeDealsClient.getDeals((ret) => this.component.setState({ deals: ret }), this.errorResult);
    this.bigTimeDealsClient.getDealsRaw((ret) => this.component.setState({ dealsRaw: ret }), this.errorResult);
  }

  createDeal = (deal) => {
    this.error('');
    return this.bigTimeDealsClient.postDeal(deal, () => this.refreshItems(), this.errorResult);
  }

  deleteDeal = (deal) => {
    this.error('');
    return this.bigTimeDealsClient.deleteDeal(deal.id,
      () => {
        this.refreshItems();
      }, this.error);
  }

  getDealsForDate = (date) => {
    this.error('');
    return this.bigTimeDealsClient.getDealsForDate(date, undefined, undefined,
      (items) => {
        this.component.setState({ dealsForDate: items })
      }, this.error);
  }

  blankDeal = {
    title: '',
    link: '',
    price: 0,
    category: '',
    brand: ''
  }
}

export default bigTimeDealsService;