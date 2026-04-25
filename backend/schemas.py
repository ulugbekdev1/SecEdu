from pydantic import BaseModel
from typing import Optional, List


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
    video_url: Optional[str] = None
    description: Optional[str] = None
    category: str = "Umumiy"
    file_path: Optional[str] = None


class PollCreate(BaseModel):
    question: str


class QuestionCreate(BaseModel):
    question: str
    options: List[str]
    answer: int
    explanation: Optional[str] = None
    category: str = "Umumiy"