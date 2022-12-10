import { Field } from 'formik';
import { Accordion } from "flowbite-react";

// TODO - add this to CSS
const inputClassName = "mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black";

const input = (label, name, addlElements) => {
  return <label className="block" key={name}>
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

const accordionPanel = (title, inner) => {
  return (<Accordion.Panel>
    <Accordion.Title>
      {title}
    </Accordion.Title>
    <Accordion.Content>
      {inner}
    </Accordion.Content>
  </Accordion.Panel>)
}

export { input, submitBtn, accordionPanel }