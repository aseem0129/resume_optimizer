from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Resume Schemas
class ResumeBase(BaseModel):
    filename: str
    original_content: str
    parsed_content: str
    file_type: str

class ResumeCreate(ResumeBase):
    pass

class Resume(ResumeBase):
    id: int
    file_path: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Job Description Schemas
class JobDescriptionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    company: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=10)

class JobDescriptionCreate(JobDescriptionBase):
    pass

class JobDescription(JobDescriptionBase):
    id: int
    extracted_keywords: Optional[str] = None
    requirements: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Tailored Resume Schemas
class TailoredResumeBase(BaseModel):
    resume_id: int
    job_description_id: int
    tailored_content: str
    is_one_page: bool = True

class TailoredResumeCreate(TailoredResumeBase):
    pass

class TailoredResume(TailoredResumeBase):
    id: int
    pdf_path: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# API Response Schemas
class UploadResponse(BaseModel):
    success: bool
    message: str
    file_id: Optional[int] = None
    filename: Optional[str] = None

class TailoringRequest(BaseModel):
    resume_id: int
    job_description_id: int
    preserve_formatting: bool = True
    target_length: Optional[str] = "one_page"

class TailoringResponse(BaseModel):
    success: bool
    message: str
    tailored_resume_id: Optional[int] = None
    preview_content: Optional[str] = None
    estimated_pages: Optional[float] = None

class DownloadResponse(BaseModel):
    success: bool
    message: str
    download_url: Optional[str] = None
    filename: Optional[str] = None

# Error Response Schema
class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: Optional[str] = None 