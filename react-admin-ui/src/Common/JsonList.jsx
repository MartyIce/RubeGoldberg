import React from "react";

class JsonList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.results && this.props.results.map((t, i) =>
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <li key={i}>{JSON.stringify(t)}</li>)
        }
      </ul>
    )
  }
}
export default JsonList