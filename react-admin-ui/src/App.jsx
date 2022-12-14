import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './Home'
import Layout from './Layout'
import MainView from './DynamoDB/MainView'

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />          
          <Route path="dynamodb/*" element={<MainView />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}