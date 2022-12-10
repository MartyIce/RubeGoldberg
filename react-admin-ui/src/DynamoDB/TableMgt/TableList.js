import React from "react";
import ExpressClient from "./ExpressClient.js";
import AddTable from "./AddTable.js";

class TableList extends React.Component {
  expressClient = new ExpressClient();

  constructor(props) {
    super(props);
    this.state = {
      tables: [],
      newTableName: 'Music',
      tableSchema: null,
      addingTable: false
    };
    this.expressClient = new ExpressClient();
  }

  refreshTables = () => {
    this.expressClient.getTables()
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({ tables: res.TableNames });
      });
  }

  componentDidMount() {
    this.refreshTables();
  }

  deleteTable(tableName) {
    return this.expressClient.deleteTable(tableName)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.refreshTables();
      });
  }

  describeTable = (tableName) => {
    this.expressClient.describeTable(tableName)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({ tableSchema: res.Table });
      });
  }

  handleTableNameChange(event) {
    this.setState({ newTableName: event.target.value });
  };

  beginAddTable = () => {
    this.setState({ addingTable: true });
  }

  tableAdded = () => {
    this.setState({ addingTable: false });
    this.refreshTables();
  }

  render() {
    return (
      <div>
        <button 
          className="btn btn-blue"
          onClick={() => this.beginAddTable()}>
          Add Table
        </button>
        {this.state.addingTable && <AddTable tableAdded={this.tableAdded} />}
        
        <div className="pt-4">
          <h3>Tables:</h3>
          <ul>
            {this.state.tables.map((t, i) =>
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <li key={i} onClick={() => this.describeTable(t)}>{t} <a onClick={() => this.deleteTable(t)}>X</a></li>)}
          </ul>
          {this.state.tableSchema && <div><pre>{JSON.stringify(this.state.tableSchema, null, 2)}</pre></div>}
        </div>
      </div>
    );
  }
}
export default TableList