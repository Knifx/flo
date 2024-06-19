from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/proxy', methods=['GET'])
def proxy():
    api_url = 'https://skidkaonline.ru/apiv3/products/'
    params = {
        'limit': request.args.get('limit'),
        'offset': request.args.get('offset'),
        'shop_id': request.args.get('shop_id'),
        'city_id': request.args.get('city_id'),
        'fields': request.args.get('fields'),
        'query': request.args.get('query')
    }
    response = requests.get(api_url, params=params)
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True)
