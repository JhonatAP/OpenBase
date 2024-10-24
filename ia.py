from numpy import dot
from numpy.linalg import norm

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

def recommend_cryptos_for_user(user_id):
    # Obtener preferencias del usuario actual
    current_user = users_collection.find_one({"_id": user_id})
    if not current_user:
        return {"error": "Usuario no encontrado"}

    current_preferences = current_user.get('preferences', [])
    all_users = users_collection.find({"_id": {"$ne": user_id}})
    
    recommendations = {}
    
    for other_user in all_users:
        other_preferences = other_user.get('preferences', [])
        similarity = cosine_similarity(current_preferences, other_preferences)
        
        # Si la similitud es significativa
        if similarity > 0.1:
            for crypto in other_preferences:
                if crypto not in current_preferences:
                    if crypto not in recommendations:
                        recommendations[crypto] = 0
                    recommendations[crypto] += similarity
    
    # Ordenar las recomendaciones por relevancia (similitud)
    sorted_recommendations = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
    
    return {"recommendations": [crypto[0] for crypto in sorted_recommendations]}
