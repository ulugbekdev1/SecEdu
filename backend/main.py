from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
from database import Base, engine
from deps import get_db, get_current_user
from auth import hash_password, verify, create_token
from schemas import Login, UserCreate, MaterialCreate

app = FastAPI(title="Korporativ Xavfsizlik Platformasi")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


# ---------------- AUTH ----------------
@app.post("/login")
def login(data: Login, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == data.username).first()
    if not user or not verify(data.password, user.password):
        return {"error": "Login yoki parol noto'g'ri"}
    token = create_token({"id": user.id})
    return {
        "token": token,
        "role": user.role,
        "user_id": user.id,
        "full_name": user.full_name or user.username,
        "department": user.department or "",
    }


# ---------------- USERS (admin only) ----------------
@app.get("/users")
def get_users(db: Session = Depends(get_db), current=Depends(get_current_user)):
    if current.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")
    users = db.query(models.User).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "role": u.role,
            "full_name": u.full_name,
            "department": u.department,
        }
        for u in users
    ]


@app.post("/users")
def create_user(data: UserCreate, db: Session = Depends(get_db), current=Depends(get_current_user)):
    if current.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")
    existing = db.query(models.User).filter(models.User.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu username allaqachon mavjud")
    user = models.User(
        username=data.username,
        password=hash_password(data.password),
        role=data.role,
        full_name=data.full_name,
        department=data.department,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "username": user.username, "role": user.role}


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current=Depends(get_current_user)):
    if current.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    db.delete(user)
    db.commit()
    return {"ok": True}


# ---------------- MATERIALS ----------------
@app.get("/materials")
def get_materials(db: Session = Depends(get_db)):
    return db.query(models.Material).all()


@app.post("/materials")
def create_material(data: MaterialCreate, db: Session = Depends(get_db), current=Depends(get_current_user)):
    if current.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")
    mat = models.Material(
        title=data.title,
        video_url=data.video_url,
        description=data.description,
        category=data.category,
    )
    db.add(mat)
    db.commit()
    db.refresh(mat)
    return mat


@app.delete("/materials/{material_id}")
def delete_material(material_id: int, db: Session = Depends(get_db), current=Depends(get_current_user)):
    if current.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")
    mat = db.query(models.Material).filter(models.Material.id == material_id).first()
    if not mat:
        raise HTTPException(status_code=404, detail="Material topilmadi")
    db.delete(mat)
    db.commit()
    return {"ok": True}


# ---------------- PROGRESS ----------------
@app.post("/confirm/{material_id}")
def confirm(material_id: int, db: Session = Depends(get_db), current=Depends(get_current_user)):
    progress = db.query(models.Progress).filter_by(
        user_id=current.id,
        material_id=material_id
    ).first()
    if not progress:
        progress = models.Progress(user_id=current.id, material_id=material_id, watched=True)
        db.add(progress)
    else:
        progress.watched = True
    db.commit()
    return {"ok": True}


@app.get("/progress/me")
def get_my_progress(db: Session = Depends(get_db), current=Depends(get_current_user)):
    total = db.query(models.Material).count()
    watched = db.query(models.Progress).filter_by(user_id=current.id, watched=True).count()
    percent = (watched / total * 100) if total > 0 else 0
    return {"total": total, "watched": watched, "progress": round(percent, 2)}


@app.get("/progress/{user_id}")
def get_progress(user_id: int, db: Session = Depends(get_db)):
    total = db.query(models.Material).count()
    watched = db.query(models.Progress).filter_by(user_id=user_id, watched=True).count()
    percent = (watched / total * 100) if total > 0 else 0
    return {"total": total, "watched": watched, "progress": round(percent, 2)}


# ---------------- STATS (admin) ----------------
@app.get("/stats")
def get_stats(db: Session = Depends(get_db), current=Depends(get_current_user)):
    if current.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")
    total_users = db.query(models.User).filter(models.User.role == "employee").count()
    total_materials = db.query(models.Material).count()
    completed_users = (
        db.query(models.Progress.user_id)
        .filter(models.Progress.watched == True)
        .distinct()
        .count()
    )
    return {
        "total_users": total_users,
        "total_materials": total_materials,
        "completed_users": completed_users,
    }