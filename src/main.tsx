import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './index.css';

// Initialize the application
const initApp = async () => {
  try {
    console.log('Application initialized with mock data');
    
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
        <ToastContainer position="bottom-right" />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
};

// Start the application
initApp();
