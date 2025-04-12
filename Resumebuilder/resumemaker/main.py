from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Tuple
import uuid
from pdf_generator import generate_pdf

app = FastAPI(title="Resume PDF Generator API")

# Enable CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema using Pydantic
class ResumeDetails(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    objective: str
    education: List[Tuple[str, str, str, str]]  # (degree, institution, year, cgpa)
    skills: List[str]
    projects: List[Tuple[str, str]]  # (title, description)
    certifications: List[str]
    activities: List[str]

# Resume generation endpoint
@app.post("/generate-resume")
def create_resume(details: ResumeDetails):
    # Generate unique filename
    file_name = f"{details.name.replace(' ', '_')}_{uuid.uuid4().hex[:6]}.pdf"
    
    # Generate PDF using helper function
    generate_pdf(details.dict(), output_path=file_name)

    # Return PDF file as response
    return FileResponse(
        path=file_name,
        media_type='application/pdf',
        filename=file_name
    )
