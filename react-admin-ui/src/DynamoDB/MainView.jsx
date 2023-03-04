import React from "react";
import TableList from "./TableMgt/TableList";
import SessionExample from "./Examples/Session/Main";
import ECommerceExample from "./Examples/eCommerce/Main";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import BigTimeDealsExample from "./Examples/bigTimeDeals/Main";

class MainView extends React.Component {

  constructor(props) {
    super(props);

    let baseUrl = '/dynamodb';
    this.state = {
      items: [
        {
          link: `${baseUrl}`,
          desc: 'Tables - lists tables in DynamoDB, provides crude method of adding another',
          path: '/',
          element: <TableList />
        },
        {
          link: `${baseUrl}/session-example`,
          desc: 'Sessions - examples from Ch 18.3',
          path: '/session-example',
          element: <SessionExample />
        },
        {
          link: `${baseUrl}/ecommerce-example`,
          desc: 'ECommerce - examples from Ch 19.3',
          path: '/ecommerce-example',
          element: <ECommerceExample />
        },
        {
          link: `${baseUrl}/bigtimedeals-example`,
          desc: 'BigTimeDeals - examples from Ch 20.3',
          path: '/bigtimedeals-example',
          element: <BigTimeDealsExample />
        },
      ]
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
            {
              this.state.items.map((i,i1) => <li key={`li_${i1}`}>
                <Link className="text-blue-500 hover:text-blue-800" to={i.link}>{i.desc}</Link>
              </li>)
            }
          </ul>
          <div className="py-4">
            <Outlet />
          </div>
        </div>
        <Routes>
          {
            this.state.items.map((i, i1) => <Route path={i.path} element={i.element} key={`li_${i1}`}/>)
          }
        </Routes>
      </div>
    );
  }
}
export default MainView