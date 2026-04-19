# Aviation Flight ML Predictions

A fullstack machine learning application for analyzing aviation safety data and predicting flight incidents using NTSB and FAA datasets.

## 🚀 Features

- **Interactive Dashboard**: Real-time statistics and overview of aviation accident data
- **Accident Explorer**: Search and filter through historical accident records
- **Data Visualizations**: Beautiful charts showing trends, distributions, and patterns
  - Open plots in new browser tabs for detailed viewing
- **ML Predictions**: Machine learning models for predicting flight safety risks
  - Detailed severity class probability breakdowns with color-coded visualization
  - View confidence scores and all possible outcomes
- **Real Flights**: Live flight data integration with ML predictions
  - Fetches real-time flights from AviationStack API
  - Auto-refresh capability for continuous monitoring
  - ML predictions on live commercial flights
- **RESTful API**: Flask backend with comprehensive endpoints
- **Modern UI**: React frontend with responsive design

## 📊 Datasets

- **airline_accidents.csv**: NTSB investigation data (1962-2007)
- **ntsb_aviation_data.csv**: NTSB aviation data (1982-2020)

## 🛠️ Tech Stack

### Backend
- **Flask**: Web framework
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Scikit-learn**: Machine learning models
- **Flask-CORS**: Cross-origin resource sharing
- **Requests**: HTTP library for API calls
- **Python-dotenv**: Environment variable management

### Frontend
- **React**: UI framework
- **Modern CSS**: Gradient designs and animations

## 📦 Installation

### Backend Setup



1. Activate virtual environment:

```bash
python -m venv .venv
```

```bash
.venv\Scripts\Activate.ps1
```

2. Navigate to the backend directory:
```bash
cd backend
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

5. Add your API keys to `.env`:
```
AVIATIONSTACK_API_KEY=your_aviationstack_key_here
```

> **Note**: The `.env` file is automatically excluded from version control via `.gitignore` to protect your API keys.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Running the Application

### Start the Backend Server

```bash
cd backend
.venv\Scripts\Activate.ps1
python app.py
```

The API will run on `http://localhost:5000`

### Start the Frontend Development Server

```bash
cd frontend
npm start
```

The React app will run on `http://localhost:3000`

## 🤖 Training ML Models

To train the machine learning models:

```bash
.venv\Scripts\Activate.
cd backend
python train_models.py
```

This will:
- Load and preprocess the aviation accident data
- Train Linear Regression and Random Forest models
- Evaluate model performance
- Save trained models to the `models/` directory

## 📡 API Endpoints

### Health & Stats
- `GET /` - API information
- `GET /api/health` - Health check
- `GET /api/stats` - Dataset statistics

### Accident Data
- `GET /api/accidents` - Get accidents with filters
  - Query params: `limit`, `offset`, `country`, `severity`, `year`
- `GET /api/accidents/by-year` - Yearly accident trends
- `GET /api/accidents/by-airline` - Accidents by aircraft manufacturer
- `GET /api/accidents/by-location` - Accidents by country
- `GET /api/accidents/severity-distribution` - Severity distribution

### Predictions
- `POST /api/predict` - Make ML predictions
  - Body: Flight details (airline, aircraft, airports, weather, etc.)
  - Returns: Severity class, confidence score, risk level, and full probability breakdown

### Real Flights
- `GET /api/realflights` - Fetch live flights with ML predictions
  - Integrates with AviationStack API
  - Returns: Real-time flight data with ML-generated risk predictions

### Visualizations
- `GET /api/plots/<plot_name>` - Retrieve ML visualization plots
  - Opens in new browser tab for detailed viewing

## 🎯 ML Models

### 1. Linear Regression
Predicts continuous severity scores based on:
- Temporal features (year, month, day of week)
- Aircraft characteristics
- Weather conditions
- Flight phase

### 2. Random Forest Classifier
Classifies accident severity into categories:
- Fatal (multiple severity classes)
- Incident
- Minor
- Non-Fatal

**Enhanced Output:**
- Primary severity class prediction
- Confidence score (0-1 range, displayed as percentage)
- Full probability breakdown for all severity classes
- Color-coded visualization in UI

### 3. Random Forest Regressor
Predicts numerical risk scores with feature importance analysis.

## 📊 Key Features for ML

**X Features (Input Variables):**
- Year, Month, Day of Week, Quarter
- Country, Weather Condition
- Flight Phase (Takeoff, Cruise, Landing, etc.)
- Aircraft Category, Engine Type
- Number of Engines
- Aircraft Make/Model

**Y Target Variables (Predictions):**
- Injury Severity (Classification)
- Severity Score (Regression)
- Risk Level

## 🎨 Frontend Components

- **Dashboard.js**: Overview statistics and recent trends
- **AccidentExplorer.js**: Searchable accident database
- **Visualizations.js**: Interactive charts and graphs
  - Plots open in new tabs for better viewing
  - ML model performance visualizations
- **Predictions.js**: ML prediction interface
  - Manual flight data input
  - Detailed probability breakdowns with progress bars
  - Color-coded severity indicators
- **RealFlights.js**: Live flight monitoring with ML predictions
  - Auto-refresh toggle (2-minute intervals)
  - Real-time flight cards with status badges
  - Integrated ML predictions on live data

## 🔧 Project Structure

```
Aviation_Flight_ML_Predictions/
├── backend/
│   ├── .venv/                    # Virtual environment
│   ├── models/                   # Trained ML models
│   ├── app.py                    # Flask API server
│   ├── ml_models.py              # ML model classes
│   ├── train_models.py           # Model training script
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment variables template
│   ├── airline_accidents.csv     # Dataset 1
│   └── ntsb_aviation_data.csv    # Dataset 2
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── AccidentExplorer.js
│   │   │   ├── Visualizations.js
│   │   │   ├── Predictions.js
│   │   │   └── RealFlights.js    # NEW: Live flight tracking
│   │   ├── services/             # API service
│   │   │   └── api.js
│   │   ├── App.js                # Main app component
│   │   └── App.css               # Styles
│   ├── package.json              # Node dependencies
│   └── public/                   # Static files
└── README.md
```

## 🌐 API Integration Ready

The project is structured to integrate with:
- **AviationStack API**: ✅ **INTEGRATED** - Real-time flight data for live predictions

## ✨ Recent Updates

### v2.0 - Live Flight Integration (December 2025)
- ✅ Added Real Flights tab with live flight tracking
- ✅ Integrated AviationStack API for real-time flight data
- ✅ ML predictions on live commercial flights
- ✅ Auto-refresh capability for continuous monitoring
- ✅ Enhanced prediction display with probability breakdowns
- ✅ Fixed confidence score calculation (0-1 range)
- ✅ Plot visualizations now open in new tabs
- ✅ Color-coded severity and risk indicators
- ✅ Environment variable management with python-dotenv

## 📈 Future Enhancements

- [x] Deploy trained ML models for real predictions
- [x] Integrate real-time flight data from aviationstack
- [ ] Add US flight filtering capability
- [ ] Integrate weather API for live conditions
- [ ] Implement advanced visualizations (D3.js, Chart.js)
- [ ] Add user authentication
- [ ] Export reports and predictions
- [ ] Mobile responsive improvements
- [ ] Add more ML models (XGBoost, Neural Networks)
- [ ] Historical flight tracking and analysis

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is for educational purposes using public aviation safety data.

## 🙏 Data Sources

- NTSB (National Transportation Safety Board)
- FAA (Federal Aviation Administration)
- WAAS (World Aircraft Accident Summary)
- Kaggle Dataset by Pratham Sharma

---

**Built with ❤️ for Aviation Safety Analysis**