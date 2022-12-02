import React from "react";
import ExpressClient from "../ExpressClient.js";
import { Formik, Form, Field } from 'formik';
const { v4: uuidv4 } = require('uuid');

class SessionExample extends React.Component {
  expressClient = new ExpressClient();

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      sessionToken: '',
      errorText: ''
    };
    this.expressClient = new ExpressClient();
  }

  refreshItems = () => {
    this.expressClient.getItems('SessionStore')
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
    return this.expressClient.postItem("SessionStore", item, "attribute_not_exists(SessionToken)")
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

    return this.expressClient.queryItems(
      "SessionStore",
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

  genUuid() {
    this.setState({ sessionToken: uuidv4() });
  }

  render() {
    return (
      <div>
        {this.state.errorText && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{this.state.errorText}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" onClick={() => this.setState({ errorText: '' })}><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
          </span>
        </div>}
        <div className="pt-4">
          <div className="text-xl">Sessions:</div>
          <ul>
            {this.state.items.map((t, i) =>
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <li key={i}>{JSON.stringify(t)}</li>)
            }
          </ul>
        </div>

        <div className="pt-4">
          <div className="text-xl">Create Session:</div>
          <Formik
            initialValues={{ username: '', sessionToken: this.state.sessionToken, ttl: 604800 }}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting }) => {
              this.createSession(values.username, values.sessionToken, values.ttl).then(() => {
                setSubmitting(false);
              }).catch(() => {
                setSubmitting(false);
              });
            }}
          >

            {({ isSubmitting }) => (
              <Form>
                <label htmlFor="ttl">TTL:</label>
                <Field type="text" name="ttl" /><br />
                <label htmlFor="username">Username:</label>
                <Field type="text" name="username" /><br />
                <label htmlFor="sessionToken">Session Token:</label>
                <Field type="text" name="sessionToken" />
                <button className="btn btn-blue" type="button" onClick={() => this.genUuid()}>
                  Generate
                </button>
                <br />
                <button type="submit" disabled={isSubmitting} className="btn btn-blue">
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="pt-4">
          <div className="text-xl">Find Session:</div>
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
              <Form>
                <label htmlFor="sessionToken">Session Token:</label>
                <Field type="text" name="sessionToken" />
                <br />
                <button type="submit" disabled={isSubmitting} className="btn btn-blue">
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}
export default SessionExample