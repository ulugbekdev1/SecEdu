from fastapi import Depends, HTTPException
from jose import jwt
from database import SessionLocal
from models import User
from auth import SECRET, ALGORITHM

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user(token: str, db=Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
    except:
        raise HTTPException(401)

    user = db.query(User).filter(User.id == payload["id"]).first()
    return user
