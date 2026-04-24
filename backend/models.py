from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    password = Column(String)
    role = Column(String, default="employee")
    full_name = Column(String, nullable=True)
    department = Column(String, nullable=True)


class Material(Base):
    __tablename__ = "materials"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    video_url = Column(String)
    description = Column(String, nullable=True)
    category = Column(String, default="Umumiy")


class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, index=True)
    material_id = Column(Integer, index=True)
    watched = Column(Boolean, default=True)


class Poll(Base):
    __tablename__ = "polls"
    id = Column(Integer, primary_key=True)
    question = Column(String)