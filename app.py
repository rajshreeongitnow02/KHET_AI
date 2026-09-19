from flask import Flask, jsonify, request
from flask_cors import CORS # Import CORS
import requests

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

API_KEY = "20d3997a8b9ef919afd84d183257a79b"

@app.route('/soil-health')
def get_soil_health():
    url = f"http://api.agromonitoring.com/agro/1.0/soil?polyid=6aac17edfc4d161892b9503d&appid={API_KEY}"
    response = requests.get(url)
    return jsonify(response.json())

@app.route('/weather')
def get_weather():
    lat = request.args.get('lat', '18.5204')
    lon = request.args.get('lon', '73.8567')
    # Proxy open-weather or open-meteo data safely through your backend
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto"
    response = requests.get(url)
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
