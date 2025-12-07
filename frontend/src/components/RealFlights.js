import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import '../App.css';

function RealFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchRealFlights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getRealFlights();
      setFlights(response.flights || []);
      setTimestamp(response.timestamp);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch live flight data');
      console.error('Error fetching real flights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch flights on component mount
    fetchRealFlights();
  }, []);

  useEffect(() => {
    // Auto-refresh every 2 minutes if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchRealFlights();
      }, 120000); // 2 minutes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return '#4CAF50';
      case 'moderate':
        return '#FFC107';
      case 'high':
        return '#FF9800';
      case 'critical':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getSeverityColor = (severity) => {
    const severityLower = severity?.toLowerCase() || '';
    if (severityLower.includes('fatal')) return '#e91e63';
    if (severityLower.includes('incident')) return '#03a9f4';
    if (severityLower.includes('minor')) return '#4caf50';
    return '#9c27b0';
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'active': '#4CAF50',
      'scheduled': '#2196F3',
      'landed': '#9E9E9E',
      'cancelled': '#F44336',
      'incident': '#FF9800',
      'diverted': '#FFC107'
    };
    
    return (
      <span 
        style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.85em',
          fontWeight: '500',
          backgroundColor: statusColors[status?.toLowerCase()] || '#757575',
          color: 'white'
        }}
      >
        {status || 'Unknown'}
      </span>
    );
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="real-flights-container">
      <div className="section-header">
        <h2>✈️ Live Flight Predictions</h2>
        <p>Real-time flight data with ML-powered risk predictions</p>
      </div>

      <div className="controls-section">
        <button 
          onClick={fetchRealFlights} 
          disabled={loading}
          className="fetch-button"
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh Flight Data'}
        </button>
        
        <label className="auto-refresh-toggle">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          <span>Auto-refresh every 2 minutes</span>
        </label>

        {timestamp && (
          <div className="timestamp-info">
            Last updated: {formatTimestamp(timestamp)}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Fetching live flight data and generating predictions...</p>
        </div>
      )}

      {!loading && flights.length === 0 && !error && (
        <div className="no-data-message">
          <p>No flight data available. Click "Refresh Flight Data" to fetch live flights.</p>
        </div>
      )}

      {!loading && flights.length > 0 && (
        <div className="flights-grid">
          <div className="flights-summary">
            <h3>📊 Summary</h3>
            <p><strong>Total Flights:</strong> {flights.length}</p>
          </div>

          {flights.map((flight, index) => (
            <div key={index} className="flight-card">
              <div className="flight-header">
                <div className="flight-number">
                  <strong>Flight {flight.flight_number}</strong>
                  {getStatusBadge(flight.status)}
                </div>
                <div className="flight-date">{flight.flight_date}</div>
              </div>

              <div className="flight-details">
                <div className="detail-row">
                  <span className="label">✈️ Airline:</span>
                  <span className="value">{flight.airline}</span>
                </div>
                <div className="detail-row">
                  <span className="label">🛫 Departure:</span>
                  <span className="value">{flight.departure}</span>
                </div>
                <div className="detail-row">
                  <span className="label">🛬 Arrival:</span>
                  <span className="value">{flight.arrival}</span>
                </div>
                <div className="detail-row">
                  <span className="label">🛩️ Aircraft:</span>
                  <span className="value">{flight.aircraft_type} ({flight.aircraft})</span>
                </div>
              </div>

              <div className="prediction-section">
                <h4>🎯 ML Prediction</h4>
                
                <div className="prediction-summary">
                  <div className="prediction-metric">
                    <span className="metric-label">Severity Class</span>
                    <span 
                      className="metric-value severity-badge"
                      style={{ backgroundColor: getSeverityColor(flight.prediction.severity_class) }}
                    >
                      {flight.prediction.severity_class}
                    </span>
                  </div>
                  
                  <div className="prediction-metric">
                    <span className="metric-label">Risk Level</span>
                    <span 
                      className="metric-value risk-badge"
                      style={{ backgroundColor: getRiskColor(flight.prediction.risk_level) }}
                    >
                      {flight.prediction.risk_level}
                    </span>
                  </div>
                  
                  <div className="prediction-metric">
                    <span className="metric-label">Confidence</span>
                    <span className="metric-value confidence-value">
                      {(flight.prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {flight.prediction.class_probabilities && 
                 flight.prediction.class_probabilities.length > 0 && (
                  <div className="probabilities-breakdown">
                    <h5>Severity Class Probabilities</h5>
                    {flight.prediction.class_probabilities.slice(0, 5).map((prob, idx) => (
                      <div key={idx} className="probability-item">
                        <div className="probability-header">
                          <span className="probability-class">{prob.class}</span>
                          <span className="probability-value">
                            {(prob.probability * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="probability-bar-container">
                          <div 
                            className="probability-bar"
                            style={{
                              width: `${prob.probability * 100}%`,
                              backgroundColor: idx === 0 ? '#9c27b0' : 
                                             prob.class.toLowerCase().includes('fatal') ? '#e91e63' : 
                                             prob.class.toLowerCase().includes('incident') ? '#03a9f4' : 
                                             '#757575'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RealFlights;
