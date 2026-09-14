from ..database import Base, engine, SessionLocal
from ..models.models import *
from sqlalchemy import select

ROLES = {
"Frontend Developer": ["HTML","CSS","JavaScript","React","Git/GitHub","REST APIs"],
"Backend Developer": ["Python","Node.js","Express.js","REST APIs","SQL","PostgreSQL","Git/GitHub","Docker","Authentication"],
"Full-Stack Developer": ["HTML","CSS","JavaScript","React","Node.js","Express.js","REST APIs","SQL","PostgreSQL","Git/GitHub","Docker","Authentication"],
"AI/ML Engineer": ["Python","NumPy","Pandas","Statistics","Machine Learning","Scikit-learn","TensorFlow","Deep Learning","NLP","Computer Vision","Git/GitHub"],
"Data Analyst": ["Python","SQL","MySQL","Pandas","NumPy","Statistics","Excel","Power BI","Data Visualization","Git/GitHub"],
"Cybersecurity Analyst": ["Networking","Linux","Web Security","OWASP","Burp Suite","SIEM","Penetration Testing","Python","Cybersecurity","Git/GitHub"],
"Software Engineer": ["Python","JavaScript","SQL","REST APIs","Git/GitHub","Docker","Authentication"],
"Data Scientist": ["Python","NumPy","Pandas","Statistics","SQL","Machine Learning","Scikit-learn","Data Visualization","Git/GitHub"],
"DevOps Engineer": ["Linux","Networking","Git/GitHub","Docker","Python","REST APIs"],
"Cloud Engineer": ["Linux","Networking","Python","Docker","Git/GitHub","REST APIs"],
"QA Automation Engineer": ["Python","JavaScript","SQL","REST APIs","Git/GitHub","Linux"],
"Business Analyst": ["SQL","Excel","Power BI","Statistics","Data Visualization","Git/GitHub"],
"MLOps Engineer": ["Python","Machine Learning","Scikit-learn","TensorFlow","Docker","Git/GitHub","REST APIs","Linux"]
}

WEIGHTS = {s: 1.0 for skills in ROLES.values() for s in skills}
WEIGHTS.update({"React":1.3,"REST APIs":1.4,"Machine Learning":1.5,"Statistics":1.3,"SQL":1.4,"Networking":1.4,"Web Security":1.5,"Python":1.3})
PREREQS = {"Express.js":"Node.js","Node.js":"JavaScript","React":"JavaScript","REST APIs":"JavaScript","PostgreSQL":"SQL","Authentication":"REST APIs","Machine Learning":"Statistics","Scikit-learn":"Machine Learning","TensorFlow":"Machine Learning","Deep Learning":"Machine Learning","NLP":"Deep Learning","Computer Vision":"Deep Learning","Power BI":"Data Visualization","Burp Suite":"Web Security","SIEM":"Networking","Penetration Testing":"Networking","Web Security":"Networking"}

RESOURCES = {
"React":("React Official Learn","https://react.dev/learn","Course"),
"JavaScript":("MDN JavaScript Guide","https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide","Guide"),
"Node.js":("Node.js Learn","https://nodejs.org/en/learn","Guide"),
"Express.js":("Express Getting Started","https://expressjs.com/en/starter/installing.html","Guide"),
"SQL":("SQLBolt","https://sqlbolt.com/","Practice"),
"PostgreSQL":("PostgreSQL Tutorial","https://www.postgresql.org/docs/current/tutorial.html","Guide"),
"Python":("Python Tutorial","https://docs.python.org/3/tutorial/","Guide"),
"Machine Learning":("Google ML Crash Course","https://developers.google.com/machine-learning/crash-course","Course"),
"Scikit-learn":("Scikit-learn User Guide","https://scikit-learn.org/stable/user_guide.html","Guide"),
"TensorFlow":("TensorFlow Tutorials","https://www.tensorflow.org/tutorials","Tutorial"),
"Statistics":("Khan Academy Statistics","https://www.khanacademy.org/math/statistics-probability","Course"),
"Excel":("Microsoft Excel Help","https://support.microsoft.com/excel","Guide"),
"Power BI":("Microsoft Learn Power BI","https://learn.microsoft.com/training/powerplatform/power-bi/","Course"),
"Data Visualization":("Matplotlib Tutorials","https://matplotlib.org/stable/tutorials/index.html","Tutorial"),
"Networking":("Cisco Networking Basics","https://www.netacad.com/courses/networking-basics","Course"),
"Linux":("Linux Command Line","https://ubuntu.com/tutorials/command-line-for-beginners","Tutorial"),
"Web Security":("OWASP Web Security Testing Guide","https://owasp.org/www-project-web-security-testing-guide/","Guide"),
"OWASP":("OWASP Top 10","https://owasp.org/www-project-top-ten/","Guide"),
"Burp Suite":("PortSwigger Web Security Academy","https://portswigger.net/web-security","Practice"),
"SIEM":("Microsoft Sentinel Learning","https://learn.microsoft.com/azure/sentinel/","Course"),
"Git/GitHub":("GitHub Skills","https://skills.github.com/","Practice"),
"Docker":("Docker Get Started","https://docs.docker.com/get-started/","Guide"),
"NumPy":("NumPy Learn","https://numpy.org/learn/","Tutorial"),
"Pandas":("Pandas Getting Started","https://pandas.pydata.org/docs/getting_started/","Guide"),
"NumPy":("NumPy Learn","https://numpy.org/learn/","Tutorial"),
"Deep Learning":("Deep Learning Specialization Resources","https://www.deeplearning.ai/","Course"),
"NLP":("Hugging Face NLP Course","https://huggingface.co/learn/nlp-course/chapter1/1","Course"),
"Computer Vision":("OpenCV Tutorials","https://docs.opencv.org/4.x/d9/df8/tutorial_root.html","Tutorial"),
"Cybersecurity":("OWASP Cybersecurity Resources","https://owasp.org/","Guide"),
}

