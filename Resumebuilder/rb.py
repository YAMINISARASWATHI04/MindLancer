from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import os

app = FastAPI()

# CORS setup to allow requests from React frontend running on localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile, jd_text: str = Form(...)):
    try:
        # Save the uploaded file
        content = await file.read()
        filename = file.filename
        with open(filename, "wb") as f:
            f.write(content)

        # Simulate extracted info (for now, replace with actual resume parsing)
        details = {
            "name": "John Doe",
            "email": "johndoe@example.com",
            "phone": "+123456789",
            "address": "123, Main Street, City",
            "objective": jd_text,
            "education": [("B.Tech", "XYZ University", "2022", "8.5")],
            "skills": ["Python", "React", "FastAPI"],
            "projects": [("Resume Builder", "Created a resume builder using Python and FastAPI.")],
            "certifications": ["AWS Certified", "Google Data Analytics"],
            "activities": ["Hackathon Winner", "Volunteer at NGO"]
        }

        # Generate the PDF for the resume
        generate_pdf(details)
        return {"message": f"Resume for {details['name']} created successfully."}
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


def generate_pdf(details):
    # Generate PDF from the extracted details
    file_name = f"{details['name'].replace(' ', '_')}_Resume.pdf"
    c = canvas.Canvas(file_name, pagesize=A4)
    width, height = A4
    y = height - 40

    def write_heading(text):
        nonlocal y
        c.setFont("Helvetica-Bold", 14)
        c.setFillColor(colors.darkblue)
        c.drawString(40, y, text)
        y -= 20
        c.setFillColor(colors.black)

    def write_line(text, font="Helvetica", size=11):
        nonlocal y
        c.setFont(font, size)
        for line in text.split('\n'):
            c.drawString(50, y, line)
            y -= 15

    # Header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, y, details['name'])
    y -= 20
    c.setFont("Helvetica", 11)
    c.drawString(40, y, f"{details['email']} | {details['phone']} | {details['address']}")
    y -= 30

    write_heading("Objective")
    write_line(details["objective"])

    write_heading("Education")
    for degree, inst, year, cgpa in details["education"]:
        write_line(f"{degree} - {inst} ({year}) | CGPA: {cgpa}")

    write_heading("Skills")
    write_line(", ".join(details["skills"]))

    write_heading("Projects")
    for title, desc in details["projects"]:
        write_line(f"• {title}: {desc}")

    write_heading("Certifications")
    for cert in details["certifications"]:
        write_line(f"• {cert}")

    write_heading("Extra-Curricular Activities")
    for act in details["activities"]:
        write_line(f"• {act}")

    c.save()
    
