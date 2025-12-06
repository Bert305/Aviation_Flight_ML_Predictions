"""
Script to train ML models on aviation accident data
"""
import pandas as pd
from ml_models import AviationMLModels


def main():
    print("=" * 60)
    print("Aviation ML Model Training")
    print("=" * 60)
    
    # Load data
    print("\nLoading datasets...")
    try:
        airline_accidents = pd.read_csv('airline_accidents.csv')
        print(f"Loaded {len(airline_accidents)} records from airline_accidents.csv")
    except Exception as e:
        print(f"Error loading data: {e}")
        return
    
    # Initialize ML models
    ml_models = AviationMLModels()
    
    # Train classification model
    print("\n" + "=" * 60)
    print("Training Classification Model (Severity Prediction)")
    print("=" * 60)
    classifier_results = ml_models.train_severity_classifier(airline_accidents)
    
    if classifier_results:
        print("\nTop 5 Important Features:")
        importance = sorted(classifier_results['feature_importance'].items(), 
                          key=lambda x: x[1], reverse=True)[:5]
        for feature, score in importance:
            print(f"  {feature}: {score:.4f}")
    
    # Train regression models
    print("\n" + "=" * 60)
    print("Training Regression Models (Severity Score Prediction)")
    print("=" * 60)
    regressor_results = ml_models.train_severity_regressor(airline_accidents)
    
    if regressor_results:
        print("\nTop 5 Important Features:")
        importance = sorted(regressor_results['feature_importance'].items(), 
                          key=lambda x: x[1], reverse=True)[:5]
        for feature, score in importance:
            print(f"  {feature}: {score:.4f}")
    
    # Save models
    print("\n" + "=" * 60)
    print("Saving Models")
    print("=" * 60)
    ml_models.save_models()
    
    print("\n" + "=" * 60)
    print("Training Complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
