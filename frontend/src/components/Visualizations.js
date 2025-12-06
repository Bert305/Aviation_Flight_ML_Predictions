import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

function Visualizations() {
  const [yearlyData, setYearlyData] = useState([]);
  const [airlineData, setAirlineData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [modelPerformance, setModelPerformance] = useState(null);
  const [targetDistributions, setTargetDistributions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisualizationData();
  }, []);

  const fetchVisualizationData = async () => {
    try {
      setLoading(true);
      const [yearly, airline, location, severity, performance, targets] = await Promise.all([
        apiService.getAccidentsByYear(),
        apiService.getAccidentsByAirline(),
        apiService.getAccidentsByLocation(),
        apiService.getSeverityDistribution(),
        apiService.getModelPerformance(),
        apiService.getTargetDistributions()
      ]);
      
      console.log('Yearly data:', yearly);
      console.log('Airline data:', airline);
      console.log('Location data:', location);
      console.log('Severity data:', severity);
      console.log('Model performance:', performance);
      console.log('Target distributions:', targets);
      
      setYearlyData(Array.isArray(yearly) ? yearly.slice(-10) : []); // Last 10 years
      setAirlineData(Array.isArray(airline) ? airline : []);
      setLocationData(Array.isArray(location) ? location : []);
      setSeverityData(Array.isArray(severity) ? severity : []);
      setModelPerformance(performance);
      setTargetDistributions(targets);
    } catch (err) {
      console.error('Error fetching visualization data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading visualizations...</div>;
  }

  const maxYearlyAccidents = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.total_accidents || 0)) : 1;
  const maxAirlineAccidents = airlineData.length > 0 ? Math.max(...airlineData.map(d => d.total_accidents || 0)) : 1;
  const maxLocationAccidents = locationData.length > 0 ? Math.max(...locationData.map(d => d.total_accidents || 0)) : 1;
  const totalSeverityCounts = severityData.length > 0 ? severityData.reduce((sum, d) => sum + (d.count || 0), 0) : 1;

  return (
    <div className="visualizations">
      <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>
        Data Visualizations
      </h2>

      {/* Yearly Trend */}
      <div className="chart-container">
        <h2>Accidents Over Time (Last 10 Years)</h2>
        <div style={{ padding: '2rem' }}>
          {yearlyData.length === 0 ? (
            <p style={{ color: '#718096' }}>No data available</p>
          ) : (
            yearlyData.map((year) => (
              <div key={year.year} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ minWidth: '80px', fontWeight: 'bold' }}>{year.year}</span>
                  <div style={{ 
                    flex: 1, 
                    background: '#e2e8f0', 
                    borderRadius: '4px',
                    height: '30px',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${((year.total_accidents || 0) / maxYearlyAccidents) * 100}%`,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      height: '100%',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{ minWidth: '100px', textAlign: 'right', marginLeft: '1rem' }}>
                    {year.total_accidents || 0} accidents
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Airlines/Manufacturers */}
      <div className="chart-container">
        <h2>Top 10 Aircraft Manufacturers by Accident Count</h2>
        <div style={{ padding: '2rem' }}>
          {airlineData.length === 0 ? (
            <p style={{ color: '#718096' }}>No data available</p>
          ) : (
            airlineData.slice(0, 10).map((airline, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ minWidth: '150px', fontWeight: 'bold' }}>{airline.make}</span>
                  <div style={{ 
                    flex: 1, 
                    background: '#e2e8f0', 
                    borderRadius: '4px',
                    height: '30px',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${((airline.total_accidents || 0) / maxAirlineAccidents) * 100}%`,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      height: '100%',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{ minWidth: '120px', textAlign: 'right', marginLeft: '1rem' }}>
                    {airline.total_accidents || 0} accidents
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Locations */}
      <div className="chart-container">
        <h2>Top 10 Countries by Accident Count</h2>
        <div style={{ padding: '2rem' }}>
          {locationData.length === 0 ? (
            <p style={{ color: '#718096' }}>No data available</p>
          ) : (
            locationData.slice(0, 10).map((location, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ minWidth: '150px', fontWeight: 'bold' }}>{location.country}</span>
                  <div style={{ 
                    flex: 1, 
                    background: '#e2e8f0', 
                    borderRadius: '4px',
                    height: '30px',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${((location.total_accidents || 0) / maxLocationAccidents) * 100}%`,
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      height: '100%',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{ minWidth: '120px', textAlign: 'right', marginLeft: '1rem' }}>
                    {location.total_accidents || 0} accidents
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="chart-container">
        <h2>Accident Severity Distribution</h2>
        <div style={{ padding: '2rem' }}>
          {severityData.length === 0 ? (
            <p style={{ color: '#718096' }}>No data available</p>
          ) : (
            severityData.map((severity, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ minWidth: '150px', fontWeight: 'bold' }}>{severity.severity}</span>
                  <div style={{ 
                    flex: 1, 
                    background: '#e2e8f0', 
                    borderRadius: '4px',
                    height: '30px',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${((severity.count || 0) / totalSeverityCounts) * 100}%`,
                      background: severity.severity.includes('Fatal') 
                        ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                        : 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                      height: '100%',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{ minWidth: '120px', textAlign: 'right', marginLeft: '1rem' }}>
                    {severity.count || 0} ({(((severity.count || 0) / totalSeverityCounts) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ML Model Performance */}
      {modelPerformance && (
        <>
          <div className="chart-container">
            <h2>🤖 Machine Learning Model Performance</h2>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Random Forest Classifier */}
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '8px' }}>
                  <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>Random Forest Classifier</h3>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#cbd5e0' }}>
                    Predicts accident severity categories (Fatal, Non-Fatal, Incident)
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1.5rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>
                        {(modelPerformance.classifier?.accuracy * 100).toFixed(1)}%
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Accuracy</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f093fb' }}>
                        {modelPerformance.classifier?.features || 8}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Features</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4facfe' }}>
                        {(modelPerformance.classifier?.samples_trained || 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Training Samples</div>
                    </div>
                  </div>
                </div>

                {/* Regression Models */}
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '8px' }}>
                  <h3 style={{ marginBottom: '1rem', color: '#f093fb' }}>Regression Models Comparison</h3>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#cbd5e0' }}>
                    Predicts severity score (lower RMSE = better accuracy)
                  </p>
                  <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 'bold' }}>Linear Regression</span>
                        <span style={{ color: '#fa709a' }}>RMSE: {modelPerformance.regressor?.linear_rmse?.toFixed(2)}</span>
                      </div>
                      <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '30px' }}>
                        <div style={{
                          width: `${100 - (modelPerformance.regressor?.linear_rmse * 10)}%`,
                          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                          height: '100%',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 'bold' }}>Random Forest Regressor</span>
                        <span style={{ color: '#30cfd0' }}>RMSE: {modelPerformance.regressor?.random_forest_rmse?.toFixed(2)}</span>
                      </div>
                      <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '30px' }}>
                        <div style={{
                          width: `${100 - (modelPerformance.regressor?.random_forest_rmse * 10)}%`,
                          background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                          height: '100%',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Importance */}
          <div className="chart-container">
            <h2>Feature Importance (What Factors Matter Most)</h2>
            <div style={{ padding: '2rem' }}>
              <p style={{ color: '#cbd5e0', marginBottom: '1.5rem' }}>
                These features have the biggest impact on accident severity predictions
              </p>
              {Object.entries(modelPerformance.feature_importance || {})
                .sort((a, b) => b[1] - a[1])
                .map(([feature, importance], index) => (
                  <div key={index} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ minWidth: '200px', fontWeight: 'bold' }}>{feature}</span>
                      <div style={{ 
                        flex: 1, 
                        background: '#e2e8f0', 
                        borderRadius: '4px',
                        height: '30px',
                        position: 'relative'
                      }}>
                        <div style={{
                          width: `${importance * 100}%`,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          height: '100%',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                      <span style={{ minWidth: '100px', textAlign: 'right', marginLeft: '1rem' }}>
                        {(importance * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Target Variable Distributions */}
      {targetDistributions && (
        <>
          <div className="chart-container">
            <h2>🎯 Target Variables - What the Model Predicts</h2>
            <div style={{ padding: '2rem' }}>
              <p style={{ color: '#cbd5e0', marginBottom: '2rem' }}>
                These are the target variables (y values) that our ML models are trained to predict
              </p>
              
              {/* Injury Severity Categories - Classifier Target */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>
                  Injury Severity Categories (Classification Target)
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#cbd5e0' }}>
                  Random Forest Classifier predicts one of these categories
                </p>
                {targetDistributions.injury_severity && targetDistributions.injury_severity.length > 0 ? (
                  targetDistributions.injury_severity.map((item, index) => {
                    const total = targetDistributions.injury_severity.reduce((sum, i) => sum + (i.count || 0), 0);
                    const percentage = ((item.count / total) * 100).toFixed(1);
                    return (
                      <div key={index} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ minWidth: '150px', fontWeight: 'bold' }}>{item.severity}</span>
                          <div style={{ 
                            flex: 1, 
                            background: '#e2e8f0', 
                            borderRadius: '4px',
                            height: '30px',
                            position: 'relative'
                          }}>
                            <div style={{
                              width: `${percentage}%`,
                              background: item.severity.includes('Fatal') 
                                ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                                : item.severity.includes('Incident')
                                ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              height: '100%',
                              borderRadius: '4px',
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                          <span style={{ minWidth: '150px', textAlign: 'right', marginLeft: '1rem' }}>
                            {(item.count || 0).toLocaleString()} ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: '#718096' }}>No data available</p>
                )}
              </div>

              {/* Severity Score Ranges - Regressor Target */}
              <div>
                <h3 style={{ marginBottom: '1rem', color: '#f093fb' }}>
                  Severity Score Ranges (Regression Target)
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#cbd5e0' }}>
                  Linear Regression and Random Forest Regressor predict numeric severity scores
                  <br />
                  <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    Score = (Fatal × 3) + (Serious × 2) + (Minor × 1)
                  </span>
                </p>
                {targetDistributions.severity_scores && targetDistributions.severity_scores.length > 0 ? (
                  targetDistributions.severity_scores.map((item, index) => {
                    const total = targetDistributions.severity_scores.reduce((sum, i) => sum + (i.count || 0), 0);
                    const percentage = ((item.count / total) * 100).toFixed(1);
                    return (
                      <div key={index} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ minWidth: '180px', fontWeight: 'bold' }}>{item.range}</span>
                          <div style={{ 
                            flex: 1, 
                            background: '#e2e8f0', 
                            borderRadius: '4px',
                            height: '30px',
                            position: 'relative'
                          }}>
                            <div style={{
                              width: `${percentage}%`,
                              background: index === 0 
                                ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                                : index <= 2
                                ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                                : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                              height: '100%',
                              borderRadius: '4px',
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                          <span style={{ minWidth: '150px', textAlign: 'right', marginLeft: '1rem' }}>
                            {(item.count || 0).toLocaleString()} ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: '#718096' }}>No data available</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Visualizations;
