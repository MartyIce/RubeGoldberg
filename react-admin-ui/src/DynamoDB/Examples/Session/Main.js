import React from "react";
import ExpressClient from "../../ExpressClient.js";
import { Formik, Form, Field } from 'formik';
import SessionList from './SessionList'
import ErrorMsg from './ErrorMsg'
import { Accordion } from "flowbite-react";

const { v4: uuidv4 } = require('uuid');

// TODO - add this to CSS
const inputClassName = "mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black";

class SessionExample extends React.Component {
  expressClient = new ExpressClient();

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      username: '',
      sessionToken: '',
      errorText: ''
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

  createSession(username, sessionToken, ttl) {
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
        console.log(responseBody);
        if (res.status !== 200) {
          this.setState({ errorText: JSON.stringify(responseBody) });
        } else {
          this.refreshItems();
        }
      });
  }

  findSession(sessionToken) {
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
        console.log(responseBody);
        if (res.status !== 200) {
          this.setState({ errorText: JSON.stringify(responseBody) });
        } else {
          console.log(responseBody);
        }
      })
      .catch(async err => {
        console.log(err);
      })
  }

  getUserSessions(username) {
    this.setState({ ...this.state, errorText: '' });

    return this.expressClient.getUserSessions(username)
      .then(async res => {
        let responseBody = await res.json();
        console.log(responseBody);
        if (res.status !== 200) {
          this.setState({ ...this.state, errorText: JSON.stringify(responseBody) });
        } else {
          console.log(responseBody);
        }
      })
      .catch(async err => {
        console.log(err);
      })
  }

  genUuid() {
    this.setState({ ...this.state, sessionToken: uuidv4() });
  }


  input(label, name, addlElements) {
    return <label className="block">
      <span className="text-gray-700">{label}</span>
      <div className="block w-full">
        <Field type="text" name={name} className={inputClassName} />
        {addlElements && addlElements()}
      </div>
    </label>;
  }

  submitBtn(isSubmitting) {
    return <div>
      <button type="submit" disabled={isSubmitting} className="btn btn-blue">
        Submit
      </button>
    </div>
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
              <Formik
                initialValues={{ username: this.state.username, sessionToken: this.state.sessionToken, ttl: 604800 }}
                enableReinitialize={true}
                validateOnChange={true}
                onSubmit={(values, { setSubmitting }) => {
                  this.createSession(values.username, values.sessionToken, values.ttl).then(() => {
                    setSubmitting(false);
                  }).catch(() => {
                    setSubmitting(false);
                  });
                }}
                validate={(e) => {
                  this.setState({ ...this.state, ...e })
                }}
              >

                {({ isSubmitting }) => (
                  <Form className="grid grid-cols-1 gap-6">
                    {this.input('TTL', 'ttl')}
                    {this.input('Username', 'username')}
                    {this.input('Session Token', 'sessionToken', () => {
                      return <button className="btn btn-blue" type="button" onClick={() => this.genUuid()}>
                        Generate
                      </button>
                    })}
                    {this.submitBtn(isSubmitting)}
                  </Form>
                )}
              </Formik>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>
              Find Session
            </Accordion.Title>
            <Accordion.Content>
              <Formik
                initialValues={{ sessionToken: '' }}
                enableReinitialize={true}
                onSubmit={(values, { setSubmitting }) => {
                  this.findSession(values.sessionToken).then(() => {
                    setSubmitting(false);
                  }).catch(() => {
                    setSubmitting(false);
                  });
                }}
              >

                {({ isSubmitting }) => (
                  <Form className="grid grid-cols-1 gap-6">
                    {this.input('Session Token', 'sessionToken')}
                    {this.submitBtn(isSubmitting)}
                  </Form>
                )}
              </Formik>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>
              User Sessions
            </Accordion.Title>
            <Accordion.Content>
              <Formik
                initialValues={{ username: '' }}
                enableReinitialize={true}
                onSubmit={(values, { setSubmitting }) => {
                  this.getUserSessions(values.username).then(() => {
                    setSubmitting(false);
                  }).catch(() => {
                    setSubmitting(false);
                  });
                }}
              >

                {({ isSubmitting }) => (
                  <Form className="grid grid-cols-1 gap-6">
                    {this.input('Username', 'username')}
                    {this.submitBtn(isSubmitting)}
                  </Form>
                )}
              </Formik>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>

      </div>
    );
  }
}
export default SessionExample