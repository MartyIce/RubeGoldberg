import React from "react";
import TableList from "./TableList.js";
import SessionExample from "./Examples/Session.js";
import { Routes, Route, Outlet, Link } from "react-router-dom";

class MainView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <div>
          <nav className="py-4">
            <ul className="flex">
              <li className="mr-6">
                <Link className="text-blue-500 hover:text-blue-800" to="/dynamodb">Tables</Link>
              </li>
              <li className="mr-6">
                <Link className="text-blue-500 hover:text-blue-800" to="/dynamodb/session-example">Session Example</Link>
              </li>
            </ul>
          </nav>

          <hr />

          <div className="py-4">
            <Outlet />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<TableList />} />
          <Route path="/session-example" element={<SessionExample />} />
        </Routes>
      </div>
    );
  }
}
export default MainView