from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import os
import re
import spacy
import pdfplumber
from docx import Document
from sklearn.feature_extraction.text import CountVectorizer
from fastapi.middleware.cors import CORSMiddleware

nlp = spacy.load("en_core_web_sm")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or replace "*" with your frontend URL for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load spaCy model




# Load skills from file
def load_skills(skills_file="skills.txt"):
    with open(skills_file, "r", encoding="utf-8") as f:
        return [line.strip() for line in f.readlines()]

skills_list = load_skills()

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return text

def calculate_ats_score(resume_text, jd_text):
    resume_text = clean_text(resume_text)
    jd_text = clean_text(jd_text)

    vectorizer = CountVectorizer().fit([jd_text])
    jd_words = vectorizer.get_feature_names_out()

    match_count = sum(1 for word in jd_words if word in resume_text.split())
    ats_score = (match_count / len(jd_words)) * 100
    return round(ats_score, 2)

def extract_text_from_pdf(file):
    with pdfplumber.open(file) as pdf:
        return "\n".join([page.extract_text() or '' for page in pdf.pages])

def extract_text_from_docx(file):
    doc = Document(file)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_cgpa(text):
    pattern = r'(?i)(CGPA|GPA)[\s:]*([0-9]\.?[0-9]{0,2})'
    return [match[1] for match in re.findall(pattern, text)]

def extract_skills(text, skills_list):
    extracted = []
    doc = nlp(text)
    for token in doc:
        if token.text.lower() in skills_list:
            extracted.append(token.text)
    return list(set(extracted))

def extract_name(text):
    lines = text.strip().split('\n')
    for line in lines:
        clean_line = line.strip()
        if clean_line:
            return clean_line
    return "Name Not Found"

def extract_email(text):
    email_regex = r'[\w\.-]+@[\w\.-]+\.\w+'
    match = re.search(email_regex, text)
    return match.group(0) if match else "Email Not Found"

def extract_title(text):
    doc = nlp(text[:500])
    for chunk in doc.noun_chunks:
        if len(chunk.text.split()) >= 2 and chunk.root.dep_ in ['attr', 'nsubj']:
            return chunk.text.title()
    return "Title Not Found"

def process_resume_file(file: UploadFile, jd_text: str):
    # Save temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(file.file.read())

    # Extract text
    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(temp_path)
    elif file.filename.endswith(".docx"):
        text = extract_text_from_docx(temp_path)
    else:
        os.remove(temp_path)
        return JSONResponse(content={"error": "Unsupported file format"}, status_code=400)

    os.remove(temp_path)

    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "title": extract_title(text),
        "skills": extract_skills(text, skills_list),
        "cgpas": extract_cgpa(text),
        "ats_score": calculate_ats_score(text, jd_text)
    }

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...), jd_text: str = Form(...)):
    result = process_resume_file(file, jd_text)
    return result
