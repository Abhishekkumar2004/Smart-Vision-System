from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URL)

db = client["smart_vision_erp"]  # database
users_db = db["users"]           # table 1
attendance_db = db["attendance"] # table 2
