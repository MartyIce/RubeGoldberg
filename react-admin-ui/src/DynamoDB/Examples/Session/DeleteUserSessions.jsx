import React from "react";
import { Formik, Form } from 'formik';
import { input, submitBtn } from '../../../Common/UIFragmentUtils'

class DeleteUserSessions extends React.Component {

  render() {
    return (
      <div>
        <Formik
          initialValues={{ username: '' }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            this.props.deleteUserSessions(values.username).then(() => {
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
        <div>{JSON.stringify(this.props.results)}</div>
      </div>

    )
  }
}
export default DeleteUserSessions