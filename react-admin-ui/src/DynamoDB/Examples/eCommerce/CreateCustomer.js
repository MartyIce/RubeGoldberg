import React from "react";
import { Formik, Form } from 'formik';
import { input, submitBtn } from '../../../Common/UIFragmentUtils'

class CreateCustomer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      name: ''
    };
  }

  render() {
    return (
      <Formik
      initialValues={{ username: this.state.username, email: this.state.email, name: this.state.name }}
      enableReinitialize={true}
      validateOnChange={true}
      onSubmit={(values, { setSubmitting }) => {
        this.props.createCustomer(values.username, values.email, values.name).then(() => {
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
          {input('Username', 'username')}
          {input('Email', 'email')}
          {input('Name', 'name')}
          {submitBtn(isSubmitting)}
        </Form>
      )}
    </Formik>
)
  }
}
export default CreateCustomer