import os
from weasyprint import HTML, CSS
from jinja2 import Template
from typing import Dict, Any
from app.core.config import settings
import uuid

class PDFGenerator:
    """Generate professional PDF resumes from tailored content"""
    
    def __init__(self):
        self.template_dir = os.path.join(os.path.dirname(__file__), "templates")
        self.output_dir = settings.pdf_output_dir
        os.makedirs(self.output_dir, exist_ok=True)
    
    def generate_pdf(self, resume_data: Dict[str, Any], template_name: str = "professional") -> str:
        """Generate PDF from resume data"""
        
        # Load template
        template_path = os.path.join(self.template_dir, f"{template_name}.html")
        
        if not os.path.exists(template_path):
            template_path = os.path.join(self.template_dir, "professional.html")
        
        with open(template_path, 'r') as f:
            template_content = f.read()
        
        # Render template with data
        template = Template(template_content)
        html_content = template.render(**resume_data)
        
        # Generate unique filename
        filename = f"resume_{uuid.uuid4().hex[:8]}.pdf"
        output_path = os.path.join(self.output_dir, filename)
        
        # Generate PDF
        HTML(string=html_content).write_pdf(
            output_path,
            stylesheets=[self._get_css_styles()]
        )
        
        return filename
    
    def _get_css_styles(self) -> CSS:
        """Get CSS styles for professional resume formatting"""
        
        css_content = """
        @page {
            size: A4;
            margin: 0.75in;
            @top-center {
                content: "";
            }
            @bottom-center {
                content: "";
            }
        }
        
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 10px;
        }
        
        .name {
            font-size: 24pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        
        .contact-info {
            font-size: 10pt;
            color: #666;
            margin-bottom: 5px;
        }
        
        .section {
            margin-bottom: 15px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #2c3e50;
            border-bottom: 1px solid #bdc3c7;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .job-title {
            font-weight: bold;
            color: #2c3e50;
            font-size: 12pt;
        }
        
        .company {
            font-weight: bold;
            color: #34495e;
        }
        
        .date {
            color: #7f8c8d;
            font-style: italic;
        }
        
        .job-description {
            margin-left: 20px;
            margin-top: 5px;
        }
        
        .job-description ul {
            margin: 5px 0;
            padding-left: 20px;
        }
        
        .job-description li {
            margin-bottom: 3px;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .skill-item {
            background-color: #ecf0f1;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 10pt;
        }
        
        .education-item {
            margin-bottom: 8px;
        }
        
        .degree {
            font-weight: bold;
            color: #2c3e50;
        }
        
        .school {
            color: #34495e;
        }
        
        .summary {
            font-style: italic;
            color: #555;
            margin-bottom: 15px;
        }
        
        .project-item {
            margin-bottom: 10px;
        }
        
        .project-title {
            font-weight: bold;
            color: #2c3e50;
        }
        
        .certification-item {
            margin-bottom: 5px;
        }
        
        .certification-name {
            font-weight: bold;
            color: #2c3e50;
        }
        
        .certification-issuer {
            color: #7f8c8d;
        }
        
        /* Ensure one page layout */
        .resume-container {
            max-height: 100vh;
            overflow: hidden;
        }
        
        /* Responsive adjustments */
        @media print {
            body {
                font-size: 10pt;
            }
            
            .name {
                font-size: 20pt;
            }
            
            .section-title {
                font-size: 12pt;
            }
        }
        """
        
        return CSS(string=css_content)
    
    def create_resume_data(self, sections: Dict[str, str]) -> Dict[str, Any]:
        """Convert sections to structured data for template"""
        
        # Parse contact information
        contact_lines = sections.get("contact", "").split('\n')
        name = contact_lines[0] if contact_lines else "Your Name"
        email = ""
        phone = ""
        location = ""
        
        for line in contact_lines[1:]:
            line = line.strip().lower()
            if '@' in line:
                email = line
            elif any(char.isdigit() for char in line):
                phone = line
            elif any(word in line for word in ['street', 'avenue', 'road', 'drive', 'lane']):
                location = line
        
        # Parse experience
        experience_items = []
        experience_text = sections.get("experience", "")
        if experience_text:
            # Simple parsing - can be enhanced
            experience_items = [{"title": "Experience", "content": experience_text}]
        
        # Parse education
        education_items = []
        education_text = sections.get("education", "")
        if education_text:
            education_items = [{"degree": "Education", "school": education_text}]
        
        # Parse skills
        skills = []
        skills_text = sections.get("skills", "")
        if skills_text:
            skills = [skill.strip() for skill in skills_text.split(',') if skill.strip()]
        
        return {
            "name": name,
            "email": email,
            "phone": phone,
            "location": location,
            "summary": sections.get("summary", ""),
            "experience_items": experience_items,
            "education_items": education_items,
            "skills": skills,
            "projects": sections.get("projects", ""),
            "certifications": sections.get("certifications", "")
        } 