from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import json
import time

# ===============================
# 1. Setup Chrome WebDriver
# ===============================
options = Options()
options.add_argument("--headless")         # Run Chrome in headless mode (no UI)
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920,1080")
options.add_argument("--no-sandbox")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# ===============================
# 2. Load the Target Website
# ===============================
url = "https://www.freelancer.com/jobs"
print(f"Opening {url}...")
driver.get(url)
time.sleep(5)  # Allow time for JavaScript to load the jobs

# ===============================
# 3. Parse HTML Using BeautifulSoup
# ===============================
soup = BeautifulSoup(driver.page_source, "html.parser")
job_cards = soup.find_all("div", class_="JobSearchCard-item")

projects = []

# ===============================
# 4. Extract Data from Each Job
# ===============================
for job in job_cards:
    title_tag = job.find("a", class_="JobSearchCard-primary-heading-link")
    title = title_tag.text.strip() if title_tag else "N/A"
    
    description_tag = job.find("p", class_="JobSearchCard-primary-description")
    description = description_tag.text.strip() if description_tag else "N/A"
    
    skills = [skill.text.strip() for skill in job.find_all("a", class_="JobSearchCard-primary-tagsLink")]

    # Budget or price tag (optional)
    price_tag = job.find("div", class_="JobSearchCard-secondary-price")
    price = price_tag.text.strip() if price_tag else "N/A"

    # Append to list
    projects.append({
        "title": title,
        "description": description,
        "skills": skills,
        "budget": price
    })

# ===============================
# 5. Save Data to JSON File
# ===============================
output_file = "freelancer_jobs.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(projects, f, indent=4, ensure_ascii=False)

# ===============================
# 6. Clean Up
# ===============================
driver.quit()
print(f"\n✅ Scraping complete! {len(projects)} jobs saved to {output_file}")
