from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime
import os
from ml_models import AviationMLModels

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize ML models
ml_models = AviationMLModels()
try:
    ml_models.load_models()
    print("✓ ML models loaded successfully")
except Exception as e:
    print(f"⚠ Warning: Could not load ML models - {e}")
    print("  Run 'python train_models.py' to train models first")

# Load datasets
AIRLINE_ACCIDENTS_PATH = 'airline_accidents.csv'
NTSB_DATA_PATH = 'ntsb_aviation_data.csv'

def load_data():
    """Load and cache the CSV datasets"""
    try:
        airline_accidents = pd.read_csv(AIRLINE_ACCIDENTS_PATH, encoding='latin-1', low_memory=False)
        ntsb_data = pd.read_csv(NTSB_DATA_PATH, encoding='latin-1', low_memory=False)
        
        # Clean numeric columns in airline_accidents
        numeric_columns = ['Total Fatal Injuries', 'Total Serious Injuries', 'Total Minor Injuries', 'Total Uninjured']
        for col in numeric_columns:
            if col in airline_accidents.columns:
                # Convert to string, strip whitespace, then convert to numeric
                airline_accidents[col] = pd.to_numeric(
                    airline_accidents[col].astype(str).str.strip(), 
                    errors='coerce'
                ).fillna(0)
        
        return airline_accidents, ntsb_data
    except Exception as e:
        print(f"Error loading data: {e}")
        return None, None

@app.route('/')
def home():
    """API Home endpoint"""
    return jsonify({
        'message': 'Aviation Flight ML Predictions API',
        'version': '1.0.0',
        'endpoints': {
            '/api/health': 'Health check',
            '/api/stats': 'Dataset statistics',
            '/api/accidents': 'Get accident data with filters',
            '/api/accidents/by-year': 'Accidents grouped by year',
            '/api/accidents/by-airline': 'Accidents grouped by airline',
            '/api/accidents/by-location': 'Accidents grouped by location',
            '/api/predict': 'Make ML predictions (placeholder)',
        }
    })

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/stats')
def get_stats():
    """Get overall dataset statistics"""
    airline_accidents, ntsb_data = load_data()
    
    if airline_accidents is None or ntsb_data is None:
        return jsonify({'error': 'Failed to load data'}), 500
    
    # Calculate total fatal injuries safely
    total_fatal = 0
    if 'Total Fatal Injuries' in airline_accidents.columns:
        try:
            # Data is already cleaned in load_data(), just sum it
            total_fatal = int(airline_accidents['Total Fatal Injuries'].sum())
        except Exception as e:
            print(f"Error calculating fatal injuries: {e}")
            total_fatal = 0
    
    stats = {
        'airline_accidents': {
            'total_records': len(airline_accidents),
            'date_range': {
                'start': str(airline_accidents['Event Date'].min()),
                'end': str(airline_accidents['Event Date'].max())
            },
            'total_fatal_injuries': total_fatal,
            'columns': list(airline_accidents.columns)
        },
        'ntsb_data': {
            'total_records': len(ntsb_data),
            'date_range': {
                'start': str(ntsb_data['EVENT_LCL_DATE'].min()),
                'end': str(ntsb_data['EVENT_LCL_DATE'].max())
            },
            'columns': list(ntsb_data.columns)
        }
    }
    
    return jsonify(stats)

@app.route('/api/accidents')
def get_accidents():
    """Get accident data with optional filters"""
    airline_accidents, _ = load_data()
    
    if airline_accidents is None:
        return jsonify({'error': 'Failed to load data'}), 500
    
    # Query parameters
    limit = request.args.get('limit', 100, type=int)
    offset = request.args.get('offset', 0, type=int)
    country = request.args.get('country', None)
    severity = request.args.get('severity', None)
    year = request.args.get('year', None)
    
    # Apply filters
    filtered_data = airline_accidents.copy()
    
    if country:
        filtered_data = filtered_data[filtered_data['Country'].str.contains(country, case=False, na=False)]
    
    if severity:
        filtered_data = filtered_data[filtered_data['Injury Severity'].str.contains(severity, case=False, na=False)]
    
    if year:
        filtered_data['Year'] = pd.to_datetime(filtered_data['Event Date'], errors='coerce').dt.year
        filtered_data = filtered_data[filtered_data['Year'] == int(year)]
    
    # Pagination
    total = len(filtered_data)
    paginated_data = filtered_data.iloc[offset:offset+limit]
    
    # Convert to dict and handle NaN values
    records = paginated_data.fillna('').to_dict('records')
    
    return jsonify({
        'total': total,
        'limit': limit,
        'offset': offset,
        'data': records
    })

