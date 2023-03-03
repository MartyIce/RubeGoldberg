import React from "react";
import { btn } from './UIFragmentUtils'
import { Modal } from "flowbite-react";

class EntityList extends React.Component {
  thClassName = "bg-blue-100 border text-left px-8 py-4";
  tdClassName = "border px-8 py-4";

  constructor(props) {
    super(props);

    let fields = [];
    if(this.props.fields) {
      fields = Array.isArray(this.props.fields) ? this.props.fields : Object.keys(this.props.fields);
    } else if(this.props.results && this.props.results.length > 0) {
      fields = Object.keys(this.props.results[0])
    }
  
    this.state = {
      editEntity: null,
      fields: fields
    };
  }

  edit = (e) => {
    this.setState({ ...this.state, editEntity: this.state.editEntity ? null : e });
  }

  saveComplete = () => {
    this.setState({ ...this.state, editEntity: null });
  }

  render() {
    return (
      <div>
        <table className="table-auto shadow-lg bg-white">
          <thead>
            <tr>
              {this.state.fields.map((f, i) => <th className={this.thClassName} key={`Entity_List_Header${i}`}>{f}</th>)}
              {this.props.delete && 
              <th className={this.thClassName} key={`Entity_List_Header_delete`}></th>
              }
              {this.props.edit && 
              <th className={this.thClassName} key={`Entity_List_Header_edit`}></th>
              }
            </tr>
          </thead>
          <tbody>
            {this.props.results && this.props.results.map((t, i) =>
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <tr key={`Entity_List${i}`} >
                {this.state.fields.map(f =>
                  <td className={this.tdClassName} key={`Entity_List${i}_${f}`} onClick={() => this.props.select ? this.props.select(t) : () => { }}>{t[f]}</td>)}
                {this.props.delete && 
                <td className={this.tdClassName} key={`Entity_List${i}_delete`}>
                  {btn(false, 'Delete', () => this.props.delete(t))}
                </td>
                }
                {this.props.edit && 
                  <td className={this.tdClassName} key={`Entity_List${i}_edit`}>
                  {this.props.edit && btn(false, 'Edit', () => this.edit(t))}
                </td>
                }
              </tr>
            )}
          </tbody>
        </table>
        {
          <Modal show={this.state.editEntity} onClose={() => this.setState({...this.state, editEntity: null})} size="5xl">
              <Modal.Header>
                Edit
              </Modal.Header>
            <Modal.Body className="overflow-scroll modal-restricted">
              {this.state.editEntity && this.props.edit(this.state.editEntity, this.saveComplete)}
            </Modal.Body>
          </Modal>
        }
      </div>
    )
  }
}
export default EntityList