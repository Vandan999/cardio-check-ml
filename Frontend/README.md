# CardioCheck Frontend

Simple, clean frontend for the Cardiovascular Disease Prediction project.

## Files

- index.html — page structure and form
- style.css — all visual styling
- script.js — sends form data to the Python API

## Backend connection

The frontend expects:

POST /predict

Example response:

{
    "prediction": 1,
    "probability": 0.78
}

The frontend intentionally does not make a fake prediction. It waits for the real Python ML model.

## Important

The current Week 3 model uses:

X = df.drop("cardio", axis=1)

Therefore the dataset `id` is currently included as a model feature. The frontend sends a hidden id value of 0 to match that model.

For a better final ML model, remove `id` from X and then remove the hidden id field from this frontend too.
