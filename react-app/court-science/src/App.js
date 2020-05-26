import React from 'react';
import logo from './logo.svg';
import './App.css';
import RadarChart from './RadarChart';

function App() {
  return (
    <div className="App">
      <svg width="550" height="550"> 
        <RadarChart width={450} height={450}/>
      </svg>
    </div>
  );
}

export default App;
