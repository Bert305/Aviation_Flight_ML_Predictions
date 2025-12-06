import React, { useState } from 'react';
import { apiService } from '../services/api';

function Predictions() {
  const [formData, setFormData] = useState({
    airline: '',
    aircraft_type: '',
    departure_airport: '',
    arrival_airport: '',
    weather_condition: 'VMC',
    flight_phase: 'CRUISE',
    number_of_engines: '2',
    engine_type: 'Jet'
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await apiService.makePrediction(formData);
      setPrediction(result);
    } catch (err) {
      console.error('Error making prediction:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predictions">
      <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>
        Flight Safety Predictions
      </h2>

      <div className="prediction-form">
        <h3>Enter Flight Details</h3>
        <p style={{ color: '#718096', marginBottom: '2rem' }}>
          ML models will predict safety risk and potential issues based on historical data
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Airline/Operator</label>
              <select
                name="airline"
                value={formData.airline}
                onChange={handleChange}
                required
              >
                <option value="">Select Airline</option>
                <option value="American Airlines">American Airlines</option>
                <option value="United Airlines">United Airlines</option>
                <option value="Delta Air Lines">Delta Air Lines</option>
                <option value="Southwest Airlines">Southwest Airlines</option>
                <option value="JetBlue Airways">JetBlue Airways</option>
                <option value="Alaska Airlines">Alaska Airlines</option>
                <option value="Spirit Airlines">Spirit Airlines</option>
                <option value="Frontier Airlines">Frontier Airlines</option>
                <option value="Allegiant Air">Allegiant Air</option>
                <option value="Hawaiian Airlines">Hawaiian Airlines</option>
                <option value="Private">Private</option>
                <option value="Charter">Charter</option>
                <option value="Cargo">Cargo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Aircraft Type</label>
              <select
                name="aircraft_type"
                value={formData.aircraft_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Aircraft</option>
                <optgroup label="Boeing">
                  <option value="Boeing 737">Boeing 737</option>
                  <option value="Boeing 747">Boeing 747</option>
                  <option value="Boeing 757">Boeing 757</option>
                  <option value="Boeing 767">Boeing 767</option>
                  <option value="Boeing 777">Boeing 777</option>
                  <option value="Boeing 787">Boeing 787</option>
                </optgroup>
                <optgroup label="Airbus">
                  <option value="Airbus A320">Airbus A320</option>
                  <option value="Airbus A321">Airbus A321</option>
                  <option value="Airbus A330">Airbus A330</option>
                  <option value="Airbus A350">Airbus A350</option>
                  <option value="Airbus A380">Airbus A380</option>
                </optgroup>
                <optgroup label="Regional">
                  <option value="Embraer E175">Embraer E175</option>
                  <option value="Embraer E190">Embraer E190</option>
                  <option value="Bombardier CRJ700">Bombardier CRJ700</option>
                  <option value="Bombardier CRJ900">Bombardier CRJ900</option>
                </optgroup>
                <optgroup label="General Aviation">
                  <option value="Cessna 172">Cessna 172</option>
                  <option value="Cessna 182">Cessna 182</option>
                  <option value="Piper Cherokee">Piper Cherokee</option>
                  <option value="Beechcraft Bonanza">Beechcraft Bonanza</option>
                </optgroup>
              </select>
            </div>

            <div className="form-group">
              <label>Departure Airport</label>
              <select
                name="departure_airport"
                value={formData.departure_airport}
                onChange={handleChange}
                required
              >
                <option value="">Select Airport</option>
                <optgroup label="Major US Hubs">
                  <option value="ATL">ATL - Atlanta Hartsfield-Jackson</option>
                  <option value="LAX">LAX - Los Angeles International</option>
                  <option value="ORD">ORD - Chicago O'Hare</option>
                  <option value="DFW">DFW - Dallas/Fort Worth</option>
                  <option value="DEN">DEN - Denver International</option>
                  <option value="JFK">JFK - New York JFK</option>
                  <option value="SFO">SFO - San Francisco International</option>
                  <option value="LAS">LAS - Las Vegas McCarran</option>
                  <option value="SEA">SEA - Seattle-Tacoma</option>
                  <option value="MIA">MIA - Miami International</option>
                  <option value="PHX">PHX - Phoenix Sky Harbor</option>
                  <option value="IAH">IAH - Houston George Bush</option>
                  <option value="BOS">BOS - Boston Logan</option>
                  <option value="MCO">MCO - Orlando International</option>
                  <option value="EWR">EWR - Newark Liberty</option>
                </optgroup>
                <optgroup label="International">
                  <option value="LHR">LHR - London Heathrow</option>
                  <option value="CDG">CDG - Paris Charles de Gaulle</option>
                  <option value="FRA">FRA - Frankfurt</option>
                  <option value="AMS">AMS - Amsterdam Schiphol</option>
                  <option value="NRT">NRT - Tokyo Narita</option>
                  <option value="HKG">HKG - Hong Kong</option>
                  <option value="SIN">SIN - Singapore Changi</option>
                  <option value="DXB">DXB - Dubai</option>
                </optgroup>
              </select>
            </div>

            <div className="form-group">
              <label>Arrival Airport</label>
              <select
                name="arrival_airport"
                value={formData.arrival_airport}
                onChange={handleChange}
                required
              >
                <option value="">Select Airport</option>
                <optgroup label="Major US Hubs">
                  <option value="ATL">ATL - Atlanta Hartsfield-Jackson</option>
                  <option value="LAX">LAX - Los Angeles International</option>
                  <option value="ORD">ORD - Chicago O'Hare</option>
                  <option value="DFW">DFW - Dallas/Fort Worth</option>
                  <option value="DEN">DEN - Denver International</option>
                  <option value="JFK">JFK - New York JFK</option>
                  <option value="SFO">SFO - San Francisco International</option>
                  <option value="LAS">LAS - Las Vegas McCarran</option>
                  <option value="SEA">SEA - Seattle-Tacoma</option>
                  <option value="MIA">MIA - Miami International</option>
                  <option value="PHX">PHX - Phoenix Sky Harbor</option>
                  <option value="IAH">IAH - Houston George Bush</option>
                  <option value="BOS">BOS - Boston Logan</option>
                  <option value="MCO">MCO - Orlando International</option>
                  <option value="EWR">EWR - Newark Liberty</option>
                </optgroup>
                <optgroup label="International">
                  <option value="LHR">LHR - London Heathrow</option>
                  <option value="CDG">CDG - Paris Charles de Gaulle</option>
                  <option value="FRA">FRA - Frankfurt</option>
                  <option value="AMS">AMS - Amsterdam Schiphol</option>
                  <option value="NRT">NRT - Tokyo Narita</option>
                  <option value="HKG">HKG - Hong Kong</option>
                  <option value="SIN">SIN - Singapore Changi</option>
                  <option value="DXB">DXB - Dubai</option>
                </optgroup>
              </select>
            </div>

            <div className="form-group">
              <label>Weather Condition</label>
              <select
                name="weather_condition"
                value={formData.weather_condition}
                onChange={handleChange}
              >
                <option value="VMC">VMC (Visual Meteorological)</option>
                <option value="IMC">IMC (Instrument Meteorological)</option>
                <option value="UNK">Unknown</option>
              </select>
            </div>

            <div className="form-group">
              <label>Flight Phase</label>
              <select
                name="flight_phase"
                value={formData.flight_phase}
                onChange={handleChange}
              >
                <option value="TAKEOFF">Takeoff</option>
                <option value="CLIMB">Climb</option>
                <option value="CRUISE">Cruise</option>
                <option value="DESCENT">Descent</option>
                <option value="APPROACH">Approach</option>
                <option value="LANDING">Landing</option>
                <option value="TAXI">Taxi</option>
              </select>
            </div>

            <div className="form-group">
              <label>Number of Engines</label>
              <select
                name="number_of_engines"
                value={formData.number_of_engines}
                onChange={handleChange}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div className="form-group">
              <label>Engine Type</label>
              <select
                name="engine_type"
                value={formData.engine_type}
                onChange={handleChange}
              >
                <option value="Jet">Jet</option>
                <option value="Turboprop">Turboprop</option>
                <option value="Reciprocating">Reciprocating</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: '2rem',
              padding: '1rem',
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Generate Prediction'}
          </button>
        </form>
      </div>

      {prediction && (
        <div className="prediction-result">
          <h3>🎯 Prediction Results</h3>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '1.5rem', 
            borderRadius: '8px',
            marginTop: '1rem'
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              <strong>Message:</strong> {prediction.message}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                  {prediction.prediction?.risk_score || 0}%
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Risk Score</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                  {prediction.prediction?.delay_prediction || 0} min
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Predicted Delay</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                  {prediction.prediction?.confidence || 0}%
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Confidence</div>
              </div>
            </div>

            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px'
            }}>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                ℹ️ <strong>Note:</strong> ML models are currently in development. 
                This is a placeholder response. Train models using the backend's 
                train_models.py script to enable real predictions.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="chart-container" style={{ marginTop: '2rem' }}>
        <h3>About the ML Models</h3>
        <div style={{ padding: '1rem' }}>
          <h4>Linear Regression Model</h4>
          <p>Predicts continuous values like delay duration and severity scores based on historical patterns.</p>
          
          <h4 style={{ marginTop: '1.5rem' }}>Random Forest Classifier</h4>
          <p>Classifies accident severity levels (Fatal, Serious, Minor, None) using ensemble learning.</p>
          
          <h4 style={{ marginTop: '1.5rem' }}>Random Forest Regressor</h4>
          <p>Predicts numerical safety scores and risk metrics with high accuracy.</p>
          
          <p style={{ marginTop: '1.5rem', fontStyle: 'italic', color: '#718096' }}>
            To train the models, run: <code>python train_models.py</code> in the backend directory
          </p>
        </div>
      </div>
    </div>
  );
}

export default Predictions;
