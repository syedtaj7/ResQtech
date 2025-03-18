import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to fetch disaster data
async function fetchDisasterData() {
  const response = await fetch("https://api.reliefweb.int/v1/reports?appname=apidoc&limit=5");
  const data = await response.json();
  console.log(data);
}
fetchDisasterData();

reportWebVitals();