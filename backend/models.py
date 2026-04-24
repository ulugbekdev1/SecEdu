from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    password = Column(String)
    role = Column(String)


class Material(Base):
    __tablename__ = "materials"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    video_url = Column(String)


class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, index=True)
    material_id = Column(Integer, index=True)

    watched = Column(Boolean, default=True)   # FIXED


class Poll(Base):
    __tablename__ = "polls"
    id = Column(Integer, primary_key=True)
    question = Column(String)