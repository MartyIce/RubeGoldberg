import React from "react";
import bigTimeDealsClient from "./bigTimeDealsClient";
import { Accordion } from "flowbite-react";
import { accordionPanel } from '../../../Common/UIFragmentUtils'
import EntityList from "../../../Common/EntityList";
import JsonList from "../../../Common/JsonList";
import ErrorMsg from "../../../Common/ErrorMsg"
import CreateEntity from "../../../Common/CreateEntity";

class BigTimeDealsExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allRaw: [],
      deals: [],
      dealsRaw: [],
    };
    this.bigTimeDealsClient = new bigTimeDealsClient();
  }

  componentDidMount() {
    this.refreshItems();
  }

  error = (errorText) => {
    this.setState({ errorText: errorText });
  }

  errorResult = (error) => {
    this.setState({ errorText: JSON.stringify(error) });
  }

  refreshItems = () => {
    this.error('');
    this.bigTimeDealsClient.getAll((ret) => this.setState({ allRaw: ret }), this.errorResult);
    this.bigTimeDealsClient.getDeals((ret) => this.setState({ deals: ret }), this.errorResult);
    this.bigTimeDealsClient.getDealsRaw((ret) => this.setState({ dealsRaw: ret }), this.errorResult);
  }

  createDeal = (deal) => {
    this.error('');
    return this.bigTimeDealsClient.postDeal(deal, () => this.refreshItems(), this.errorResult);
  }

  blankDeal = {
    title: '',
    link: '',
    price: 0,
    category: '',
    brand: ''
  }

  render() {
    return (
      <div>
        {this.state.errorText && <ErrorMsg errorText={this.state.errorText} hideError={() => this.setState({ errorText: '' })} />}
        <Accordion alwaysOpen={true}>
          {accordionPanel("Deals", <EntityList results={this.state.deals} /> )}

          {accordionPanel("Create Deal", <CreateEntity entity={this.blankDeal} create={this.createDeal}/>)}

          {accordionPanel("All Raw", <JsonList results={this.state.allRaw} />)}
          {accordionPanel("Deals Raw", <JsonList results={this.state.dealsRaw} />)}
        </Accordion>
      </div>
    );
  }
}
export default BigTimeDealsExample