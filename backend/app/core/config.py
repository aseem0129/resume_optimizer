from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # API Configuration
    api_v1_str: str = "/api/v1"
    project_name: str = "Resume Optimizer"
    
    # Database
    database_url: str = "sqlite:///./resume_optimizer.db"
    
    # OpenAI Configuration
    openai_api_key: str
    
    # File Upload Configuration
    upload_dir: str = "uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: list = [".pdf", ".docx", ".txt"]
    
    # PDF Generation
    pdf_output_dir: str = "static/pdfs"
    
    # Security
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # AI Configuration
    gpt_model: str = "gpt-4"
    max_tokens: int = 4000
    temperature: float = 0.7
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Ensure directories exist
os.makedirs(settings.upload_dir, exist_ok=True)
os.makedirs(settings.pdf_output_dir, exist_ok=True) 