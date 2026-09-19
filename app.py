from flask import Flask, jsonify
from flask_cors import CORS # Import CORS
import requests

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

API_KEY = "20d3997a8b9eb919afd84d183257a79b"

@app.route('/soil-health')
def get_soil_health():
    url = f"http://api.agromonitoring.com/agro/1.0/soil?polyid=6aac17edfc4d161892b9503d&appid={API_KEY}"
    response = requests.get(url)
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
