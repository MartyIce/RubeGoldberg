import React from "react";
import { Formik, Form } from 'formik';
import { input, submitBtn, btn } from './UIFragmentUtils'
import { labelize } from './Utils'

class EditEntityList extends React.Component {

  constructor(props) {
    super(props);
    this.fields = Object.keys(this.props.fields).map(f => {
      return {
        name: f,
        label: labelize(f),
        disabled: this.props.fields[f].disabled,
        propIdentifier: f.propIdentifier
      }
    });
  }

  blankEntity() {
    let ret = {};
    Object.keys(this.props.fields).forEach(f => ret[f] = '');
    return ret;
  }

  render() {
    return (
      <div>
        {this.props.entityList.map((e, i) =>
          <Formik
            key={`Entity_${i}`}
            initialValues={e}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting }) => {
              this.props.save(values, i).then(() => {
                setSubmitting(false);
              }).catch(() => {
                setSubmitting(false);
              });
            }}
          >
            {({ isSubmitting }) => (
              <Form className="grid grid-cols-1 gap-6">
                {this.fields.map(f => input(f.label, f.name, null, this.state, f.disabled))}
                <div className="grid grid-cols-2 gap-2 pb-4">
                  {submitBtn(isSubmitting, 'Save')}
                  {btn(false, 'Delete', () => this.props.delete(e))}
                </div>
              </Form>
            )}
          </Formik>
        )}
        <div className="grid grid-cols-1">
          {btn(false, 'Add New', () => this.props.addNew(this.blankEntity()))}
        </div>
      </div>
    )
  }
}
export default EditEntityList