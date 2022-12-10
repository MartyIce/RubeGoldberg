import React from "react";

class SessionList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.sessions && this.props.sessions.map((t, i) =>
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <li key={i}>{JSON.stringify(t)}</li>)
        }
      </ul>
    )
  }
}
export default SessionList