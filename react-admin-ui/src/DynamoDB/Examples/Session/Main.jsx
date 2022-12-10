import React from "react";
import SessionClient from "./SessionClient";
import CreateSession from './CreateSession'
import FindSession from './FindSession'
import UserSessions from './UserSessions'
import DeleteUserSessions from './DeleteUserSessions'
import ErrorMsg from '../../../Common/ErrorMsg'
import { Accordion } from "flowbite-react";
import { accordionPanel } from '../../../Common/UIFragmentUtils'
import JsonList from "../../../Common/JsonList";

class SessionExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      username: '',
      sessionToken: '',
      errorText: '',
      findSessionResults: [],
      getUserSessionsResults: [],
      deleteUserSessionsResults: {}
    };
    this.sessionClient = new SessionClient();
  }

  componentDidMount() {
    this.refreshItems();
  }

  error = (errorText) => {
    this.setState({ errorText: errorText });
  }

  refreshItems = () => {
    this.setState({ errorText: '' });
    return this.sessionClient.getSessions(
      (items) => this.setState({ items: items}),
      (error) => this.setState({ errorText: JSON.stringify(error) }) );
  }

  createSession = (username, sessionToken, ttl) => {
    this.setState({ errorText: '' });
    let created_at = new Date();
    let expires_at = new Date();
    expires_at.setDate((new Date()).getDate() + (ttl / (60 * 60 * 24)));

    return this.sessionClient.createSession(
      sessionToken, username, created_at, expires_at,
      () => this.refreshItems(), this.error);
  }

  findSession = (sessionToken) => {
    this.setState({ errorText: '' });
    return this.sessionClient.findSession(sessionToken, 
      (items) => this.setState({ findSessionResults: items}), this.error );
  }

  getUserSessions = (username) => {
    this.setState({ errorText: '' });
    return this.sessionClient.getUserSessions(username, 
      (items) => this.setState({ getUserSessionsResults: items}), this.error );
    }

  deleteUserSessions = (username) => {
    this.setState({ errorText: '' });
    return this.sessionClient.deleteUserSessions(username, 
      (results) => {
        this.setState({ deleteUserSessionsResults: results});
        this.refreshItems();
      }, 
      this.error);
    }

  render() {
    return (
      <div>
        {this.state.errorText && <ErrorMsg errorText={this.state.errorText} hideError={() => this.setState({ errorText: '' })} />}
        <Accordion alwaysOpen={true}>
          {accordionPanel("Sessions", <JsonList results={this.state.items} />)}
          {accordionPanel("Create Session", <CreateSession createSession={this.createSession} />)}
          {accordionPanel("Find Session", <FindSession findSession={this.findSession} results={this.state.findSessionResults} />)}
          {accordionPanel("User Sessions", <UserSessions getUserSessions={this.getUserSessions} results={this.state.getUserSessionsResults} />)}
          {accordionPanel("Delete User Sessions", <DeleteUserSessions deleteUserSessions={this.deleteUserSessions} results={this.state.deleteUserSessionsResults}/>)}
        </Accordion>
      </div>
    );
  }
}
export default SessionExample