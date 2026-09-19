ALIASES = {
    "reactjs": "React", "react.js": "React", "react js": "React",
    "node": "Node.js", "nodejs": "Node.js", "node js": "Node.js",
    "postgres": "PostgreSQL", "postgresql": "PostgreSQL",
    "restful api": "REST APIs", "restful apis": "REST APIs", "rest api": "REST APIs",
    "apis": "REST APIs", "ml": "Machine Learning", "machine learning": "Machine Learning",
    "tensor flow": "TensorFlow", "tensorflow": "TensorFlow",
    "github": "Git/GitHub", "git": "Git/GitHub", "sklearn": "Scikit-learn",
    "scikit learn": "Scikit-learn", "powerbi": "Power BI", "power bi": "Power BI",
    "mongo": "MongoDB", "mongodb": "MongoDB", "mysql": "MySQL",
    "python": "Python", "c++": "C++", "cpp": "C++", "javascript": "JavaScript",
    "js": "JavaScript", "typescript": "TypeScript", "html": "HTML", "css": "CSS",
    "fast api": "FastAPI", "fastapi": "FastAPI", "express": "Express.js",
    "expressjs": "Express.js", "sql": "SQL", "java": "Java", "docker": "Docker",
    "kubernetes": "Kubernetes", "linux": "Linux", "aws": "AWS",
    "pandas": "Pandas", "numpy": "NumPy", "matplotlib": "Matplotlib",
    "tensorflow": "TensorFlow", "pytorch": "PyTorch", "opencv": "OpenCV",
    "networking": "Networking", "web security": "Web Security",
    "burp suite": "Burp Suite", "owasp": "OWASP", "siem": "SIEM",
    "penetration testing": "Penetration Testing", "cybersecurity": "Cybersecurity",
    "data visualization": "Data Visualization", "excel": "Excel",
    "statistics": "Statistics", "nlp": "NLP", "deep learning": "Deep Learning",
    "computer vision": "Computer Vision", "authentication": "Authentication"
}

def normalize_skill(name: str) -> str:
    key = " ".join(name.strip().lower().split())
    return ALIASES.get(key, name.strip())
