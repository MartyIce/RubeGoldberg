import React from "react";

class SessionList extends React.Component {
  render() {
    return (
      <div>
        <div className="text-xl">Sessions:</div>
        <ul>
          {this.props.sessions.map((t, i) =>
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <li key={i}>{JSON.stringify(t)}</li>)
          }
        </ul>
      </div>
    )
  }
}
export default SessionList