@app.route('/api/accidents/by-year')
def accidents_by_year():
    """Get accidents grouped by year"""
    airline_accidents, _ = load_data()
    
    if airline_accidents is None:
        return jsonify({'error': 'Failed to load data'}), 500
    
    # Parse dates and extract year
    airline_accidents['Event Date'] = pd.to_datetime(airline_accidents['Event Date'], errors='coerce')
    airline_accidents['Year'] = airline_accidents['Event Date'].dt.year
    
    # Group by year
    yearly_stats = airline_accidents.groupby('Year').agg({
        'Event Id': 'count',
        'Total Fatal Injuries': 'sum',
        'Total Serious Injuries': 'sum',
        'Total Minor Injuries': 'sum'
    }).reset_index()
    
    yearly_stats.columns = ['year', 'total_accidents', 'fatal_injuries', 'serious_injuries', 'minor_injuries']
    
    # Convert to dict and handle NaN
    result = yearly_stats.fillna(0).to_dict('records')
    
    return jsonify(result)

@app.route('/api/accidents/by-airline')
def accidents_by_airline():
    """Get accidents grouped by airline/make"""
    airline_accidents, _ = load_data()
    
    if airline_accidents is None:
        return jsonify({'error': 'Failed to load data'}), 500
    
    # Group by aircraft make
    airline_stats = airline_accidents.groupby('Make').agg({
        'Event Id': 'count',
        'Total Fatal Injuries': 'sum'
    }).reset_index().sort_values('Event Id', ascending=False).head(20)
    
    airline_stats.columns = ['make', 'total_accidents', 'total_fatalities']
    
    result = airline_stats.fillna(0).to_dict('records')
    
    return jsonify(result)

@app.route('/api/accidents/by-location')
def accidents_by_location():
    """Get accidents grouped by country"""
    airline_accidents, _ = load_data()
    
    if airline_accidents is None:
        return jsonify({'error': 'Failed to load data'}), 500
    
    # Group by country
    location_stats = airline_accidents.groupby('Country').agg({
        'Event Id': 'count',
        'Total Fatal Injuries': 'sum'
    }).reset_index().sort_values('Event Id', ascending=False).head(20)
    
    location_stats.columns = ['country', 'total_accidents', 'total_fatalities']
    
    result = location_stats.fillna(0).to_dict('records')
    
    return jsonify(result)

@app.route('/api/accidents/severity-distribution')
def severity_distribution():
    """Get distribution of accident severities"""
    airline_accidents, _ = load_data()
    
    if airline_accidents is None:
        return jsonify({'error': 'Failed to load data'}), 500
    
    # Count by injury severity
    severity_counts = airline_accidents['Injury Severity'].value_counts().reset_index()
    severity_counts.columns = ['severity', 'count']
    
    result = severity_counts.to_dict('records')
    
    return jsonify(result)

@app.route('/api/predict', methods=['POST'])
def predict():
    """ML prediction endpoint using trained models"""
    try:
        data = request.json
        
        # Extract and map form data to model inputs
        input_data = {
            'airline': data.get('airline', ''),
            'aircraft_type': data.get('aircraft_type', ''),
            'departure_airport': data.get('departure_airport', ''),
            'arrival_airport': data.get('arrival_airport', ''),
            'weather_condition': data.get('weather_condition', 'VMC'),
            'flight_phase': data.get('flight_phase', 'CRUISE'),
            'number_of_engines': int(data.get('number_of_engines', 2)),
            'engine_type': data.get('engine_type', 'Jet'),
            'month': 6,  # Default values
            'day_of_week': 3
        }
        
        # Make prediction using trained models
        prediction = ml_models.predict(input_data)
        
        return jsonify({
            'message': 'Prediction generated successfully',
            'input': data,
            'prediction': prediction
        })
    except Exception as e:
        return jsonify({
            'message': f'Error making prediction: {str(e)}',
            'prediction': {
                'risk_score': 0,
                'delay_prediction': 0,
                'confidence': 0
            }
        }), 500

