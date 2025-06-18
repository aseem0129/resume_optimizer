from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from app.core.database import get_db, JobDescription
from app.models.schemas import JobDescriptionCreate, JobDescription as JobDescriptionSchema
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/upload-job-description", response_model=JobDescriptionSchema)
async def upload_job_description(
    job_description: JobDescriptionCreate,
    db: Session = Depends(get_db)
):
    """Upload and process job description"""
    
    try:
        # Initialize AI service
        ai_service = AIService()
        
        # Extract keywords and requirements
        keywords_data = await ai_service.extract_keywords_from_jd(job_description.content)
        
        # Create database record
        db_jd = JobDescription(
            title=job_description.title,
            company=job_description.company,
            content=job_description.content,
            extracted_keywords=json.dumps(keywords_data),
            requirements=json.dumps({
                "required": keywords_data.get("required_qualifications", []),
                "preferred": keywords_data.get("preferred_qualifications", [])
            })
        )
        
        db.add(db_jd)
        db.commit()
        db.refresh(db_jd)
        
        return db_jd
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing job description: {str(e)}")

@router.get("/job-descriptions", response_model=List[JobDescriptionSchema])
async def get_job_descriptions(db: Session = Depends(get_db)):
    """Get all job descriptions"""
    
    job_descriptions = db.query(JobDescription).order_by(JobDescription.created_at.desc()).all()
    return job_descriptions

@router.get("/job-description/{jd_id}", response_model=JobDescriptionSchema)
async def get_job_description(jd_id: int, db: Session = Depends(get_db)):
    """Get specific job description by ID"""
    
    jd = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
    if not jd:
        raise HTTPException(status_code=404, detail="Job description not found")
    
    return jd

@router.delete("/job-description/{jd_id}")
async def delete_job_description(jd_id: int, db: Session = Depends(get_db)):
    """Delete job description by ID"""
    
    jd = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
    if not jd:
        raise HTTPException(status_code=404, detail="Job description not found")
    
    # Delete database record
    db.delete(jd)
    db.commit()
    
    return {"success": True, "message": "Job description deleted successfully"}

@router.get("/job-description/{jd_id}/keywords")
async def get_job_keywords(jd_id: int, db: Session = Depends(get_db)):
    """Get extracted keywords for a job description"""
    
    jd = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
    if not jd:
        raise HTTPException(status_code=404, detail="Job description not found")
    
    if jd.extracted_keywords:
        return json.loads(jd.extracted_keywords)
    else:
        return {"message": "No keywords extracted yet"} 