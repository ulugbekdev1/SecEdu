from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

SECRET = "SECRET_KEY"
ALGORITHM = "HS256"

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(p):
    return pwd.hash(p)


def verify(p, h):
    return pwd.verify(p, h)


def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=10)
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)


def decode_token(token: str):
    return jwt.decode(token, SECRET, algorithms=[ALGORITHM])