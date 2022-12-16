import React from "react";
import FindEntity from "../../../Common/FindEntity";
import EditEntity from "../../../Common/EditEntity";

class EditCustomer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  fields = {
    username: {
      disabled: true
    },
    email: {
      disabled: true
    },
    name: {
      disabled: false
    },
  }

  find = (values) => this.props.retrieve(values.username);

  save = (values) => {
    return this.props.save(values.username, values.name, {});
  }

  displayResults = () => this.props.results.length > 0 && 
    (<>
      <EditEntity entity={this.props.results[0]} fields={this.fields} save={this.save} />
    </>)
  
  render() {
    return (
      <div>
      <FindEntity searchFields={{ username: '' }} find={this.find} displayResults={this.displayResults} />

      </div>
    )
  }
}
export default EditCustomer