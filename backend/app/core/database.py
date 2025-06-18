from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from app.core.config import settings

# Create database engine
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Models
class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    original_content = Column(Text, nullable=False)
    parsed_content = Column(Text, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    extracted_keywords = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TailoredResume(Base):
    __tablename__ = "tailored_resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, nullable=False)
    job_description_id = Column(Integer, nullable=False)
    tailored_content = Column(Text, nullable=False)
    pdf_path = Column(String, nullable=True)
    is_one_page = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow) 