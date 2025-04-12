from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import json
import fitz  # PyMuPDF
from sentence_transformers import SentenceTransformer, util
from typing import List

# Initialize FastAPI app

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace "*" with your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the SentenceTransformer model once
model = SentenceTransformer('all-MiniLM-L6-v2')

# Helper: Extract text from PDF
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()

# Helper: Compute cosine similarity score
def calculate_match_score(freelancer_profile, job_description):
    profile_embedding = model.encode(freelancer_profile, convert_to_tensor=True)
    job_embedding = model.encode(job_description, convert_to_tensor=True)
    score = util.pytorch_cos_sim(profile_embedding, job_embedding)
    return score.item()

# API Endpoint: Upload resume and job data
@app.post("/recommend-jobs/")
async def recommend_jobs(resume: UploadFile = File(...), jobs_json: UploadFile = File(...), top_n: int = 8):
    # Save the uploaded resume to a temporary file
    resume_path = f"temp_resume_{resume.filename}"
    with open(resume_path, "wb") as f:
        f.write(await resume.read())

    # Extract resume text
    freelancer_profile = extract_text_from_pdf(resume_path)

    # Load job data from uploaded JSON file
    jobs_data = json.loads(await jobs_json.read())

    # Score each job
    scored_jobs = []
    for job in jobs_data:
        job_description = job.get("description", "")
        score = calculate_match_score(freelancer_profile, job_description)
        scored_jobs.append((score, job))

    # Sort and get top matches
    scored_jobs.sort(reverse=True, key=lambda x: x[0])
    top_jobs = scored_jobs[:top_n]

    # Build response
    response = [
        {
            "title": job['title'],
            "url": job['url'],
            "budget": job['budget'],
            "match_score": round(score, 4)
        }
        for score, job in top_jobs
    ]

    return JSONResponse(content={"top_jobs": response})