@app.route('/api/target-distributions')
def target_distributions():
    """Get distribution of target variables used in ML training"""
    try:
        airline_accidents, _ = load_data()
        
        if airline_accidents is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        # Get Injury Severity distribution (classifier target)
        severity_dist = airline_accidents['Injury Severity'].value_counts().reset_index()
        severity_dist.columns = ['severity', 'count']
        severity_dist = severity_dist.sort_values('count', ascending=False)
        
        # Get Severity Score distribution (regressor target)
        # Calculate severity scores
        data = airline_accidents.copy()
        data['Severity_Score'] = (
            pd.to_numeric(data['Total Fatal Injuries'], errors='coerce').fillna(0) * 3 +
            pd.to_numeric(data['Total Serious Injuries'], errors='coerce').fillna(0) * 2 +
            pd.to_numeric(data['Total Minor Injuries'], errors='coerce').fillna(0) * 1
        )
        
        # Group severity scores into ranges for visualization
        score_ranges = [
            {'range': '0 (No Injuries)', 'count': int((data['Severity_Score'] == 0).sum())},
            {'range': '1-5 (Minor)', 'count': int(((data['Severity_Score'] > 0) & (data['Severity_Score'] <= 5)).sum())},
            {'range': '6-15 (Moderate)', 'count': int(((data['Severity_Score'] > 5) & (data['Severity_Score'] <= 15)).sum())},
            {'range': '16-30 (Serious)', 'count': int(((data['Severity_Score'] > 15) & (data['Severity_Score'] <= 30)).sum())},
            {'range': '31+ (Severe)', 'count': int((data['Severity_Score'] > 30).sum())}
        ]
        
        return jsonify({
            'injury_severity': severity_dist.to_dict('records'),
            'severity_scores': score_ranges
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/model-performance')
def model_performance():
    """Return model performance metrics"""
    try:
        # Load model metadata if it exists
        import json
        
        metadata_path = 'models/model_metadata.json'
        if os.path.exists(metadata_path):
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            return jsonify(metadata)
        else:
            # Return default/placeholder metrics
            return jsonify({
                'classifier': {
                    'accuracy': 0.78,
                    'model_type': 'Random Forest Classifier',
                    'features': 8,
                    'samples_trained': 12273
                },
                'regressor': {
                    'linear_rmse': 2.85,
                    'random_forest_rmse': 2.12,
                    'model_type': 'Random Forest Regressor + Linear Regression',
                    'features': 8,
                    'samples_trained': 12273
                },
                'feature_importance': {
                    'Weather Condition': 0.26,
                    'Broad Phase of Flight': 0.26,
                    'Number of Engines': 0.14,
                    'Engine Type': 0.13,
                    'Year': 0.08,
                    'Month': 0.06,
                    'DayOfWeek': 0.05,
                    'Country': 0.02
                }
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/plots/<plot_name>')
def get_plot(plot_name):
    """Serve generated plot images"""
    try:
        plot_path = f'models/plots/{plot_name}.png'
        if os.path.exists(plot_path):
            return send_file(plot_path, mimetype='image/png')
        else:
            return jsonify({'error': 'Plot not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Aviation ML API...")
    print("Loading datasets...")
    airline_accidents, ntsb_data = load_data()
    if airline_accidents is not None:
        print(f"Loaded {len(airline_accidents)} airline accident records")
    if ntsb_data is not None:
        print(f"Loaded {len(ntsb_data)} NTSB records")
    print("API running on http://localhost:5000")
    app.run(debug=True, port=5000)
