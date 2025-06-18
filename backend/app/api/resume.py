from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os
import aiofiles
from datetime import datetime

from app.core.database import get_db, Resume
from app.models.schemas import UploadResponse, Resume as ResumeSchema
from app.utils.document_parser import DocumentParser
from app.core.config import settings

router = APIRouter()

@router.post("/upload-resume", response_model=UploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and parse resume file"""
    
    try:
        # Validate file size
        if file.size and file.size > settings.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {settings.max_file_size // (1024*1024)}MB"
            )
        
        # Parse document
        parsed_data = await DocumentParser.parse_document(file)
        
        # Save file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(settings.upload_dir, filename)
        
        # Ensure upload directory exists
        os.makedirs(settings.upload_dir, exist_ok=True)
        
        # Save file content
        content = await file.read()
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        # Create database record
        db_resume = Resume(
            filename=file.filename,
            original_content=parsed_data["content"],
            parsed_content=parsed_data["content"],
            file_path=file_path,
            file_type=parsed_data["file_type"]
        )
        
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
        
        return UploadResponse(
            success=True,
            message="Resume uploaded and parsed successfully",
            file_id=db_resume.id,
            filename=file.filename
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading resume: {str(e)}")

@router.get("/resumes", response_model=List[ResumeSchema])
async def get_resumes(db: Session = Depends(get_db)):
    """Get all uploaded resumes"""
    
    resumes = db.query(Resume).order_by(Resume.created_at.desc()).all()
    return resumes

@router.get("/resume/{resume_id}", response_model=ResumeSchema)
async def get_resume(resume_id: int, db: Session = Depends(get_db)):
    """Get specific resume by ID"""
    
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return resume

@router.delete("/resume/{resume_id}")
async def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    """Delete resume by ID"""
    
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Delete file
    if os.path.exists(resume.file_path):
        os.remove(resume.file_path)
    
    # Delete database record
    db.delete(resume)
    db.commit()
    
    return {"success": True, "message": "Resume deleted successfully"} 