import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, yearlyAccidents] = await Promise.all([
        apiService.getStats(),
        apiService.getAccidentsByYear()
      ]);
      setStats(statsData);
      setYearlyData(yearlyAccidents);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Make sure the backend server is running on port 5000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!stats) {
    return <div className="loading">No data available</div>;
  }

  const recentYears = Array.isArray(yearlyData) ? yearlyData.slice(-5) : [];
  const totalAccidents = Array.isArray(yearlyData) ? yearlyData.reduce((sum, year) => sum + year.total_accidents, 0) : 0;
  const totalFatalities = Array.isArray(yearlyData) ? yearlyData.reduce((sum, year) => sum + year.fatal_injuries, 0) : 0;

  return (
    <div className="dashboard">
      <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>
        Aviation Safety Dashboard
      </h2>

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Total Accident Records</h3>
          <div className="value">{stats?.airline_accidents?.total_records?.toLocaleString() || '0'}</div>
          <div className="label">Airline Accidents Database</div>
        </div>

        <div className="stat-card">
          <h3>NTSB Records</h3>
          <div className="value">{stats?.ntsb_data?.total_records?.toLocaleString() || '0'}</div>
          <div className="label">NTSB Aviation Data</div>
        </div>

        <div className="stat-card">
          <h3>Total Accidents</h3>
          <div className="value">{totalAccidents.toLocaleString()}</div>
          <div className="label">All Time</div>
        </div>

        <div className="stat-card">
          <h3>Total Fatalities</h3>
          <div className="value">{totalFatalities.toLocaleString()}</div>
          <div className="label">All Time</div>
        </div>
      </div>

      <div className="chart-container">
        <h2>Recent Years Overview (Last 5 Years)</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Total Accidents</th>
                <th>Fatal Injuries</th>
                <th>Serious Injuries</th>
                <th>Minor Injuries</th>
              </tr>
            </thead>
            <tbody>
              {recentYears.map((year) => (
                <tr key={year.year}>
                  <td><strong>{year.year}</strong></td>
                  <td>{year.total_accidents}</td>
                  <td>{year.fatal_injuries}</td>
                  <td>{year.serious_injuries}</td>
                  <td>{year.minor_injuries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-container">
        <h2>Data Coverage</h2>
        <div style={{ padding: '1rem' }}>
          <p><strong>Airline Accidents Database:</strong></p>
          <p>Date Range: {stats?.airline_accidents?.date_range?.start || 'N/A'} to {stats?.airline_accidents?.date_range?.end || 'N/A'}</p>
          <p>Total Fatal Injuries: {stats?.airline_accidents?.total_fatal_injuries?.toLocaleString() || '0'}</p>
          
          <p style={{ marginTop: '1.5rem' }}><strong>NTSB Database:</strong></p>
          <p>Date Range: {stats?.ntsb_data?.date_range?.start || 'N/A'} to {stats?.ntsb_data?.date_range?.end || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
