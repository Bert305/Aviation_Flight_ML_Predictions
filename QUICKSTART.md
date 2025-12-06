# Quick Start Guide - Aviation ML Project

## Prerequisites
- Python 3.11+ installed
- Node.js 16+ installed
- Virtual environment activated in backend

## Step 1: Backend Setup (5 minutes)

### Open Terminal 1:
```powershell
cd backend
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

✅ Backend should be running on http://localhost:5000

## Step 2: Frontend Setup (2 minutes)

### Open Terminal 2:
```powershell
cd frontend
npm start
```

✅ Frontend should open automatically at http://localhost:3000

## Step 3: Verify Everything Works

1. **Check Backend**: Visit http://localhost:5000 in your browser
   - You should see API information

2. **Check Frontend**: Visit http://localhost:3000
   - Dashboard should load with statistics
   - Try navigating to different tabs

## Step 4: Train ML Models (Optional)

### In Terminal 1 (after stopping the backend with Ctrl+C):
```powershell
python train_models.py
```

This will train the models on your data and save them to the `models/` directory.

## Troubleshooting

### Backend won't start?
- Make sure virtual environment is activated
- Check if port 5000 is available
- Verify CSV files are in the backend folder

### Frontend shows errors?
- Make sure backend is running first
- Check console for CORS errors
- Verify API_BASE_URL in frontend/src/services/api.js

### Data not loading?
- Ensure `airline_accidents.csv` and `ntsb_aviation_data.csv` are in the backend folder
- Check backend terminal for error messages

## What to Explore

1. **Dashboard Tab**: See overall statistics and recent trends
2. **Accident Explorer Tab**: Search and filter accident records
3. **Visualizations Tab**: View beautiful charts and graphs
4. **Predictions Tab**: Enter flight details for ML predictions

## Next Steps

1. Train the ML models: `python train_models.py`
2. Add your API keys to `.env` file
3. Customize the visualizations
4. Extend the ML models with more features

---

Need help? Check the main README.md for detailed documentation!
