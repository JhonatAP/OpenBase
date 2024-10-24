import pymongo

# Conectar a MongoDB
client = pymongo.MongoClient('mongodb://localhost:27017/')  # Cambia la URL si usas una instancia remota
db = client['openbase']

# Eliminar colecciones anteriores si existen
db.users.drop()
db.cryptos.drop()

# Insertar datos de ejemplo en la colección 'users'
users_data = [
    {"_id": "user1", "preferences": ["Bitcoin", "Ethereum", "Solana"]},
    {"_id": "user2", "preferences": ["Cardano", "Polkadot", "Solana"]},
    {"_id": "user3", "preferences": ["Bitcoin", "Binance Coin", "Avalanche"]},
]

db.users.insert_many(users_data)

# Insertar datos de ejemplo en la colección 'cryptos'
cryptos_data = [
    {"_id": "BTC", "name": "Bitcoin"},
    {"_id": "ETH", "name": "Ethereum"},
    {"_id": "SOL", "name": "Solana"},
    {"_id": "ADA", "name": "Cardano"},
    {"_id": "DOT", "name": "Polkadot"},
    {"_id": "BNB", "name": "Binance Coin"},
    {"_id": "AVAX", "name": "Avalanche"},
]

db.cryptos.insert_many(cryptos_data)

print("Datos de ejemplo insertados correctamente en MongoDB.")
