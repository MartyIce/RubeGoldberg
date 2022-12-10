import React from "react";

class CustomerList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.customers && this.props.customers.map((t, i) =>
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <li key={i}>{JSON.stringify(t)}</li>)
        }
      </ul>
    )
  }
}
export default CustomerList