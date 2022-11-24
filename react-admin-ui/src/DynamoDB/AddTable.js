import React from "react";
import ExpressClient from "./ExpressClient.js";
import { Formik, Form, Field } from 'formik';

class AddTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.expressClient = new ExpressClient();
  }

  addTableSchema = {
    AttributeDefinitions: [
      {
        AttributeName: "Artist",
        AttributeType: "S"
      },
      {
        AttributeName: "SongTitle",
        AttributeType: "S"
      }
    ],
    KeySchema: [
      {
        AttributeName: "Artist",
        KeyType: "HASH"
      },
      {
        AttributeName: "SongTitle",
        KeyType: "RANGE"
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    },
    TableName: "Music",
  };

  createTable(tableName, tableSchema) {
    return this.expressClient.createTable(tableName, tableSchema)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.props.tableAdded();
      });
  }

  render() {
    return (
      <div className="fixed p-8 bg-gray-600 bg-opacity-50 overflow-y-auto">
        <Formik
          initialValues={{ tableName: 'Music', tableSchema: JSON.stringify(this.addTableSchema, null, 2) }}
          onSubmit={(values, { setSubmitting }) => {
            this.createTable(values.tableName, values.tableSchema).then(() => {
              setSubmitting(false);
            });
          }}
        >

          {({ isSubmitting }) => (
            <Form>
              <Field type="text" name="tableName" />
              <Field as="textarea" name="tableSchema" className="text-area" rows={20} cols={40} />
              <button type="submit" disabled={isSubmitting} className="btn btn-blue">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
export default AddTable