import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Contract from './contract/Contract';
import AddContract from './contract/AddContract';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contract/:contractId" element={<Contract />} />
          <Route path="/add" element={<AddContract />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
