#!/bin/bash

echo "Starting Aviation ML API..."

# Check if models directory exists and has trained models
if [ ! -f "models/random_forest_classifier.pkl" ]; then
    echo "Models not found. Training models..."
    python train_models.py
    echo "Model training complete!"
else
    echo "Models already trained. Skipping training."
fi

# Start the application with gunicorn
echo "Starting Gunicorn server..."
gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
