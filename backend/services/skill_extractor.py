import re
from .skill_normalizer import normalize_skill

SKILLS = [
    "Python","C++","Java","JavaScript","TypeScript","HTML","CSS","React","Node.js",
    "Express.js","REST APIs","SQL","MySQL","PostgreSQL","MongoDB","Git/GitHub",
    "Docker","Kubernetes","AWS","Linux","Pandas","NumPy","Matplotlib","Scikit-learn",
    "TensorFlow","PyTorch","OpenCV","Machine Learning","Deep Learning","NLP",
    "Computer Vision","Statistics","Excel","Power BI","Data Visualization",
    "Networking","Web Security","Burp Suite","OWASP","SIEM","Penetration Testing",
    "Cybersecurity","Authentication","FastAPI"
]

def extract_profile(text: str):
    found = []
    low = text.lower()
    for skill in SKILLS:
        if re.search(r"(?<!\w)" + re.escape(skill.lower()) + r"(?!\w)", low):
            found.append(normalize_skill(skill))
    first_line = next((x.strip() for x in text.splitlines() if x.strip()), "Resume Candidate")
    education = ""
    for line in text.splitlines():
        if any(k in line.lower() for k in ["b.e", "b.tech", "bachelor", "mca", "degree", "education"]):
            education = line.strip()
            break
    return {"name": first_line[:120], "education": education[:200], "skills": sorted(set(found)), "text": text}
