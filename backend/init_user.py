from database import SessionLocal
import models
from auth import hash_password

db = SessionLocal()

user = models.User(
    username="ali",
    password=hash_password("1234"),
    role="admin"
)

db.add(user)
db.commit()

print("User yaratildi!")