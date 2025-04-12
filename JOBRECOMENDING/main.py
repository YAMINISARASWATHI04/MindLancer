import json
import fitz  # PyMuPDF
from sentence_transformers import SentenceTransformer, util

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()

def calculate_match_score(freelancer_profile, job_description):
    profile_embedding = model.encode(freelancer_profile, convert_to_tensor=True)
    job_embedding = model.encode(job_description, convert_to_tensor=True)
    score = util.pytorch_cos_sim(profile_embedding, job_embedding)
    return score.item()

def recommend_top_jobs(json_file, resume_path, top_n=8):
    # Extract resume text
    freelancer_profile = extract_text_from_pdf(resume_path)

    # Load jobs
    with open(json_file, 'r', encoding='utf-8') as file:
        jobs_data = json.load(file)

    # Compute scores
    scored_jobs = []
    for job in jobs_data:
        job_description = job.get("description", "")
        score = calculate_match_score(freelancer_profile, job_description)
        scored_jobs.append((score, job))

    # Sort and select top jobs
    scored_jobs.sort(reverse=True, key=lambda x: x[0])
    top_jobs = scored_jobs[:top_n]

    # Print top jobs
    print("🔍 Top Recommended Freelancer Jobs:\n")
    for idx, (score, job) in enumerate(top_jobs, 1):
        print(f"{idx}. {job['title']}")
        print(f"   URL: {job['url']}")
        print(f"   Budget: {job['budget']}")
        print()

# Run it
if __name__ == "__main__":
    recommend_top_jobs("multi_tab_freelancer_jobs.json", "Vivek_s_Resume (2) (1).pdf", top_n=8)
