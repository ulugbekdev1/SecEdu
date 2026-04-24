from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import models
from database import Base, engine
from deps import get_db
from auth import hash_password, verify, create_token
from schemas import Login, PollCreate

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# ---------------- LOGIN ----------------
@app.post("/login")
def login(data: Login, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.username == data.username
    ).first()

    if not user or not verify(data.password, user.password):
        return {"error": "login error"}

    token = create_token({"id": user.id})

    return {
        "token": token,
        "role": user.role  # 🔥 SHU MUHIM
    }

# ---------------- MATERIALS ----------------
@app.get("/materials")
def materials(db: Session = Depends(get_db)):
    return db.query(models.Material).all()


# ---------------- PROGRESS (WATCH) ----------------
@app.post("/confirm/{material_id}")
def confirm(material_id: int, db: Session = Depends(get_db)):
    user_id = 1

    progress = db.query(models.Progress).filter_by(
        user_id=user_id,
        material_id=material_id
    ).first()

    if not progress:
        progress = models.Progress(
            user_id=user_id,
            material_id=material_id,
            watched=True
        )
        db.add(progress)
    else:
        progress.watched = True

    db.commit()
    return {"ok": True}
# ---------------- PROGRESS GET ----------------
@app.get("/progress/{user_id}")
def get_progress(user_id: int, db: Session = Depends(get_db)):

    total = db.query(models.Material).count()

    watched = db.query(models.Progress).filter_by(
        user_id=user_id,
        watched=True
    ).count()

    percent = (watched / total * 100) if total > 0 else 0

    return {
        "total": total,
        "watched": watched,
        "progress": round(percent, 2)
    }