import React from "react";
import TableList from "./TableMgt/TableList";
import SessionExample from "./Examples/Session/Main";
import ECommerceExample from "./Examples/eCommerce/Main";
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
          Welcome to my "sandbox implementation" of the examples from Alex DeBrie's "The DynamoDB Book".  
          Click below for a variety of tools and implementations of those examples.
        </div>
        <div>
        <ul className="list-disc">
          <li>
              <Link className="text-blue-500 hover:text-blue-800" to="/dynamodb">Tables - lists tables in DynamoDB, provides crude method of adding another</Link>
            </li>
            <li>
              <Link className="text-blue-500 hover:text-blue-800" to="/dynamodb/session-example">Sessions - examples from Ch 18.3</Link>
            </li>
            <li>
              <Link className="text-blue-500 hover:text-blue-800" to="/dynamodb/ecommerce-example">eCommerce - examples from 19.3</Link>
            </li>
          </ul>
          <div className="py-4">
            <Outlet />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<TableList />} />
          <Route path="/session-example" element={<SessionExample />} />
          <Route path="/ecommerce-example" element={<ECommerceExample />} />
        </Routes>
      </div>
    );
  }
}
export default MainView