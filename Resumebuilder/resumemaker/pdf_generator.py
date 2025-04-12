# pdf_generator.py
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors

def generate_pdf(details, output_path="resume.pdf"):
    c = canvas.Canvas(output_path, pagesize=A4)
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
    return output_path
