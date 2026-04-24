from pydantic import BaseModel
from typing import Optional


class Login(BaseModel):
    username: str
    password: str


class UserCreate(BaseModel):
    username: str
    password: str
    full_name: Optional[str] = None
    department: Optional[str] = None
    role: str = "employee"


class MaterialCreate(BaseModel):
    title: str
    video_url: str
    description: Optional[str] = None
    category: str = "Umumiy"


class PollCreate(BaseModel):
    question: str