import openai
from typing import Dict, List, Any, Optional
from app.core.config import settings
import json
import re

class AIService:
    """Service for AI-powered resume tailoring and keyword extraction"""
    
    def __init__(self):
        openai.api_key = settings.openai_api_key
        self.model = settings.gpt_model
        self.max_tokens = settings.max_tokens
        self.temperature = settings.temperature
    
    async def extract_keywords_from_jd(self, job_description: str) -> Dict[str, Any]:
        """Extract keywords and requirements from job description"""
        
        prompt = f"""
        Analyze the following job description and extract:
        1. Key technical skills and technologies
        2. Required qualifications and experience
        3. Preferred qualifications
        4. Job responsibilities
        5. Industry-specific keywords
        
        Job Description:
        {job_description}
        
        Return the analysis as a JSON object with the following structure:
        {{
            "technical_skills": ["skill1", "skill2", ...],
            "required_qualifications": ["qual1", "qual2", ...],
            "preferred_qualifications": ["pref1", "pref2", ...],
            "responsibilities": ["resp1", "resp2", ...],
            "industry_keywords": ["keyword1", "keyword2", ...],
            "experience_level": "entry/mid/senior",
            "job_category": "software_engineering/marketing/sales/etc"
        }}
        """
        
        try:
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=self.max_tokens,
                temperature=0.3
            )
            
            content = response.choices[0].message.content
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                # Fallback parsing
                return self._fallback_keyword_extraction(job_description)
                
        except Exception as e:
            print(f"Error in keyword extraction: {e}")
            return self._fallback_keyword_extraction(job_description)
    
    async def tailor_resume(
        self, 
        resume_content: str, 
        job_description: str, 
        keywords: Dict[str, Any],
        preserve_formatting: bool = True
    ) -> Dict[str, Any]:
        """Tailor resume content for specific job description"""
        
        # Extract resume sections
        sections = self._extract_resume_sections(resume_content)
        
        prompt = f"""
        You are an expert resume writer. Tailor the following resume for the job description provided.
        
        Job Description:
        {job_description}
        
        Extracted Keywords and Requirements:
        {json.dumps(keywords, indent=2)}
        
        Current Resume Sections:
        {json.dumps(sections, indent=2)}
        
        Instructions:
        1. Rewrite each section to better match the job requirements
        2. Use keywords from the job description naturally
        3. Emphasize relevant experience and skills
        4. Remove or minimize irrelevant content
        5. Ensure the resume fits on one page (approximately 500-600 words total)
        6. Maintain professional tone and formatting
        7. Focus on achievements and quantifiable results
        
        Return the tailored resume as a JSON object with the following structure:
        {{
            "contact": "contact information",
            "summary": "tailored professional summary",
            "experience": "tailored work experience",
            "education": "education section",
            "skills": "tailored skills section",
            "projects": "relevant projects (if any)",
            "certifications": "relevant certifications (if any)",
            "word_count": 500,
            "estimated_pages": 1.0
        }}
        """
        
        try:
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=self.max_tokens,
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            
            if json_match:
                tailored_sections = json.loads(json_match.group())
                return tailored_sections
            else:
                return self._fallback_tailoring(resume_content, keywords)
                
        except Exception as e:
            print(f"Error in resume tailoring: {e}")
            return self._fallback_tailoring(resume_content, keywords)
    
    def _extract_resume_sections(self, resume_content: str) -> Dict[str, str]:
        """Extract sections from resume content"""
        
        sections = {
            "contact": "",
            "summary": "",
            "experience": "",
            "education": "",
            "skills": "",
            "projects": "",
            "certifications": ""
        }
        
        # Simple section extraction
        lines = resume_content.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Detect section headers
            lower_line = line.lower()
            if any(keyword in lower_line for keyword in ['contact', 'personal', 'info']):
                current_section = 'contact'
            elif any(keyword in lower_line for keyword in ['summary', 'objective', 'profile']):
                current_section = 'summary'
            elif any(keyword in lower_line for keyword in ['experience', 'work', 'employment']):
                current_section = 'experience'
            elif any(keyword in lower_line for keyword in ['education', 'academic', 'degree']):
                current_section = 'education'
            elif any(keyword in lower_line for keyword in ['skills', 'technologies', 'tools']):
                current_section = 'skills'
            elif any(keyword in lower_line for keyword in ['projects', 'portfolio']):
                current_section = 'projects'
            elif any(keyword in lower_line for keyword in ['certifications', 'certificates']):
                current_section = 'certifications'
            
            if current_section:
                sections[current_section] += line + "\n"
        
        # Clean up sections
        for section in sections:
            sections[section] = sections[section].strip()
        
        return sections
    
    def _fallback_keyword_extraction(self, job_description: str) -> Dict[str, Any]:
        """Fallback keyword extraction using simple text analysis"""
        
        # Common technical skills
        tech_skills = [
            'python', 'javascript', 'java', 'react', 'node.js', 'sql', 'aws', 'docker',
            'kubernetes', 'machine learning', 'ai', 'data analysis', 'agile', 'scrum'
        ]
        
        # Common soft skills
        soft_skills = [
            'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
            'project management', 'customer service', 'sales', 'marketing'
        ]
        
        found_skills = []
        found_soft_skills = []
        
        lower_jd = job_description.lower()
        
        for skill in tech_skills:
            if skill in lower_jd:
                found_skills.append(skill)
        
        for skill in soft_skills:
            if skill in lower_jd:
                found_soft_skills.append(skill)
        
        return {
            "technical_skills": found_skills,
            "required_qualifications": [],
            "preferred_qualifications": [],
            "responsibilities": [],
            "industry_keywords": found_soft_skills,
            "experience_level": "mid",
            "job_category": "general"
        }
    
    def _fallback_tailoring(self, resume_content: str, keywords: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback resume tailoring"""
        
        sections = self._extract_resume_sections(resume_content)
        
        # Simple keyword integration
        if keywords.get("technical_skills"):
            skills_text = ", ".join(keywords["technical_skills"][:10])
            sections["skills"] = f"Technical Skills: {skills_text}\n{sections['skills']}"
        
        return {
            **sections,
            "word_count": len(resume_content.split()),
            "estimated_pages": 1.0
        } 