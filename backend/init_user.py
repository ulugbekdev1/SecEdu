from database import SessionLocal
import models
from auth import hash_password

db = SessionLocal()

users = [
    models.User(username="admin",    password=hash_password("Admin@2025"),  role="admin",    full_name="Administrator",       department="IT"),
    models.User(username="ali",      password=hash_password("Ali@1234"),    role="employee", full_name="Ali Karimov",           department="IT bo'limi"),
    models.User(username="malika",   password=hash_password("Malika@1234"), role="employee", full_name="Malika Yusupova",       department="Moliya bo'limi"),
    models.User(username="jasur",    password=hash_password("Jasur@1234"),  role="employee", full_name="Jasur Toshmatov",       department="HR bo'limi"),
    models.User(username="nodira",   password=hash_password("Nodira@1234"), role="employee", full_name="Nodira Xasanova",       department="Marketing"),
    models.User(username="sardor",   password=hash_password("Sardor@1234"), role="employee", full_name="Sardor Rahimov",        department="Boshqaruv"),
]

for u in users:
    existing = db.query(models.User).filter(models.User.username == u.username).first()
    if not existing:
        db.add(u)

db.commit()
db.close()
print("Foydalanuvchilar yaratildi!")
print("Admin: admin / Admin@2025")