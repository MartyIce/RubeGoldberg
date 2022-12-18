import React from "react";
import { btn } from './UIFragmentUtils'

class EntityList extends React.Component {
  thClassName = "bg-blue-100 border text-left px-8 py-4";
  tdClassName = "border px-8 py-4";

  render() {
    return (
      <table className="table-auto shadow-lg bg-white">
        <thead>
          <tr>
            {Object.keys(this.props.fields).map((f, i) => <th className={this.thClassName} key={`Entity_List_Header${i}`}>{f}</th>)}
            <th className={this.thClassName} key={`Entity_List_Header_delete`}></th>
          </tr>
        </thead>
        <tbody>
          {this.props.results && this.props.results.map((t, i) =>
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <tr key={`Entity_List${i}`} onClick={() => this.props.select(t)}>
              {Object.keys(this.props.fields).map(f => <td className={this.tdClassName} key={`Entity_List${i}_${f}`}>{t[f]}</td>)}
              <td className={this.tdClassName} key={`Entity_List${i}_delete`}>
                {btn(false, 'Delete', () => this.props.delete(t))}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )
  }
}
export default EntityList