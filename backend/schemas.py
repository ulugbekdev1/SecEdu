from pydantic import BaseModel

class Login(BaseModel):
    username: str
    password: str

class PollCreate(BaseModel):
    question: str
