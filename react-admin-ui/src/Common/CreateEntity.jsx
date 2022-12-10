import React from "react";
import { Formik, Form } from 'formik';
import { input, submitBtn } from './UIFragmentUtils'
import { labelize } from './Utils'

class CreateEntity extends React.Component {

    constructor(props) {
        super(props);

        const entity = {};
        for (const property in this.props.entity) {
            entity[property] = '';
        }
        this.state = {
            entity: entity
        };
    }

    render() {
        return (
            <Formik
                initialValues={this.state.entity}
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
                        {Object.keys(this.state.entity).map(p => input(labelize(p), p))}
                        {submitBtn(isSubmitting)}
                    </Form>
                )}
            </Formik>
        )
    }
}
export default CreateEntity