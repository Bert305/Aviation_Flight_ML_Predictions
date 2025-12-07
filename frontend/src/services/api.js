const API_BASE_URL = 'http://localhost:5000';

export const apiService = {
  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.json();
  },

  // Get statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    return response.json();
  },

  // Get accidents with filters
  getAccidents: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/api/accidents?${params}`);
    return response.json();
  },

  // Get accidents by year
  getAccidentsByYear: async () => {
    const response = await fetch(`${API_BASE_URL}/api/accidents/by-year`);
    return response.json();
  },

  // Get accidents by airline
  getAccidentsByAirline: async () => {
    const response = await fetch(`${API_BASE_URL}/api/accidents/by-airline`);
    return response.json();
  },

  // Get accidents by location
  getAccidentsByLocation: async () => {
    const response = await fetch(`${API_BASE_URL}/api/accidents/by-location`);
    return response.json();
  },

  // Get severity distribution
  getSeverityDistribution: async () => {
    const response = await fetch(`${API_BASE_URL}/api/accidents/severity-distribution`);
    return response.json();
  },

  // Make prediction
  makePrediction: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Get model performance
  getModelPerformance: async () => {
    const response = await fetch(`${API_BASE_URL}/api/model-performance`);
    return response.json();
  },

  // Get target distributions
  getTargetDistributions: async () => {
    const response = await fetch(`${API_BASE_URL}/api/target-distributions`);
    return response.json();
  },

  // Get prediction samples with features
  getPredictionSamples: async () => {
    const response = await fetch(`${API_BASE_URL}/api/prediction-samples`);
    return response.json();
  },

  // Get real-time flights with predictions
  getRealFlights: async () => {
    const response = await fetch(`${API_BASE_URL}/api/realflights`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};