PROJECTS = [
("Smart Career Dashboard","Build a React dashboard that visualizes job readiness and skill gaps.","Intermediate"),
("REST API Job Tracker","Create a FastAPI/Node API with authentication, SQL and CRUD operations.","Intermediate"),
("ML Salary Predictor","Train and deploy a regression model with Python, Pandas and Scikit-learn.","Intermediate"),
("Sales Analytics Dashboard","Build a Power BI/Excel dashboard from a cleaned business dataset.","Beginner"),
("Web Security Lab","Create a safe local vulnerable app and document OWASP testing findings.","Advanced"),
("Network Threat Detector","Build a Python ML prototype that classifies network traffic anomalies.","Advanced"),
("Computer Vision Attendance","Create a webcam-based vision application using OpenCV and ML.","Intermediate"),
("AI Study Assistant","Build a retrieval-based study assistant with Python and a simple web UI.","Advanced")
]

def get_or_create_skill(db, name):
    s = db.execute(select(Skill).where(Skill.name==name)).scalar_one_or_none()
    if not s:
        s = Skill(name=name, category="Technical"); db.add(s); db.flush()
    return s

def seed():
    Base.metadata.create_all(bind=engine)
    db=SessionLocal()
    for role_name, names in ROLES.items():
        role=db.execute(select(CareerRole).where(CareerRole.name==role_name)).scalar_one_or_none()
        if not role:
            role=CareerRole(name=role_name, description=f"Personalized readiness analysis for {role_name}.")
            db.add(role); db.flush()
        for name in names:
            skill=get_or_create_skill(db,name)
            if not db.execute(select(RoleSkill).where(RoleSkill.role_id==role.id,RoleSkill.skill_id==skill.id)).scalar_one_or_none():
                prereq=get_or_create_skill(db,PREREQS[name]) if name in PREREQS else None
                db.add(RoleSkill(role_id=role.id,skill_id=skill.id,importance=WEIGHTS.get(name,1.0),prerequisite_id=prereq.id if prereq else None))
    for skill_name, (title,url,typ) in RESOURCES.items():
        skill=get_or_create_skill(db,skill_name)
        if not db.execute(select(Resource).where(Resource.skill_id==skill.id,Resource.title==title)).scalar_one_or_none():
            db.add(Resource(skill_id=skill.id,title=title,url=url,resource_type=typ,is_free=True))
    for title,desc,diff in PROJECTS:
        if not db.execute(select(Project).where(Project.title==title)).scalar_one_or_none():
            p=Project(title=title,description=desc,difficulty=diff); db.add(p); db.flush()
            # connect project to up to 3 relevant skills by keywords
            keywords = {
                "Smart Career Dashboard":["React","JavaScript","Data Visualization"],
                "REST API Job Tracker":["REST APIs","SQL","Authentication","FastAPI"],
                "ML Salary Predictor":["Python","Pandas","Scikit-learn","Machine Learning"],
                "Sales Analytics Dashboard":["Excel","Power BI","Data Visualization"],
                "Web Security Lab":["Web Security","OWASP","Burp Suite"],
                "Network Threat Detector":["Networking","Python","Machine Learning"],
                "Computer Vision Attendance":["OpenCV","Computer Vision","Python"],
                "AI Study Assistant":["Python","NLP","Machine Learning"]
            }[title]
            for k in keywords:
                s=get_or_create_skill(db,k); db.add(ProjectSkill(project_id=p.id,skill_id=s.id))
    db.commit(); db.close()
    print("AI SkillGap database seeded successfully.")

if __name__ == "__main__":
    seed()
