from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from sentence_transformers import SentenceTransformer, util
import fitz  # PyMuPDF
import json
import tempfile

app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')


def extract_text_from_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()


def calculate_match_score(profile_text, job_description):
    profile_embedding = model.encode(profile_text, convert_to_tensor=True)
    job_embedding = model.encode(job_description, convert_to_tensor=True)
    score = util.pytorch_cos_sim(profile_embedding, job_embedding)
    return score.item()


@app.post("/recommend_jobs")
async def recommend_top_jobs(
    resume: UploadFile = File(...),
    jobs_json: UploadFile = File(...),
    top_n: int = 8
):
    try:
        # Save resume temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_resume:
            temp_resume.write(await resume.read())
            resume_path = temp_resume.name

        # Save JSON temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as temp_json:
            temp_json.write(await jobs_json.read())
            json_path = temp_json.name

        # Extract resume text
        freelancer_profile = extract_text_from_pdf(resume_path)

        # Load job descriptions
        with open(json_path, 'r', encoding='utf-8') as file:
            jobs_data = json.load(file)

        # Calculate scores
        scored_jobs = []
        for job in jobs_data:
            job_description = job.get("description", "")
            score = calculate_match_score(freelancer_profile, job_description)
            scored_jobs.append((score, job))

        # Sort and select top jobs
        scored_jobs.sort(reverse=True, key=lambda x: x[0])
        top_jobs = [
            {
                "title": job["title"],
                "url": job["url"],
                "budget": job["budget"],
                "score": round(score, 4)
            }
            for score, job in scored_jobs[:top_n]
        ]

        return JSONResponse(content={"top_jobs": top_jobs})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
