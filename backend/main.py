from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import text
import models, shutil, os
from datetime import datetime
from database import Base, engine
from deps import get_db, get_current_user
from auth import hash_password, verify, create_token
from schemas import Login, UserCreate, MaterialCreate, QuestionCreate

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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

# Migration: add file_path column to existing DB
with engine.connect() as _conn:
    try:
        _conn.execute(text("ALTER TABLE materials ADD COLUMN file_path VARCHAR"))
        _conn.commit()
    except Exception:
        pass  # already exists

app.mount("/files", StaticFiles(directory=UPLOAD_DIR), name="files")


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


@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...), current=Depends(get_current_user)):
    if current.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")
    allowed = {".pdf", ".doc", ".docx", ".pptx", ".xlsx", ".txt", ".zip", ".png", ".jpg", ".jpeg"}
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail="Ruxsat etilmagan fayl turi")
    filename = f"{int(datetime.utcnow().timestamp())}_{file.filename}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"filename": filename}


@app.post("/materials")
def create_material(data: MaterialCreate, db: Session = Depends(get_db), current=Depends(get_current_user)):
    if current.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")
    mat = models.Material(
        title=data.title,
        video_url=data.video_url,
        description=data.description,
        category=data.category,
        file_path=data.file_path,
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


# ---------------- QUESTIONS ----------------
@app.get("/questions")
def get_questions(db: Session = Depends(get_db)):
    return db.query(models.Question).all()


@app.post("/questions")
def create_question(data: QuestionCreate, db: Session = Depends(get_db), current=Depends(get_current_user)):
    if current.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")
    q = models.Question(
        question=data.question,
        options=data.options,
        answer=data.answer,
        explanation=data.explanation,
        category=data.category,
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return q


@app.delete("/questions/{q_id}")
def delete_question(q_id: int, db: Session = Depends(get_db), current=Depends(get_current_user)):
    if current.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")
    q = db.query(models.Question).filter(models.Question.id == q_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Savol topilmadi")
    db.delete(q)
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
    rows = db.query(models.Progress).filter_by(user_id=current.id, watched=True).all()
    watched_ids = [r.material_id for r in rows]
    percent = (len(watched_ids) / total * 100) if total > 0 else 0
    return {
        "total": total,
        "watched": len(watched_ids),
        "progress": round(percent, 2),
        "watched_ids": watched_ids,
    }


@app.get("/progress/{user_id}")
def get_progress(user_id: int, db: Session = Depends(get_db)):
    total = db.query(models.Material).count()
    watched = db.query(models.Progress).filter_by(user_id=user_id, watched=True).count()
    percent = (watched / total * 100) if total > 0 else 0
    return {"total": total, "watched": watched, "progress": round(percent, 2)}


# ---------------- QUIZ RESULTS ----------------
@app.post("/quiz-result")
def save_quiz_result(score: int, total: int, db: Session = Depends(get_db), current=Depends(get_current_user)):
    result = models.QuizResult(user_id=current.id, score=score, total=total)
    db.add(result)
    db.commit()
    return {"ok": True}


# ---------------- ADMIN: xodimlar natijasi ----------------
@app.get("/admin/report")
def admin_report(db: Session = Depends(get_db), current=Depends(get_current_user)):
    if current.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")

    employees = db.query(models.User).filter(models.User.role == "employee").all()
    materials = db.query(models.Material).all()
    total_materials = len(materials)

    report = []
    for emp in employees:
        watched_rows = db.query(models.Progress).filter_by(user_id=emp.id, watched=True).all()
        watched_ids = {r.material_id for r in watched_rows}

        quiz_results = (
            db.query(models.QuizResult)
            .filter_by(user_id=emp.id)
            .order_by(models.QuizResult.created_at.desc())
            .all()
        )

        materials_detail = [
            {"id": m.id, "title": m.title, "category": m.category, "watched": m.id in watched_ids}
            for m in materials
        ]

        report.append({
            "user": {
                "id": emp.id,
                "username": emp.username,
                "full_name": emp.full_name or emp.username,
                "department": emp.department or "",
            },
            "materials": {
                "watched": len(watched_ids),
                "total": total_materials,
                "percent": round(len(watched_ids) / total_materials * 100, 1) if total_materials > 0 else 0,
                "detail": materials_detail,
            },
            "quiz": {
                "attempts": len(quiz_results),
                "last_score": quiz_results[0].score if quiz_results else None,
                "last_total": quiz_results[0].total if quiz_results else None,
                "best_score": max((r.score for r in quiz_results), default=None),
            },
        })

    return report


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