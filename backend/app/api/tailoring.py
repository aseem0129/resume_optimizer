from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import json

from app.core.database import get_db, Resume, JobDescription, TailoredResume
from app.models.schemas import TailoringRequest, TailoringResponse, DownloadResponse
from app.services.ai_service import AIService
from app.utils.pdf_generator import PDFGenerator

router = APIRouter()

@router.post("/tailor-resume", response_model=TailoringResponse)
async def tailor_resume(
    request: TailoringRequest,
    db: Session = Depends(get_db)
):
    """Tailor resume for specific job description"""
    
    try:
        # Get resume and job description
        resume = db.query(Resume).filter(Resume.id == request.resume_id).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        job_description = db.query(JobDescription).filter(JobDescription.id == request.job_description_id).first()
        if not job_description:
            raise HTTPException(status_code=404, detail="Job description not found")
        
        # Initialize AI service
        ai_service = AIService()
        
        # Get keywords from job description
        keywords = json.loads(job_description.extracted_keywords) if job_description.extracted_keywords else {}
        
        # Tailor resume
        tailored_sections = await ai_service.tailor_resume(
            resume_content=resume.parsed_content,
            job_description=job_description.content,
            keywords=keywords,
            preserve_formatting=request.preserve_formatting
        )
        
        # Combine sections into full content
        tailored_content = "\n\n".join([
            tailored_sections.get("contact", ""),
            tailored_sections.get("summary", ""),
            tailored_sections.get("experience", ""),
            tailored_sections.get("education", ""),
            tailored_sections.get("skills", ""),
            tailored_sections.get("projects", ""),
            tailored_sections.get("certifications", "")
        ]).strip()
        
        # Create database record
        db_tailored = TailoredResume(
            resume_id=request.resume_id,
            job_description_id=request.job_description_id,
            tailored_content=tailored_content,
            is_one_page=tailored_sections.get("estimated_pages", 1.0) <= 1.0
        )
        
        db.add(db_tailored)
        db.commit()
        db.refresh(db_tailored)
        
        return TailoringResponse(
            success=True,
            message="Resume tailored successfully",
            tailored_resume_id=db_tailored.id,
            preview_content=tailored_content[:500] + "..." if len(tailored_content) > 500 else tailored_content,
            estimated_pages=tailored_sections.get("estimated_pages", 1.0)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error tailoring resume: {str(e)}")

@router.post("/generate-pdf/{tailored_resume_id}", response_model=DownloadResponse)
async def generate_pdf(
    tailored_resume_id: int,
    db: Session = Depends(get_db)
):
    """Generate PDF for tailored resume"""
    
    try:
        # Get tailored resume
        tailored_resume = db.query(TailoredResume).filter(TailoredResume.id == tailored_resume_id).first()
        if not tailored_resume:
            raise HTTPException(status_code=404, detail="Tailored resume not found")
        
        # Get original resume for additional context
        original_resume = db.query(Resume).filter(Resume.id == tailored_resume.resume_id).first()
        
        # Initialize PDF generator
        pdf_generator = PDFGenerator()
        
        # Extract sections from tailored content
        sections = pdf_generator.create_resume_data({
            "contact": original_resume.parsed_content.split('\n')[0] if original_resume.parsed_content else "",
            "summary": "",
            "experience": tailored_resume.tailored_content,
            "education": "",
            "skills": "",
            "projects": "",
            "certifications": ""
        })
        
        # Generate PDF
        pdf_filename = pdf_generator.generate_pdf(sections)
        
        # Update database with PDF path
        tailored_resume.pdf_path = pdf_filename
        db.commit()
        
        return DownloadResponse(
            success=True,
            message="PDF generated successfully",
            download_url=f"/api/download/{tailored_resume_id}",
            filename=pdf_filename
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@router.get("/download/{tailored_resume_id}")
async def download_pdf(tailored_resume_id: int, db: Session = Depends(get_db)):
    """Download generated PDF"""
    
    tailored_resume = db.query(TailoredResume).filter(TailoredResume.id == tailored_resume_id).first()
    if not tailored_resume:
        raise HTTPException(status_code=404, detail="Tailored resume not found")
    
    if not tailored_resume.pdf_path:
        raise HTTPException(status_code=404, detail="PDF not generated yet")
    
    pdf_path = os.path.join("static/pdfs", tailored_resume.pdf_path)
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF file not found")
    
    return FileResponse(
        path=pdf_path,
        filename=f"tailored_resume_{tailored_resume_id}.pdf",
        media_type="application/pdf"
    )

@router.get("/tailored-resumes")
async def get_tailored_resumes(db: Session = Depends(get_db)):
    """Get all tailored resumes"""
    
    tailored_resumes = db.query(TailoredResume).order_by(TailoredResume.created_at.desc()).all()
    return tailored_resumes

@router.get("/tailored-resume/{tailored_resume_id}")
async def get_tailored_resume(tailored_resume_id: int, db: Session = Depends(get_db)):
    """Get specific tailored resume"""
    
    tailored_resume = db.query(TailoredResume).filter(TailoredResume.id == tailored_resume_id).first()
    if not tailored_resume:
        raise HTTPException(status_code=404, detail="Tailored resume not found")
    
    return tailored_resume 