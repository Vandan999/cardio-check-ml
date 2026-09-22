// Collect form data and send it to the Python ML backend.
// The backend should expose POST /predict.

const form = document.getElementById("predictionForm");
const result = document.getElementById("result");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const probabilityValue = document.getElementById("probabilityValue");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const data = {
        age: Number(document.getElementById("age").value),
        gender: Number(document.getElementById("gender").value),
        height: Number(document.getElementById("height").value),
        weight: Number(document.getElementById("weight").value),
        ap_hi: Number(document.getElementById("ap_hi").value),
        ap_lo: Number(document.getElementById("ap_lo").value),
        cholesterol: Number(document.getElementById("cholesterol").value),
        gluc: Number(document.getElementById("gluc").value),
        smoke: Number(document.getElementById("smoke").value),
        alco: Number(document.getElementById("alco").value),
        active: Number(document.getElementById("active").value)
    };

    try {
        const response = await fetch("/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Prediction request failed.");

        const prediction = await response.json();
        showResult(prediction);

    } catch (error) {
        result.classList.remove("hidden");
        resultTitle.textContent = "Backend not connected";
        resultText.textContent = "The frontend is working, but the /predict Python API is not running yet.";
        probabilityValue.textContent = "--";
        console.error(error);
    }
});

function showResult(prediction) {
    result.classList.remove("hidden");

    if (prediction.prediction === 1) {
    resultTitle.textContent = "Cardiovascular Disease Predicted";
    resultText.textContent =
        "The trained model predicted class 1 for the entered information.";
} else {
    resultTitle.textContent = "No Cardiovascular Disease Predicted";
    resultText.textContent =
        "The trained model predicted class 0 for the entered information.";
}

    if (prediction.probability !== undefined) {
        probabilityValue.textContent =
            (prediction.probability * 100).toFixed(2) + "%";
    }
}
