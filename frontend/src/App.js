import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import AccidentExplorer from './components/AccidentExplorer';
import Predictions from './components/Predictions';
import Visualizations from './components/Visualizations';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'explorer':
        return <AccidentExplorer />;
      case 'predictions':
        return <Predictions />;
      case 'visualizations':
        return <Visualizations />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>✈️ Aviation Flight ML Predictions</h1>
        <p>Machine Learning Analysis of Aviation Safety Data</p>
      </header>

      <nav className="app-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'explorer' ? 'active' : ''} 
          onClick={() => setActiveTab('explorer')}
        >
          🔍 Accident Explorer
        </button>
        <button 
          className={activeTab === 'visualizations' ? 'active' : ''} 
          onClick={() => setActiveTab('visualizations')}
        >
          📈 Visualizations
        </button>
        <button 
          className={activeTab === 'predictions' ? 'active' : ''} 
          onClick={() => setActiveTab('predictions')}
        >
          🎯 Predictions
        </button>
      </nav>

      <main className="app-content">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>Data Source: NTSB, FAA, WAAS Aviation Accident Database</p>
      </footer>
    </div>
  );
}

export default App;
