import './App.css';
import Data from "./components/home.js"
import Privacy from './components/Privacy.js';
import { Route, Router, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1 className='head'>Weather Forecast App</h1>
      <Routes>
        <Route path='/' element={<Data />}/>
        <Route path='/privacy' element={<Privacy/>}/>
      </Routes>
    </div>
  );
}

export default App;
