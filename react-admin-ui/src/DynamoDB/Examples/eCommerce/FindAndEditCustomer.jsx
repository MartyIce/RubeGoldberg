import React from "react";
import FindEntity from "../../../Common/FindEntity";
import EditCustomer from './EditCustomer';

class FindAndEditCustomer extends React.Component {

  find = (values) => {
    return this.props.retrieve(values.username);
  } 
  displayResults = () => this.props.results.length > 0 &&
    <EditCustomer customer={this.props.results[0]} save={this.props.save} />; 
          
  render() {
    return (<div>
        <FindEntity searchFields={{ username: '' }} find={this.find} displayResults={this.displayResults} />
      </div>)
  }
}
export default FindAndEditCustomer