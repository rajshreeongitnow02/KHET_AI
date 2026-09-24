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

# Optional: only fill this in if you register a real Agromonitoring polygon per district.
# A "polygon" is a field boundary you draw on Agromonitoring's map for that exact district;
# each one gets its own ID. Without one, real satellite soil-moisture/temperature readings
# (moisture, t0, t10) aren't available for an arbitrary point, so we estimate them below
# from live weather instead. Example once you have IDs:
#   AGRO_POLYGON_MAP = {"Pune": "abc123...", "Nashik": "def456..."}
AGRO_POLYGON_MAP = {}

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


def _parse_lat_lon():
    try:
        lat = float(request.args.get("lat", "18.5204"))
        lon = float(request.args.get("lon", "73.8567"))
    except ValueError:
        return None, None, ("lat and lon must be numbers", 400)
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        return None, None, ("lat/lon out of range", 400)
    return lat, lon, None


@app.route("/")
def health():
    return jsonify({"status": "ok"})


@app.route("/soil-health")
def get_soil_health():
    """
    Returns the 7-metric panel data for a specific district (by lat/lon).

    If a real Agromonitoring polygon is registered for this district in
    AGRO_POLYGON_MAP, we use the actual sensor/satellite reading for that
    field ("source": "sensor"). Otherwise we derive honest, region-specific
    estimates from that district's own live weather ("source": "estimated") -
    this is what makes the panel actually change between districts instead
    of always showing one fixed field's numbers.
    """
    lat, lon, err = _parse_lat_lon()
    if err:
        return jsonify({"error": err[0]}), err[1]

    district = request.args.get("district", "")
    polygon_id = AGRO_POLYGON_MAP.get(district)

    if polygon_id:
        if not API_KEY:
            return jsonify({"error": "AGRO_API_KEY is not configured on the server"}), 500
        data, status = _get_json(
            "https://api.agromonitoring.com/agro/1.0/soil",
            {"polyid": polygon_id, "appid": API_KEY},
        )
        if status == 200:
            data["source"] = "sensor"
        return jsonify(data), status

    # No registered polygon for this district -> estimate from that district's live weather.
    weather, status = _get_json(
        "https://api.open-meteo.com/v1/forecast",
        {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,precipitation",
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max",
            "timezone": "auto",
        },
    )
    if status != 200 or "current" not in weather or "daily" not in weather:
        return jsonify({"error": "Could not derive soil estimate: weather data unavailable"}), 502

    current = weather["current"]
    daily = weather["daily"]

    air_temp = current.get("temperature_2m")
    humidity = current.get("relative_humidity_2m", 50)
    rain_today = (daily.get("precipitation_sum") or [0])[0] or 0
    tmax = (daily.get("temperature_2m_max") or [air_temp])[0]
    tmin = (daily.get("temperature_2m_min") or [air_temp])[0]
    uvi_list = daily.get("uv_index_max") or []
    uvi = uvi_list[0] if uvi_list else None

    # Simple, transparent proxies (not a lab-grade soil model):
    # - surface temp tracks current air temp
    # - 10cm root-zone temp is damped toward the day's mean (soil lags the air)
    # - moisture rises with today's rainfall and ambient humidity, capped to a plausible range
    t0 = air_temp
    t10 = (tmax + tmin) / 2 if tmax is not None and tmin is not None else air_temp
    moisture = None
    if air_temp is not None:
        moisture = 0.12 + min(rain_today, 20) * 0.008 + max(0, humidity - 40) / 100 * 0.08
        moisture = max(0.05, min(0.42, moisture))

    return jsonify({
        "source": "estimated",
        "moisture": moisture,
        "t0": (t0 + 273.15) if t0 is not None else None,   # convert to Kelvin to match sensor-format fields
        "t10": (t10 + 273.15) if t10 is not None else None,
        "uvi": uvi,
        "note": "Estimated from this district's live weather - no dedicated soil sensor is connected here yet.",
    }), 200


@app.route("/weather")
def get_weather():
    lat, lon, err = _parse_lat_lon()
    if err:
        return jsonify({"error": err[0]}), err[1]

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
