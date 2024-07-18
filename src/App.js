import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContractDetails from './contract/ContractDetails';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contract/:contractId" element={<ContractDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
