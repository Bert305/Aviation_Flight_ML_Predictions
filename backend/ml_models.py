"""
Machine Learning Models for Aviation Safety Prediction
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import mean_squared_error, accuracy_score, classification_report
import pickle
import os


class AviationMLModels:
    """Class to handle ML model training and predictions"""
    
    def __init__(self):
        self.linear_model = None
        self.random_forest_classifier = None
        self.random_forest_regressor = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        
    def preprocess_data(self, df):
        """
        Preprocess the aviation data for ML models
        """
        # Create a copy to avoid modifying original
        data = df.copy()
        
        # Extract temporal features
        if 'Event Date' in data.columns:
            data['Event Date'] = pd.to_datetime(data['Event Date'], errors='coerce')
            data['Year'] = data['Event Date'].dt.year
            data['Month'] = data['Event Date'].dt.month
            data['DayOfWeek'] = data['Event Date'].dt.dayofweek
            data['Quarter'] = data['Event Date'].dt.quarter
        
        # Handle categorical variables
        categorical_columns = ['Country', 'Weather Condition', 'Broad Phase of Flight', 
                               'Aircraft Category', 'Engine Type', 'FAR Description']
        
        for col in categorical_columns:
            if col in data.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    data[f'{col}_encoded'] = self.label_encoders[col].fit_transform(
                        data[col].fillna('Unknown').astype(str)
                    )
                else:
                    data[f'{col}_encoded'] = self.label_encoders[col].transform(
                        data[col].fillna('Unknown').astype(str)
                    )
        
        # Create binary features
        if 'Amateur Built' in data.columns:
            data['Is_Amateur_Built'] = (data['Amateur Built'] == 'Yes').astype(int)
        
        # Create injury severity score
        if all(col in data.columns for col in ['Total Fatal Injuries', 'Total Serious Injuries', 'Total Minor Injuries']):
            # Convert injury columns to numeric, handling any string values
            data['Total Fatal Injuries'] = pd.to_numeric(data['Total Fatal Injuries'], errors='coerce')
            data['Total Serious Injuries'] = pd.to_numeric(data['Total Serious Injuries'], errors='coerce')
            data['Total Minor Injuries'] = pd.to_numeric(data['Total Minor Injuries'], errors='coerce')
            
            data['Severity_Score'] = (
                data['Total Fatal Injuries'].fillna(0) * 3 +
                data['Total Serious Injuries'].fillna(0) * 2 +
                data['Total Minor Injuries'].fillna(0) * 1
            )
        
        return data
    
    def train_severity_classifier(self, df):
        """
        Train Random Forest classifier to predict accident severity
        """
        print("Training severity classification model...")
        
        # Preprocess data
        data = self.preprocess_data(df)
        
        # Define features
        feature_columns = ['Year', 'Month', 'DayOfWeek', 'Number of Engines']
        
        # Add encoded categorical features
        for col in ['Country_encoded', 'Weather Condition_encoded', 
                    'Broad Phase of Flight_encoded', 'Engine Type_encoded']:
            if col in data.columns:
                feature_columns.append(col)
        
        # Filter valid data - keep only rows with all required features
        data = data.dropna(subset=feature_columns + ['Injury Severity'])
        
        # Ensure Number of Engines is numeric
        data['Number of Engines'] = pd.to_numeric(data['Number of Engines'], errors='coerce')
        data = data.dropna(subset=['Number of Engines'])
        
        if len(data) < 100:
            print("Insufficient data for training")
            return None
        
        # Prepare X and y - convert to numeric array
        X = data[feature_columns].astype(float).values
        y = data['Injury Severity'].values
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        self.random_forest_classifier = RandomForestClassifier(
            n_estimators=100, 
            max_depth=10,
            random_state=42
        )
        self.random_forest_classifier.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.random_forest_classifier.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Classification Model Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        return {
            'accuracy': accuracy,
            'feature_importance': dict(zip(feature_columns, 
                                          self.random_forest_classifier.feature_importances_))
        }
    
    def train_severity_regressor(self, df):
        """
        Train models to predict severity score (regression)
        """
        print("Training severity regression models...")
        
        # Preprocess data
        data = self.preprocess_data(df)
        
        # Define features
        feature_columns = ['Year', 'Month', 'DayOfWeek', 'Number of Engines']
        
        # Add encoded categorical features
        for col in ['Country_encoded', 'Weather Condition_encoded', 
                    'Broad Phase of Flight_encoded', 'Engine Type_encoded']:
            if col in data.columns:
                feature_columns.append(col)
        
        # Filter valid data - keep Injury Severity for grouping later
        data = data.dropna(subset=feature_columns + ['Severity_Score', 'Injury Severity'])
        
        # Ensure Number of Engines is numeric
        data['Number of Engines'] = pd.to_numeric(data['Number of Engines'], errors='coerce')
        data = data.dropna(subset=['Number of Engines'])
        
        # Ensure Severity_Score is numeric
        data['Severity_Score'] = pd.to_numeric(data['Severity_Score'], errors='coerce')
        data = data.dropna(subset=['Severity_Score'])
        
        if len(data) < 100:
            print("Insufficient data for training")
            return None
        
        # Prepare X and y - convert to numeric array
        X = data[feature_columns].astype(float).values
        y = data['Severity_Score'].astype(float).values
        severity_labels = data['Injury Severity'].values  # Keep severity labels
        
        # Split data
        X_train, X_test, y_train, y_test, _, severity_test = train_test_split(
            X, y, severity_labels, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Linear Regression
        self.linear_model = LinearRegression()
        self.linear_model.fit(X_train_scaled, y_train)
        y_pred_linear = self.linear_model.predict(X_test_scaled)
        rmse_linear = np.sqrt(mean_squared_error(y_test, y_pred_linear))
        
        # Train Random Forest Regressor
        self.random_forest_regressor = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.random_forest_regressor.fit(X_train, y_train)
        y_pred_rf = self.random_forest_regressor.predict(X_test)
        rmse_rf = np.sqrt(mean_squared_error(y_test, y_pred_rf))
        
        print(f"Linear Regression RMSE: {rmse_linear:.4f}")
        print(f"Random Forest RMSE: {rmse_rf:.4f}")
        
        # Get feature names for interpretation
        feature_names = feature_columns
        
        return {
            'linear_regression_rmse': rmse_linear,
            'random_forest_rmse': rmse_rf,
            'feature_importance': dict(zip(feature_columns, 
                                          self.random_forest_regressor.feature_importances_)),
            'X_test': X_test,
            'y_test': y_test,
            'y_pred_linear': y_pred_linear,
            'y_pred_rf': y_pred_rf,
            'feature_names': feature_names,
            'severity_test': severity_test  # Add severity labels for test data
        }
    
    def predict(self, input_data):
        """
        Make predictions on new data
        input_data should be a dict with keys matching training features
        """
        if not self.random_forest_classifier or not self.random_forest_regressor:
            return {
                'severity_class': 'Unknown',
                'severity_score': 0.0,
                'risk_level': 'Unknown',
                'confidence': 0.0,
                'error': 'Models not loaded'
            }
        
        try:
            # Create feature array from input_data
            # Map form fields to model features
            features = [
                2024,  # Year - default to current year
                input_data.get('month', 6),  # Month
                input_data.get('day_of_week', 3),  # Day of week (0-6)
                input_data.get('number_of_engines', 2)  # Number of engines
            ]
            
            # Add encoded categorical features with defaults
            # These would normally come from label encoders
            features.extend([0, 0, 0, 0])  # Placeholder encoded features
            
            # Convert to numpy array
            X = np.array([features])
            
            # Make predictions
            severity_class = self.random_forest_classifier.predict(X)[0]
            severity_proba = self.random_forest_classifier.predict_proba(X)[0]
            confidence = float(np.max(severity_proba) * 100)
            
            # Predict severity score
            severity_score = float(self.random_forest_regressor.predict(X)[0])
            
            # Determine risk level based on severity score
            if severity_score > 10:
                risk_level = 'High'
            elif severity_score > 5:
                risk_level = 'Medium'
            else:
                risk_level = 'Low'
            
            # Calculate risk score percentage (0-100)
            risk_score = min(100, int(severity_score * 10))
            
            # Estimate delay (simple heuristic)
            delay_prediction = int(severity_score * 5)
            
            return {
                'severity_class': str(severity_class),
                'severity_score': round(severity_score, 2),
                'risk_level': risk_level,
                'risk_score': risk_score,
                'delay_prediction': delay_prediction,
                'confidence': round(confidence, 2)
            }
        except Exception as e:
            return {
                'severity_class': 'Error',
                'severity_score': 0.0,
                'risk_level': 'Unknown',
                'risk_score': 0,
                'delay_prediction': 0,
                'confidence': 0.0,
                'error': str(e)
            }
    
    def save_models(self, directory='models'):
        """Save trained models to disk"""
        os.makedirs(directory, exist_ok=True)
        
        if self.linear_model:
            with open(f'{directory}/linear_model.pkl', 'wb') as f:
                pickle.dump(self.linear_model, f)
        
        if self.random_forest_classifier:
            with open(f'{directory}/rf_classifier.pkl', 'wb') as f:
                pickle.dump(self.random_forest_classifier, f)
        
        if self.random_forest_regressor:
            with open(f'{directory}/rf_regressor.pkl', 'wb') as f:
                pickle.dump(self.random_forest_regressor, f)
        
        with open(f'{directory}/scaler.pkl', 'wb') as f:
            pickle.dump(self.scaler, f)
        
        print(f"Models saved to {directory}/")
    
    def load_models(self, directory='models'):
        """Load trained models from disk"""
        try:
            with open(f'{directory}/linear_model.pkl', 'rb') as f:
                self.linear_model = pickle.load(f)
            
            with open(f'{directory}/rf_classifier.pkl', 'rb') as f:
                self.random_forest_classifier = pickle.load(f)
            
            with open(f'{directory}/rf_regressor.pkl', 'rb') as f:
                self.random_forest_regressor = pickle.load(f)
            
            with open(f'{directory}/scaler.pkl', 'rb') as f:
                self.scaler = pickle.load(f)
            
            print("Models loaded successfully")
            return True
        except Exception as e:
            print(f"Error loading models: {e}")
            return False


if __name__ == "__main__":
    # Test the ML models
    print("Aviation ML Models Module")
    print("This module contains ML model training and prediction functions")
