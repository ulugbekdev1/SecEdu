from database import SessionLocal
import models

db = SessionLocal()

# Material qo‘shamiz
m1 = models.Material(
    title="Python asoslari",
    video_url="https://youtube.com"
)

m2 = models.Material(
    title="FastAPI dars",
    video_url="https://youtube.com"
)

# Poll qo‘shamiz
p1 = models.Poll(
    question="FastAPI yoqdimi?"
)

db.add_all([m1, m2, p1])
db.commit()

print("Data qo‘shildi!")