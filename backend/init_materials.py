from database import SessionLocal
import models

db = SessionLocal()

materials = [
    models.Material(
        title="Parol xavfsizligi",
        video_url="https://www.youtube.com/watch?v=3NjQ9b3pgIg"
    ),
    models.Material(
        title="Phishing hujumlari",
        video_url="https://www.youtube.com/watch?v=XBkzBrXlle0"
    ),
    models.Material(
        title="Internet xavfsizligi",
        video_url="https://www.youtube.com/watch?v=2eQ0cQq3X9Y"
    ),
]

for m in materials:
    db.add(m)

db.commit()
db.close()

print("Materiallar qo‘shildi!")