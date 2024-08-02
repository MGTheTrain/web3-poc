import React from 'react';
import './App.css';
import Greeter from './Greeter';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Welcome to React with TypeScript and Web3.js</h1>
      <Greeter />
    </div>
  );
}

export default App;