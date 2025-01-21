import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Get the root element
const container = document.getElementById('root');

// Make sure container exists
if (!container) {
  throw new Error('Failed to find the root element');
}

// Create a root
const root = createRoot(container);

// Render app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
