import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

function AccidentExplorer() {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    limit: 50,
    offset: 0,
    country: '',
    severity: '',
    year: ''
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAccidents();
  }, []);

  const fetchAccidents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAccidents(filters);
      setAccidents(data.data);
      setTotal(data.total);
    } catch (err) {
      console.error('Error fetching accidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    setFilters({ ...filters, offset: 0 });
    fetchAccidents();
  };

  const handleNextPage = () => {
    setFilters({ ...filters, offset: filters.offset + filters.limit });
    fetchAccidents();
  };

  const handlePrevPage = () => {
    setFilters({ ...filters, offset: Math.max(0, filters.offset - filters.limit) });
    fetchAccidents();
  };

  const currentPage = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = Math.ceil(total / filters.limit);

  return (
    <div className="accident-explorer">
      <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>
        Accident Explorer
      </h2>

      <div className="filters">
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={filters.country}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="severity"
          placeholder="Severity (Fatal, Non-Fatal)"
          value={filters.severity}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={filters.year}
          onChange={handleFilterChange}
        />
        <select
          name="limit"
          value={filters.limit}
          onChange={handleFilterChange}
        >
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <div className="loading">Loading accidents...</div>
      ) : (
        <>
          <div className="table-container">
            <h3>Found {total?.toLocaleString() || 0} accidents</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Country</th>
                  <th>Aircraft</th>
                  <th>Severity</th>
                  <th>Fatalities</th>
                  <th>Phase</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(accidents) && accidents.map((accident, index) => (
                  <tr key={index}>
                    <td>{accident['Event Date']}</td>
                    <td>{accident['Location']}</td>
                    <td>{accident['Country']}</td>
                    <td>{accident['Make']} {accident['Model']}</td>
                    <td>{accident['Injury Severity']}</td>
                    <td>{accident['Total Fatal Injuries'] || 0}</td>
                    <td>{accident['Broad Phase of Flight']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button onClick={handlePrevPage} disabled={filters.offset === 0}>
              Previous
            </button>
            <span style={{ color: 'white', padding: '0.5rem 1rem' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={filters.offset + filters.limit >= total}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AccidentExplorer;
