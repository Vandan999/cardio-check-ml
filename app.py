from flask import Flask, request, jsonify,send_from_directory
import joblib
import numpy as np

# ==========================================
# 1. CREATE FLASK APPLICATION
# ==========================================

app = Flask(__name__)


# ==========================================
# 2. LOAD WEEK 5 FINAL MODEL
# ==========================================

model = joblib.load("week5_best_model.pkl")

print("Week 5 model loaded successfully!")


# ==========================================
# 3. HOME ROUTE
# ==========================================

@app.route("/")
def home():
    return send_from_directory("Frontend", "index.html")

@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory("Frontend", filename)


# ==========================================
# 4. PREDICTION ROUTE
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    # Receive JSON data from frontend
    data = request.json

    # Get values in the SAME order used during training
    features = [
        data["age"],
        data["gender"],
        data["height"],
        data["weight"],
        data["ap_hi"],
        data["ap_lo"],
        data["cholesterol"],
        data["gluc"],
        data["smoke"],
        data["alco"],
        data["active"]
    ]

    # Convert to NumPy array
    features = np.array(features).reshape(1, -1)

    # Make prediction
    prediction = model.predict(features)[0]

    # Get probability
    probability = model.predict_proba(features)[0][1]

    # Send result back to frontend
    return jsonify({
        "prediction": int(prediction),
        "probability": float(probability)
    })


# ==========================================
# 5. START SERVER
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)