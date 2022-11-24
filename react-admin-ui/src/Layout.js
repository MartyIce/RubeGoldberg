import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="px-8">
      {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
      <nav className="py-4">
        <ul className="flex">
          <li className="mr-6">
            <Link className="text-blue-500 hover:text-blue-800" to="/">Home</Link>
          </li>
          <li className="mr-6">
            <Link className="text-blue-500 hover:text-blue-800" to="/dynamodb">DynamoDB</Link>
          </li>
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
      <div className="py-4">
        <Outlet />
      </div>
    </div>
  );
}
