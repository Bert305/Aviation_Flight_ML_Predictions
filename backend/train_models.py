"""
Script to train ML models on aviation accident data
"""
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for saving plots
import matplotlib.pyplot as plt
import numpy as np
from ml_models import AviationMLModels
import os
import json


def generate_plots(classifier_results, regressor_results, X_test=None, y_test=None, y_pred_linear=None, y_pred_rf=None):
    """Generate and save visualization plots"""
    plots_dir = 'models/plots'
    os.makedirs(plots_dir, exist_ok=True)
    
    # Plot 1: Feature Importance Comparison
    if classifier_results and 'feature_importance' in classifier_results:
        fig, ax = plt.subplots(figsize=(10, 6))
        features = list(classifier_results['feature_importance'].keys())
        importances = list(classifier_results['feature_importance'].values())
        
        colors = plt.cm.viridis(np.linspace(0.3, 0.9, len(features)))
        bars = ax.barh(features, importances, color=colors)
        ax.set_xlabel('Importance Score', fontsize=12)
        ax.set_title('Random Forest Classifier - Feature Importance', fontsize=14, fontweight='bold')
        ax.grid(axis='x', alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(f'{plots_dir}/classifier_feature_importance.png', dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Saved classifier feature importance plot")
    
    # Plot 2: Model Performance Comparison
    if regressor_results:
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
        
        # RMSE Comparison
        models = ['Linear\nRegression', 'Random Forest\nRegressor']
        rmse_values = [regressor_results.get('linear_regression_rmse', 0), regressor_results.get('random_forest_rmse', 0)]
        colors_rmse = ['#fa709a', '#30cfd0']
        
        bars1 = ax1.bar(models, rmse_values, color=colors_rmse, alpha=0.8, edgecolor='black', linewidth=1.5)
        ax1.set_ylabel('RMSE (Lower is Better)', fontsize=12)
        ax1.set_title('Model Performance Comparison', fontsize=14, fontweight='bold')
        ax1.grid(axis='y', alpha=0.3)
        
        # Add value labels on bars
        for bar, value in zip(bars1, rmse_values):
            height = bar.get_height()
            ax1.text(bar.get_x() + bar.get_width()/2., height,
                    f'{value:.2f}', ha='center', va='bottom', fontsize=11, fontweight='bold')
        
        # Feature Importance for Random Forest Regressor
        if 'feature_importance' in regressor_results:
            features = list(regressor_results['feature_importance'].keys())
            importances = list(regressor_results['feature_importance'].values())
            
            colors_feat = plt.cm.plasma(np.linspace(0.3, 0.9, len(features)))
            bars2 = ax2.barh(features, importances, color=colors_feat)
            ax2.set_xlabel('Importance Score', fontsize=12)
            ax2.set_title('Random Forest Regressor - Feature Importance', fontsize=14, fontweight='bold')
            ax2.grid(axis='x', alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(f'{plots_dir}/regressor_comparison.png', dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Saved regressor comparison plot")
    
    # Plot 3: Linear Regression - Actual vs Predicted (subset)
    if y_test is not None and y_pred_linear is not None:
        # Use only first 100 samples for clarity
        subset_size = min(100, len(y_test))
        fig, ax = plt.subplots(figsize=(12, 6))
        
        x_axis = np.arange(subset_size)
        ax.plot(x_axis, y_test[:subset_size], 'o-', label='Actual', color='#667eea', markersize=6, linewidth=2, alpha=0.8)
        ax.plot(x_axis, y_pred_linear[:subset_size], 's-', label='Predicted', color='#fa709a', markersize=5, linewidth=2, alpha=0.8)
        
        ax.set_xlabel('Test Sample Index', fontsize=12)
        ax.set_ylabel('Severity Score', fontsize=12)
        ax.set_title('Linear Regression: Actual vs Predicted Values (First 100 Samples)', fontsize=14, fontweight='bold')
        ax.legend(loc='best', fontsize=11)
        ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(f'{plots_dir}/linear_regression_predictions.png', dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Saved linear regression predictions plot")
    
    # Plot 4: Random Forest - Actual vs Predicted (subset)
    if y_test is not None and y_pred_rf is not None:
        # Use only first 100 samples for clarity
        subset_size = min(100, len(y_test))
        fig, ax = plt.subplots(figsize=(12, 6))
        
        x_axis = np.arange(subset_size)
        ax.plot(x_axis, y_test[:subset_size], 'o-', label='Actual', color='#667eea', markersize=6, linewidth=2, alpha=0.8)
        ax.plot(x_axis, y_pred_rf[:subset_size], 's-', label='Predicted', color='#30cfd0', markersize=5, linewidth=2, alpha=0.8)
        
        ax.set_xlabel('Test Sample Index', fontsize=12)
        ax.set_ylabel('Severity Score', fontsize=12)
        ax.set_title('Random Forest Regressor: Actual vs Predicted Values (First 100 Samples)', fontsize=14, fontweight='bold')
        ax.legend(loc='best', fontsize=11)
        ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(f'{plots_dir}/random_forest_predictions.png', dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Saved random forest predictions plot")
    
    print(f"\nPlots saved to: {plots_dir}/")

def main():
    print("=" * 60)
    print("Aviation ML Model Training")
    print("=" * 60)
    
    # Load data
    print("\nLoading datasets...")
    try:
        airline_accidents = pd.read_csv('airline_accidents.csv', encoding='latin-1', low_memory=False)
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
    
    # Get test predictions for visualization
    X_test = regressor_results.get('X_test') if regressor_results else None
    y_test = regressor_results.get('y_test') if regressor_results else None
    y_pred_linear = regressor_results.get('y_pred_linear') if regressor_results else None
    y_pred_rf = regressor_results.get('y_pred_rf') if regressor_results else None
    
    if regressor_results:
        print("\nTop 5 Important Features:")
        importance = sorted(regressor_results['feature_importance'].items(), 
                          key=lambda x: x[1], reverse=True)[:5]
        for feature, score in importance:
            print(f"  {feature}: {score:.4f}")
    
    # Generate visualization plots
    print("\n" + "=" * 60)
    print("Generating Visualization Plots")
    print("=" * 60)
    generate_plots(classifier_results, regressor_results, X_test, y_test, y_pred_linear, y_pred_rf)
    
    # Save models
    print("\n" + "=" * 60)
    print("Saving Models")
    print("=" * 60)
    ml_models.save_models()
    
    print("\n" + "=" * 60)
    print("Training Complete!")
    print("=" * 60)
    print("\nGenerated files:")
    print("  - models/*.pkl (ML models)")
    print("  - models/model_metadata.json (performance metrics)")
    print("  - models/plots/*.png (visualization plots)")


if __name__ == "__main__":
    main()
