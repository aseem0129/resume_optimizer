# Resume Optimizer

An AI-powered application that tailors resumes for specific job descriptions while maintaining clean formatting and ensuring one-page output.

## 🚀 Features

### Core Features (MVP)
- **Resume + JD Upload**: Support for PDF, DOCX, and plain text formats
- **AI Tailoring Engine**: Extracts keywords and matches resume content to job requirements
- **Format Preservation**: Maintains original layout while optimizing content
- **PDF Export**: Download tailored resumes as professional PDFs
- **One-Page Enforcement**: Ensures final output fits on a single page

### Tech Stack
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Python FastAPI with async support
- **AI**: OpenAI GPT-4 for content tailoring and keyword extraction
- **Document Processing**: python-docx, PyMuPDF, pdfplumber
- **PDF Generation**: WeasyPrint for clean, ATS-friendly PDFs
- **Database**: SQLite for development (easily upgradable to PostgreSQL)

## 📁 Project Structure

```
resume_optimizer/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── styles/         # CSS and Tailwind styles
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Configuration and core utilities
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── requirements.txt
│   └── main.py
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- OpenAI API key

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Environment Variables
Create `.env.local` in the frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create `.env` in the backend directory:
```
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./resume_optimizer.db
```

### Running the Application
1. Start the backend:
```bash
cd backend
uvicorn main:app --reload
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

3. Open http://localhost:3000 in your browser

## 🎯 Usage

1. **Upload Resume**: Drag and drop or select your resume file (PDF/DOCX)
2. **Add Job Description**: Paste or upload the job description
3. **AI Processing**: The system analyzes both documents and tailors your resume
4. **Review & Download**: Preview the optimized resume and download as PDF

## 🔧 Development

### API Endpoints
- `POST /api/upload-resume`: Upload and parse resume
- `POST /api/upload-job-description`: Process job description
- `POST /api/tailor-resume`: Generate tailored resume
- `GET /api/download/{resume_id}`: Download optimized PDF

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 