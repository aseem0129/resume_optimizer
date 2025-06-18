from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

from app.api import resume, job_description, tailoring
from app.core.config import settings
from app.core.database import engine, Base

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Resume Optimizer API",
    description="AI-powered resume tailoring service",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for generated PDFs
os.makedirs("static/pdfs", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include API routes
app.include_router(resume.router, prefix="/api", tags=["resume"])
app.include_router(job_description.router, prefix="/api", tags=["job-description"])
app.include_router(tailoring.router, prefix="/api", tags=["tailoring"])

@app.get("/")
async def root():
    return {"message": "Resume Optimizer API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "resume-optimizer"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 