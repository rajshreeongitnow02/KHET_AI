import os

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# IMPORTANT: this key must come from an environment variable, never be hardcoded here.
# The key that used to be hardcoded in this file is public in your git history — rotate it
# in your Agromonitoring account and set the new one as AGRO_API_KEY on your host (e.g. Render).
API_KEY = os.environ.get("AGRO_API_KEY")
POLYGON_ID = os.environ.get("AGRO_POLYGON_ID", "6aac17edfc4d161892b9503d")

REQUEST_TIMEOUT = 10  # seconds


def _get_json(url, params):
    """Call an upstream API and return (json, status_code) without crashing on failures."""
    try:
        resp = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        return resp.json(), 200
    except requests.exceptions.RequestException as exc:
        app.logger.error("Upstream request failed: %s", exc)
        return {"error": "Upstream service unavailable"}, 502
    except ValueError:
        return {"error": "Upstream returned invalid JSON"}, 502


@app.route("/")
def health():
    return jsonify({"status": "ok"})


@app.route("/soil-health")
def get_soil_health():
    if not API_KEY:
        return jsonify({"error": "AGRO_API_KEY is not configured on the server"}), 500
    data, status = _get_json(
        "https://api.agromonitoring.com/agro/1.0/soil",
        {"polyid": POLYGON_ID, "appid": API_KEY},
    )
    return jsonify(data), status


@app.route("/weather")
def get_weather():
    try:
        lat = float(request.args.get("lat", "18.5204"))
        lon = float(request.args.get("lon", "73.8567"))
    except ValueError:
        return jsonify({"error": "lat and lon must be numbers"}), 400
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        return jsonify({"error": "lat/lon out of range"}), 400

    data, status = _get_json(
        "https://api.open-meteo.com/v1/forecast",
        {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
            "timezone": "auto",
        },
    )
    return jsonify(data), status


if __name__ == "__main__":
    # debug=True with host 0.0.0.0 exposes Werkzeug's interactive debugger to the network,
    # so it is opt-in for local development only. Production runs via gunicorn/render.
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=os.environ.get("FLASK_DEBUG") == "1",
    )
