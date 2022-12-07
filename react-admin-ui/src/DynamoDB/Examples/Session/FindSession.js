import React from "react";
import { Formik, Form } from 'formik';
import { input, submitBtn } from '../../../Common/FormUtils'
import SessionList from './SessionList'

const { v4: uuidv4 } = require('uuid');

class CreateSession extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  genUuid() {
    this.setState({ ...this.state, sessionToken: uuidv4() });
  }

  render() {
    return (
      <div>
        <Formik
          initialValues={{ sessionToken: '' }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            this.props.findSession(values.sessionToken).then(() => {
              setSubmitting(false);
            }).catch(() => {
              setSubmitting(false);
            });
          }}
        >

          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-6">
              {input('Session Token', 'sessionToken')}
              {submitBtn(isSubmitting)}
            </Form>
          )}
        </Formik>
        <SessionList sessions={this.props.results} />
      </div>

    )
  }
}
export default CreateSession