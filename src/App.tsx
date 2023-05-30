import React from 'react';
import logo from './logo.svg';
import './App.css';
import gifImage from './Assets/stonks.gif';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={gifImage} className="App-logo" alt="logo" />
        <p className='mt-5'>
          Witam w stonks market! Nauka tradingu dla każdego!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
