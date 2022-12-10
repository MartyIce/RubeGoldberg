import React from "react";
import { Formik, Form } from 'formik';
import { input, submitBtn } from './UIFragmentUtils'
import { labelize } from './Utils'

class FindEntity extends React.Component {
  render() {
    return (
      <div>
        <Formik
          initialValues={this.props.searchFields}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            this.props.find(values).then(() => {
              setSubmitting(false);
            }).catch(() => {
              setSubmitting(false);
            });
          }}
        >

          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-6">
              {Object.keys(this.props.searchFields).map(p => input(labelize(p), p, this.state))}
              {submitBtn(isSubmitting)}
            </Form>
          )}
        </Formik>
        {this.props.displayResults()}
      </div>

    )
  }
}
export default FindEntity