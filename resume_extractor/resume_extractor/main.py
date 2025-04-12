import os
import re
import spacy
import pdfplumber
import csv
from docx import Document
from sklearn.feature_extraction.text import CountVectorizer

# Load spaCy English model
nlp = spacy.load("en_core_web_sm")

# Function to load skills from 'skills.txt'
def load_skills(skills_file="skills.txt"):
    with open(skills_file, "r", encoding="utf-8") as f:
        return [line.strip() for line in f.readlines()]

# Function to clean text (lowercase, remove punctuation)
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return text

# Function to calculate ATS score by comparing keywords in JD and Resume
def calculate_ats_score(resume_text, jd_text):
    resume_text = clean_text(resume_text)
    jd_text = clean_text(jd_text)

    vectorizer = CountVectorizer().fit([jd_text])
    jd_words = vectorizer.get_feature_names_out()

    match_count = sum(1 for word in jd_words if word in resume_text.split())
    ats_score = (match_count / len(jd_words)) * 100

    return round(ats_score, 2)

# Function to extract text from PDF
def extract_text_from_pdf(path):
    with pdfplumber.open(path) as pdf:
        return "\n".join([page.extract_text() or '' for page in pdf.pages])

# Function to extract text from DOCX
def extract_text_from_docx(path):
    doc = Document(path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_cgpa(text):
    pattern = r'(?i)(CGPA|GPA)[\s:]*([0-9]\.?[0-9]{0,2})'
    return [match[1] for match in re.findall(pattern, text)]


# Function to extract skills from resume
def extract_skills(text, skills_list):
    extracted = []
    doc = nlp(text)
    for token in doc:
        if token.text in skills_list:
            extracted.append(token.text)
    return list(set(extracted))

# Function to extract name from resume
def extract_name(text):
    lines = text.strip().split('\n')
    for line in lines:
        clean_line = line.strip()
        if clean_line:
            return clean_line
    return "Name Not Found"

# Function to extract email from resume
def extract_email(text):
    email_regex = r'[\w\.-]+@[\w\.-]+\.\w+'
    match = re.search(email_regex, text)
    return match.group(0) if match else "Email Not Found"

# Function to extract job title from resume
def extract_title(text):
    doc = nlp(text[:500])  # Only consider first few lines
    for chunk in doc.noun_chunks:
        if len(chunk.text.split()) >= 2 and chunk.root.dep_ in ['attr', 'nsubj']:
            return chunk.text.title()
    return "Title Not Found"

# Function to process the resume
def process_resume(file_path, skills_list, jd_text):
    if file_path.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    elif file_path.endswith(".docx"):
        text = extract_text_from_docx(file_path)
    else:
        print(f"Unsupported format: {file_path}")
        return None

    ats_score = calculate_ats_score(text, jd_text)  # Calculate ATS Score

    return {
        "file": os.path.basename(file_path),
        "name": extract_name(text),
        "email": extract_email(text),
        "title": extract_title(text),
        "skills": extract_skills(text, skills_list),
        "cgpas": extract_cgpa(text),
        "ats_score": ats_score  # Include ATS score in the result
    }

# Main function
def main():
    resumes_folder = "resumes"
    skills_list = load_skills()
    
    # Load Job Description text for ATS scoring
    jd_text = open('job_description.txt', 'r').read()

    results = []

    for filename in os.listdir(resumes_folder):
        filepath = os.path.join(resumes_folder, filename)
        result = process_resume(filepath, skills_list, jd_text)
        if result:
            results.append(result)
            print(f"--- {result['file']} ---")
            print("Name:", result["name"])
            print("Email:", result["email"])
            print("Title:", result["title"])
            print("Skills:", result["skills"])
            print("CGPA(s):", result["cgpas"])
            print("ATS Score:", result["ats_score"])
            print()

    # Save to CSV
    with open("extracted_data_with_ats.csv", "w", newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=["file", "name", "email", "title", "skills", "cgpas", "ats_score"])
        writer.writeheader()
        for row in results:
            writer.writerow({
                "file": row["file"],
                "name": row["name"],
                "email": row["email"],
                "title": row["title"],
                "skills": ", ".join(row["skills"]),
                "cgpas": ", ".join(row["cgpas"]),
                "ats_score": row["ats_score"]
            })

    print("✅ Data saved to extracted_data_with_ats.csv")

if __name__ == "__main__":
    main()
