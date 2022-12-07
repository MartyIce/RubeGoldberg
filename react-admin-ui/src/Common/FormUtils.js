import { Field } from 'formik';

// TODO - add this to CSS
const inputClassName = "mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black";

const input = (label, name, addlElements) => {
    return <label className="block">
        <span className="text-gray-700">{label}</span>
        <div className="block w-full">
            <Field type="text" name={name} className={inputClassName} />
            {addlElements && addlElements()}
        </div>
    </label>;
}

const submitBtn = (isSubmitting) => {
    return <div>
        <button type="submit" disabled={isSubmitting} className="btn btn-blue">
            Submit
        </button>
    </div>
}

export { input, submitBtn }