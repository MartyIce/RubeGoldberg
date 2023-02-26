import React from "react";
import { Formik, Form } from 'formik';
import { input, submitBtn } from './UIFragmentUtils'
import { labelize } from './Utils'

class EditEntity extends React.Component {

  constructor(props) {
    super(props);

    let mappedFields = Array.isArray(this.props.fields) ? this.props.fields.reduce((a, v) => ({ ...a, [v]: v}), {})  : this.props.fields;

    this.fields = Object.keys(mappedFields).map(f => { return {
      name: f,
      label: labelize(f),
      disabled: mappedFields[f].disabled
    }});
  }

  render() {
    return (
      <div>
        <Formik
          initialValues={this.props.entity}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            this.props.save(values).then(() => {
              setSubmitting(false);
              if(this.props.saveComplete) this.props.saveComplete();
            }).catch(() => {
              setSubmitting(false);
              if(this.props.saveComplete) this.props.saveComplete();
            });
          }}
        >
          {({ isSubmitting }) => (
          <Form className="grid grid-cols-1 gap-6">
            {this.fields.map(f => input(f.label, f.name, null, this.state, f.disabled))}
            {submitBtn(isSubmitting, 'Save')}
          </Form>
          )}
          </Formik>
      </div>

    )
  }
}
export default EditEntity