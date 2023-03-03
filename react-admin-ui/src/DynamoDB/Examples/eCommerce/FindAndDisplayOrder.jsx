import React from "react";
import FindEntity from "../../../Common/FindEntity";
import EntityList from "../../../Common/EntityList";

class FindAndDisplayOrder extends React.Component {

  find = (values) => {
    return this.props.retrieve(values.orderId);
  } 

  displayResults = () => this.props.results &&
    <div>
      Orders:
      <EntityList results={[ this.props.results.order ]} />
      Order Items
      <EntityList results={this.props.results.orderItems} />
    </div>

  render() {
    return (<div>
        <FindEntity searchFields={{ orderId: '' }} find={this.find} displayResults={this.displayResults} />
      </div>)
  }
}
export default FindAndDisplayOrder