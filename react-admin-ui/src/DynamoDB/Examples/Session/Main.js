import React from "react";
import ExpressClient from "../../ExpressClient.js";
import CreateSession from './CreateSession'
import FindSession from './FindSession'
import UserSessions from './UserSessions'
import SessionList from './SessionList'
import ErrorMsg from '../../../Common/ErrorMsg'
import { Accordion } from "flowbite-react";

class SessionExample extends React.Component {
  expressClient = new ExpressClient();

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      username: '',
      sessionToken: '',
      errorText: '',
      findSessionResults: [],
      getUserSessionsResults: []
    };
    this.expressClient = new ExpressClient();
  }

  refreshItems = () => {
    this.expressClient.getSessions()
      .then(res => res.json())
      .then(res => {
        if (res.Items) {
          this.setState({ items: res.Items });
        }
      });
  }

  componentDidMount() {
    this.refreshItems();
  }

  createSession = (username, sessionToken, ttl) => {
    this.setState({ errorText: '' });
    let created_at = new Date();
    let expires_at = new Date();
    expires_at.setDate((new Date()).getDate() + (ttl / (60 * 60 * 24)));

    let item = {
      "SessionToken": { "S": sessionToken },
      "Username": { "S": username },
      "CreatedAt": { "S": created_at },
      "ExpiresAt": { "S": expires_at },
      "TTL": { "N": expires_at.getTime() }
    }
    return this.expressClient.postSession(item)
      .then(async res => {
        let responseBody = await res.json();
        if (res.status !== 200) {
          this.setState({ errorText: JSON.stringify(responseBody) });
        } else {
          this.refreshItems();
        }
      });
  }

  findSession = (sessionToken) => {
    this.setState({ errorText: '' });

    return this.expressClient.querySessions(
      "#token = :token",
      "#ttl >= :epoch",
      {
        "#token": "SessionToken",
        "#ttl": "TTL"
      },
      {
        ":token": { "S": sessionToken },
        ":epoch": { "N": Date.now() }
      })
      .then(async res => {
        let responseBody = await res.json();
        if (res.status !== 200) {
          this.setState({ errorText: JSON.stringify(responseBody) });
        } else {
          this.setState({ findSessionResults: responseBody.Items });
        }
      })
      .catch(async err => {
        console.log(err);
      })
  }

  getUserSessions = (username) => {
    this.setState({ ...this.state, errorText: '' });

    return this.expressClient.getUserSessions(username)
      .then(async res => {
        let responseBody = await res.json();
        console.log(responseBody);
        if (res.status !== 200) {
          this.setState({ ...this.state, errorText: JSON.stringify(responseBody) });
        } else {
          this.setState({ getUserSessionsResults: responseBody.Items });
        }
      })
      .catch(async err => {
        console.log(err);
      })
  }

  render() {
    return (
      <div>
        {this.state.errorText && <ErrorMsg errorText={this.state.errorText} hideError={() => this.setState({ errorText: '' })} />}



        <Accordion alwaysOpen={true}>
          <Accordion.Panel>
            <Accordion.Title>
              Sessions
            </Accordion.Title>
            <Accordion.Content>
              <SessionList sessions={this.state.items} />
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>
              Create Session
            </Accordion.Title>
            <Accordion.Content>
              <CreateSession createSession={this.createSession}/>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>
              Find Session
            </Accordion.Title>
            <Accordion.Content>
              <FindSession findSession={this.findSession} results={this.state.findSessionResults}/>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>
              User Sessions
            </Accordion.Title>
            <Accordion.Content>
              <UserSessions getUserSessions={this.getUserSessions} results={this.state.getUserSessionsResults}/>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>

      </div>
    );
  }
}
export default SessionExample