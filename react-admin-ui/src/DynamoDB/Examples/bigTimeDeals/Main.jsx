import React from "react";
import { Accordion } from "flowbite-react";
import { accordionPanel } from '../../../Common/UIFragmentUtils'
import EntityList from "../../../Common/EntityList";
import JsonList from "../../../Common/JsonList";
import ErrorMsg from "../../../Common/ErrorMsg"
import CreateEntity from "../../../Common/CreateEntity";
import bigTimeDealsService from './bigTimeDealsService'
import DealsForDate from './DealsForDate'

class BigTimeDealsExample extends React.Component {

  constructor(props) {
    super(props);
    this.bigTimeDealsService = new bigTimeDealsService(this);
  }

  componentDidMount() {
    this.bigTimeDealsService.refreshItems();
  }

  render() {
    return (
      <div>
        {this.state.errorText && <ErrorMsg errorText={this.state.errorText} hideError={() => this.bigTimeDealsService.error('')} />}
        <Accordion alwaysOpen={true}>
          {accordionPanel("Deals", <EntityList results={this.state.deals}  delete={this.bigTimeDealsService.deleteDeal}/> )}
          {accordionPanel("DealsForDate", <DealsForDate retrieve={this.bigTimeDealsService.getDealsForDate} results={this.state.dealsForDate}/> )}

          {accordionPanel("Create Deal", <CreateEntity entity={this.bigTimeDealsService.blankDeal} create={this.bigTimeDealsService.createDeal}/>)}

          {accordionPanel("All Raw", <JsonList results={this.state.allRaw} />)}
          {accordionPanel("Deals Raw", <JsonList results={this.state.dealsRaw} />)}
        </Accordion>
      </div>
    );
  }
}
export default BigTimeDealsExample