import React from "react";
import { Formik, Form } from 'formik';
import { input, submitBtn } from './UIFragmentUtils'
import { labelize } from './Utils'

class CreateEntity extends React.Component {

    handler(p) {
        return this.props.extraControls && this.props.extraControls.hasOwnProperty(p) ? this.props.extraControls[p] : undefined;
    }
    render() {
        return (
            <Formik
                initialValues={this.props.entity}
                enableReinitialize={true}
                validateOnChange={true}
                onSubmit={(values, { setSubmitting }) => {
                    this.props.create(values).then(() => {
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
                        {Object.keys(this.props.entity).map(p => input(labelize(p), p, this.handler(p), this.state))}
                        {submitBtn(isSubmitting)}
                    </Form>
                )}
            </Formik>
        )
    }
}
export default CreateEntity