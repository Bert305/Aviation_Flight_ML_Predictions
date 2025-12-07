# Aviation Flight ML Predictions

A fullstack machine learning application for analyzing aviation safety data and predicting flight incidents using NTSB and FAA datasets.

## 🚀 Features

- **Interactive Dashboard**: Real-time statistics and overview of aviation accident data
- **Accident Explorer**: Search and filter through historical accident records
- **Data Visualizations**: Beautiful charts showing trends, distributions, and patterns
- **ML Predictions**: Machine learning models for predicting flight safety risks
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

### Frontend
- **React**: UI framework
- **Modern CSS**: Gradient designs and animations

## 📦 Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Activate virtual environment:
```bash
.venv\Scripts\Activate.ps1
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
AVIATIONSTACK_API_KEY=your_key_here
```

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
cd backend
.venv\Scripts\Activate.ps1
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

## 🎯 ML Models

### 1. Linear Regression
Predicts continuous severity scores based on:
- Temporal features (year, month, day of week)
- Aircraft characteristics
- Weather conditions
- Flight phase

### 2. Random Forest Classifier
Classifies accident severity into categories:
- Fatal
- Serious
- Minor
- None

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
- **Predictions.js**: ML prediction interface

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
│   │   ├── services/             # API service
│   │   ├── App.js                # Main app component
│   │   └── App.css               # Styles
│   ├── package.json              # Node dependencies
│   └── public/                   # Static files
└── README.md
```

## 🌐 API Integration Ready

The project is structured to integrate with:
- **aviationstack.com**: Real-time flight data
- **Weather API**: Weather conditions
- **Tavily API**: Aviation news and context
- **OpenAI API**: Natural language insights

## 📈 Future Enhancements

- [ ] Deploy trained ML models for real predictions
- [ ] Integrate real-time flight data from aviationstack
- [ ] Add weather API integration
- [ ] Implement advanced visualizations (D3.js, Chart.js)
- [ ] Add user authentication
- [ ] Export reports and predictions
- [ ] Mobile responsive improvements
- [ ] Add more ML models (XGBoost, Neural Networks)

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