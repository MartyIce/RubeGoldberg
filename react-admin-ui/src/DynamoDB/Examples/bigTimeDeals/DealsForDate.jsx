import React from "react";
import FindEntity from "../../../Common/FindEntity";
import EntityList from "../../../Common/EntityList";

class DealsForDate extends React.Component {

  find = (values) => {
    return this.props.retrieve(values.date);
  } 

  displayResults = () => this.props.results &&
    <div>
      Deals:
      <EntityList results={this.props.results} />
    </div>

  render() {
    return (<div>
        <FindEntity searchFields={{ date: '' }} find={this.find} displayResults={this.displayResults} />
      </div>)
  }

}
export default DealsForDate