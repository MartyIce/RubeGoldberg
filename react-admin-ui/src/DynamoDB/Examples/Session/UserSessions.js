import React from "react";
import { Formik, Form } from 'formik';
import { input, submitBtn } from '../../../Common/FormUtils'
import SessionList from './SessionList'

const { v4: uuidv4 } = require('uuid');

class UserSessions extends React.Component {

  genUuid() {
    this.setState({ ...this.state, sessionToken: uuidv4() });
  }

  render() {
    return (
      <div>
        <Formik
          initialValues={{ username: '' }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            this.props.getUserSessions(values.username).then(() => {
              setSubmitting(false);
            }).catch(() => {
              setSubmitting(false);
            });
          }}
        >

          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-6">
              {input('Username', 'username')}
              {submitBtn(isSubmitting)}
            </Form>
          )}
        </Formik>

        <SessionList sessions={this.props.results} />
      </div>

    )
  }
}
export default UserSessions