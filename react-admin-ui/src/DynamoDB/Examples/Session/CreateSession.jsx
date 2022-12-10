import React from "react";
import { Formik, Form } from 'formik';
import { input, submitBtn } from '../../../Common/UIFragmentUtils'

const { v4: uuidv4 } = require('uuid');

class CreateSession extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      sessionToken: ''
    };
  }

  genUuid() {
    this.setState({ ...this.state, sessionToken: uuidv4() });
  }

  render() {
    return (
      <Formik
      initialValues={{ username: this.state.username, sessionToken: this.state.sessionToken, ttl: 604800 }}
      enableReinitialize={true}
      validateOnChange={true}
      onSubmit={(values, { setSubmitting }) => {
        this.props.createSession(values.username, values.sessionToken, values.ttl).then(() => {
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
          {input('TTL', 'ttl')}
          {input('Username', 'username')}
          {input('Session Token', 'sessionToken', () => {
            return <button className="btn btn-blue" type="button" onClick={() => this.genUuid()}>
              Generate
            </button>
          })}
          {submitBtn(isSubmitting)}
        </Form>
      )}
    </Formik>
)
  }
}
export default CreateSession