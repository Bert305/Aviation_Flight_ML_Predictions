# Plot Generation Guide

## Overview
The ML visualization plots are automatically generated when you train the models and can be downloaded as PNG files from the frontend.

## How It Works

### 1. Generate Plots by Training Models

Run the training script to generate visualization plots:

```bash
cd backend
python train_models.py
```

This will:
- Train the Linear Regression and Random Forest models
- Generate 2 high-quality PNG plots:
  - `models/plots/classifier_feature_importance.png` - Feature importance for the Random Forest Classifier
  - `models/plots/regressor_comparison.png` - Model performance comparison and feature importance for regressors

### 2. Download Plots from Frontend

1. Start the backend server:
   ```bash
   cd backend
   python app.py
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Navigate to the **Visualizations** tab
4. Scroll to the "🤖 Machine Learning Model Performance" section
5. Click the download buttons:
   - **📊 Download Classifier Plot** - Downloads classifier feature importance
   - **📈 Download Regressor Plot** - Downloads regressor comparison

## Plot Details

### Classifier Feature Importance Plot
- Shows which features have the biggest impact on severity classification
- Horizontal bar chart with color gradient
- High-resolution (300 DPI) suitable for presentations

### Regressor Comparison Plot
- Left panel: RMSE comparison between Linear Regression and Random Forest
- Right panel: Feature importance for Random Forest Regressor
- Shows which model performs better (lower RMSE)

## Auto-Update
- Plots automatically update when you retrain the models with `python train_models.py`
- The frontend download buttons always serve the latest generated plots
- No need to manually refresh - just retrain and download

## API Endpoint

The plots are served via:
```
GET http://localhost:5000/api/plots/{plot_name}
```

Where `plot_name` can be:
- `classifier_feature_importance`
- `regressor_comparison`

## File Locations

```
backend/
  └── models/
      └── plots/
          ├── classifier_feature_importance.png
          └── regressor_comparison.png
```

## Customization

To modify plot appearance, edit the `generate_plots()` function in `backend/train_models.py`:
- Change colors, sizes, fonts
- Add/remove chart elements
- Adjust DPI for different quality levels
