from flask import Flask, request, jsonify
from pymongo import MongoClient
from numpy import dot
from numpy.linalg import norm
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Conexión a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.openbase

users_collection = db.users
cryptos_collection = db.cryptos

# Función para calcular la similitud de coseno entre dos listas
def cosine_similarity(list1, list2):
    if len(list1) == 0 or len(list2) == 0:
        return 0.0
    set1, set2 = set(list1), set(list2)
    intersection = list(set1.intersection(set2))
    
    if not intersection:
        return 0.0
    
    vector1 = [1 if crypto in intersection else 0 for crypto in set1]
    vector2 = [1 if crypto in intersection else 0 for crypto in set2]
    
    return dot(vector1, vector2) / (norm(vector1) * norm(vector2))

@app.route('/recommend/<user_id>', methods=['GET'])
def recommend(user_id):
    current_user = users_collection.find_one({"_id": user_id})

    if not current_user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    current_preferences = current_user.get('preferences', [])
    all_users = users_collection.find({"_id": {"$ne": user_id}})

    crypto_recs = {}

    for other_user in all_users:
        other_preferences = other_user.get('preferences', [])
        similarity = cosine_similarity(current_preferences, other_preferences)

        if similarity > 0.1:  # Umbral de similitud
            for crypto in other_preferences:
                if crypto not in current_preferences:
                    crypto_recs[crypto] = crypto_recs.get(crypto, 0) + similarity

    # Ordenar las recomendaciones por relevancia
    sorted_recs = sorted(crypto_recs.items(), key=lambda x: x[1], reverse=True)

    return jsonify({
        "recommendations": [rec[0] for rec in sorted_recs]
    })

@app.route('/user/<user_id>/add-preference', methods=['POST'])
def add_preference(user_id):
    data = request.json
    crypto_name = data.get('cryptoName')

    if not crypto_name:
        return jsonify({"error": "Debe proporcionar el nombre de una criptomoneda"}), 400

    user = users_collection.find_one({"_id": user_id})
    
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if crypto_name not in user['preferences']:
        users_collection.update_one(
            {"_id": user_id},
            {"$push": {"preferences": crypto_name}}
        )

    return jsonify({"message": "Preferencia agregada con éxito"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
