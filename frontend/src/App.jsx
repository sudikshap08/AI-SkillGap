import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  BrainCircuit,
  ChevronRight,
  CheckCircle2,
  Gauge,
  LayoutDashboard,
  Target,
  Upload,
  Sparkles,
  BookOpen,
  FolderKanban,
  SlidersHorizontal,
  X,
  Search,
  ArrowUpRight,
  Menu,
  UserRound
} from "lucide-react";

import {
  createUser,
  getCareers,
  resumeAnalyze,
  runAnalysis,
  whatIf
} from "./api";


/* =========================================================
   SKILL LIBRARY
========================================================= */

const SKILL_LIBRARY = {
  "Programming": [
    "Python",
    "C++",
    "Java",
    "JavaScript",
    "TypeScript"
  ],

  "Web Development": [
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "Express.js",
    "REST APIs",
    "FastAPI"
  ],

  "Data & AI": [
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Statistics",
    "Machine Learning",
    "Scikit-learn",
    "TensorFlow",
    "PyTorch",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "Data Visualization"
  ],

  "Databases": [
    "SQL",
    "MySQL",
    "PostgreSQL",
    "MongoDB"
  ],

  "Cloud & Tools": [
    "Git/GitHub",
    "Docker",
    "Kubernetes",
    "AWS",
    "Linux",
    "Excel",
    "Power BI"
  ],

  "Cybersecurity": [
    "Networking",
    "Web Security",
    "OWASP",
    "Burp Suite",
    "SIEM",
    "Penetration Testing",
    "Cybersecurity",
    "Authentication"
  ]
};


const LEVELS = [
  "Beginner",
  "Basic",
  "Intermediate",
  "Strong"
];


const LEVEL_HINT = {
  Beginner: "Just starting",
  Basic: "Know the basics",
  Intermediate: "Can work independently",
  Strong: "Confident & project-ready"
};


/* =========================================================
   FALLBACK CAREERS
   Used if backend API temporarily fails
========================================================= */
const FALLBACK_CAREERS = [
  {
    id: 1,
    name: "Frontend Developer",
    description: "Build modern user interfaces and web applications.",
    skills: [
      { id: 1, name: "HTML", importance: 1.0 },
      { id: 2, name: "CSS", importance: 1.0 },
      { id: 3, name: "JavaScript", importance: 1.0 },
      { id: 4, name: "React", importance: 1.3 },
      { id: 5, name: "Git/GitHub", importance: 1.0 },
      { id: 6, name: "REST APIs", importance: 1.4 }
    ]
  },
  {
    id: 2,
    name: "Backend Developer",
    description: "Build server-side applications, APIs and databases.",
    skills: [
      { id: 7, name: "Python", importance: 1.3 },
      { id: 8, name: "Node.js", importance: 1.0 },
      { id: 9, name: "Express.js", importance: 1.0 },
      { id: 6, name: "REST APIs", importance: 1.4 },
      { id: 10, name: "SQL", importance: 1.4 },
      { id: 11, name: "PostgreSQL", importance: 1.0 },
      { id: 5, name: "Git/GitHub", importance: 1.0 },
      { id: 12, name: "Docker", importance: 1.0 },
      { id: 13, name: "Authentication", importance: 1.0 }
    ]
  },
  {
    id: 3,
    name: "Full-Stack Developer",
    description: "Build complete frontend and backend applications.",
    skills: [
      { id: 1, name: "HTML", importance: 1.0 },
      { id: 2, name: "CSS", importance: 1.0 },
      { id: 3, name: "JavaScript", importance: 1.0 },
      { id: 4, name: "React", importance: 1.3 },
      { id: 8, name: "Node.js", importance: 1.0 },
      { id: 9, name: "Express.js", importance: 1.0 },
      { id: 6, name: "REST APIs", importance: 1.4 },
      { id: 10, name: "SQL", importance: 1.4 },
      { id: 11, name: "PostgreSQL", importance: 1.0 },
      { id: 5, name: "Git/GitHub", importance: 1.0 },
      { id: 12, name: "Docker", importance: 1.0 },
      { id: 13, name: "Authentication", importance: 1.0 }
    ]
  },
  {
    id: 4,
    name: "AI/ML Engineer",
    description: "Build machine learning and AI solutions.",
    skills: [
      { id: 7, name: "Python", importance: 1.3 },
      { id: 14, name: "NumPy", importance: 1.0 },
      { id: 15, name: "Pandas", importance: 1.0 },
      { id: 16, name: "Statistics", importance: 1.3 },
      { id: 17, name: "Machine Learning", importance: 1.5 },
      { id: 18, name: "Scikit-learn", importance: 1.0 },
      { id: 19, name: "TensorFlow", importance: 1.0 },
      { id: 20, name: "Deep Learning", importance: 1.0 },
      { id: 21, name: "NLP", importance: 1.0 },
      { id: 22, name: "Computer Vision", importance: 1.0 },
      { id: 5, name: "Git/GitHub", importance: 1.0 }
    ]
  },
  {
    id: 5,
    name: "Data Analyst",
    description: "Analyze data and generate actionable insights.",
    skills: [
      { id: 7, name: "Python", importance: 1.3 },
      { id: 10, name: "SQL", importance: 1.4 },
      { id: 23, name: "MySQL", importance: 1.0 },
      { id: 15, name: "Pandas", importance: 1.0 },
      { id: 14, name: "NumPy", importance: 1.0 },
      { id: 16, name: "Statistics", importance: 1.3 },
      { id: 24, name: "Excel", importance: 1.0 },
      { id: 25, name: "Power BI", importance: 1.0 },
      { id: 26, name: "Data Visualization", importance: 1.0 },
      { id: 5, name: "Git/GitHub", importance: 1.0 }
    ]
  },
  {
    id: 6,
    name: "Cybersecurity Analyst",
    description: "Identify vulnerabilities and protect applications and systems.",
    skills: [
      { id: 27, name: "Networking", importance: 1.4 },
      { id: 28, name: "Linux", importance: 1.0 },
      { id: 29, name: "Web Security", importance: 1.5 },
      { id: 30, name: "OWASP", importance: 1.0 },
      { id: 31, name: "Burp Suite", importance: 1.0 },
      { id: 32, name: "SIEM", importance: 1.0 },
      { id: 33, name: "Penetration Testing", importance: 1.0 },
      { id: 7, name: "Python", importance: 1.3 },
      { id: 34, name: "Cybersecurity", importance: 1.0 },
      { id: 5, name: "Git/GitHub", importance: 1.0 }
    ]
  },
  {
    id: 7,
    name: "Software Engineer",
    description: "Design, develop and maintain software applications.",
    skills: [
      { id: 7, name: "Python", importance: 1.3 },
      { id: 3, name: "JavaScript", importance: 1.0 },
      { id: 10, name: "SQL", importance: 1.4 },
      { id: 6, name: "REST APIs", importance: 1.4 },
      { id: 5, name: "Git/GitHub", importance: 1.0 },
      { id: 12, name: "Docker", importance: 1.0 },
      { id: 13, name: "Authentication", importance: 1.0 }
    ]
  },
  {
    id: 8,
    name: "Data Scientist",
    description: "Use data science and machine learning to solve complex problems.",
    skills: [
      { id: 7, name: "Python", importance: 1.3 },
      { id: 14, name: "NumPy", importance: 1.0 },
      { id: 15, name: "Pandas", importance: 1.0 },
      { id: 16, name: "Statistics", importance: 1.3 },
      { id: 10, name: "SQL", importance: 1.4 },
      { id: 17, name: "Machine Learning", importance: 1.5 },
      { id: 18, name: "Scikit-learn", importance: 1.0 },
      { id: 26, name: "Data Visualization", importance: 1.0 },
      { id: 5, name: "Git/GitHub", importance: 1.0 }
    ]
  },
  {
    id: 9,
    name: "DevOps Engineer",
    description: "Automate software delivery and manage development infrastructure.",
    skills: [
      { id: 28, name: "Linux", importance: 1.0 },
      { id: 27, name: "Networking", importance: 1.4 },
      { id: 5, name: "Git/GitHub", importance: 1.0 },
      { id: 12, name: "Docker", importance: 1.0 },
      { id: 7, name: "Python", importance: 1.3 },
      { id: 6, name: "REST APIs", importance: 1.4 }
    ]
  },
  {
    id: 10,
    name: "Cloud Engineer",
    description: "Design and manage scalable cloud infrastructure and services.",
    skills: [
      { id: 28, name: "Linux", importance: 1.0 },
      { id: 27, name: "Networking", importance: 1.4 },
      { id: 7, name: "Python", importance: 1.3 },
      { id: 12, name: "Docker", importance: 1.0 },
      { id: 5, name: "Git/GitHub", importance: 1.0 },
      { id: 6, name: "REST APIs", importance: 1.4 }
    ]
  },
  {
    id: 11,
    name: "QA Automation Engineer",
    description: "Build automated tests to improve software quality and reliability.",
    skills: [
      { id: 7, name: "Python", importance: 1.3 },
      { id: 3, name: "JavaScript", importance: 1.0 },
      { id: 10, name: "SQL", importance: 1.4 },
      { id: 6, name: "REST APIs", importance: 1.4 },
      { id: 5, name: "Git/GitHub", importance: 1.0 },
      { id: 28, name: "Linux", importance: 1.0 }
    ]
  },
  {
    id: 12,
    name: "Business Analyst",
    description: "Analyze business requirements, data and processes to support decisions.",
    skills: [
      { id: 10, name: "SQL", importance: 1.4 },
      { id: 24, name: "Excel", importance: 1.0 },
      { id: 25, name: "Power BI", importance: 1.0 },
      { id: 16, name: "Statistics", importance: 1.3 },
      { id: 26, name: "Data Visualization", importance: 1.0 },
      { id: 5, name: "Git/GitHub", importance: 1.0 }
    ]
  },
  {
    id: 13,
    name: "MLOps Engineer",
    description: "Deploy, monitor and maintain machine learning systems in production.",
    skills: [
      { id: 7, name: "Python", importance: 1.3 },
      { id: 17, name: "Machine Learning", importance: 1.5 },
      { id: 18, name: "Scikit-learn", importance: 1.0 },
      { id: 19, name: "TensorFlow", importance: 1.0 },
      { id: 12, name: "Docker", importance: 1.0 },
      { id: 5, name: "Git/GitHub", importance: 1.0 },
      { id: 6, name: "REST APIs", importance: 1.4 },
      { id: 28, name: "Linux", importance: 1.0 }
    ]
  }
];

/* =========================================================
   LAYOUT
========================================================= */

function Layout() {

  const location = useLocation();

  const [open, setOpen] = useState(false);

  const links = [
    ["/", "Dashboard", LayoutDashboard],
    ["/analyze", "Analyze Skills", Gauge],
    ["/roadmap", "Roadmap", Target],
    ["/resources", "Resources", BookOpen],
    ["/projects", "Projects", FolderKanban],
    ["/what-if", "What-If", SlidersHorizontal],
  ];

  return (
    <div className="app-shell">

      <aside className={`sidebar ${open ? "open" : ""}`}>

        <div className="brand">

          <div className="brand-icon">
            <BrainCircuit size={23} />
          </div>

          <div>
            <b>AI SkillGap</b>
            <small>Career Intelligence</small>
          </div>

          <button
            className="mobile-close"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>

        </div>


        <nav>

          {links.map(([to, label, Icon]) => (

            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >

              <Icon size={18} />

              {label}

            </NavLink>

          ))}

        </nav>


        <div className="sidebar-bottom">
          <Sparkles size={16} />
          <span>AI-assisted career planning</span>
        </div>

      </aside>


      {open && (
        <div
          className="mobile-overlay"
          onClick={() => setOpen(false)}
        />
      )}


      <main className="main">

        <button
          className="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <Menu size={21} />
        </button>


        <AppDataProvider>
<Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/analyze"
            element={<Analyze />}
          />

          <Route
            path="/roadmap"
            element={<Roadmap />}
          />

          <Route
            path="/resources"
            element={<Resources />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/what-if"
            element={<WhatIf />}
          />

        </Routes>
</AppDataProvider>

      </main>

    </div>
  );
}


/* =========================================================
   GLOBAL APP DATA
========================================================= */

const AppDataContext = React.createContext(null);

function AppDataProvider({ children }) {
  const [data, setData] = useState(null);

  // Only keep the user ID for backend association.
  // Analysis/readiness/resume state is intentionally reset on refresh.
  const [userId, setUserId] = useState(
    () => localStorage.getItem("skillgap_user_id")
  );

  useEffect(() => {
    if (userId) {
      localStorage.setItem("skillgap_user_id", userId);
    }
  }, [userId]);

  return (
    <AppDataContext.Provider value={{ data, setData, userId, setUserId }}>
      {children}
    </AppDataContext.Provider>
  );
}

function useAppData() {
  return React.useContext(AppDataContext);
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {

  const { data } = useAppData();

  const navigate = useNavigate();


  if (!data) {

    return (

      <div className="dashboard-home">

        <div className="hero-card">

          <div className="hero-copy">

            <span className="eyebrow">
              PERSONALIZED CAREER INTELLIGENCE
            </span>

            <h1>
              Know where you stand.
              <br />
              <span>Know what to learn next.</span>
            </h1>

            <p>
              Measure your readiness for a target career,
              understand your skill gaps, and follow a
              roadmap built around what you already know.
            </p>

            <button
              className="primary"
              onClick={() => navigate("/analyze")}
            >
              Start my career analysis
              <ChevronRight size={18} />
            </button>

          </div>


          <div className="hero-visual">

            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="hero-icon">
              <BrainCircuit size={58} />
            </div>

            <div className="floating-pill pill-one">
              ✓ Skill analysis
            </div>

            <div className="floating-pill pill-two">
              ↗ Personalized roadmap
            </div>

          </div>

        </div>


        <div className="feature-grid">

          <Feature
            icon={<Gauge />}
            title="Readiness score"
            text="A weighted score based on the skills your target role actually needs."
          />

          <Feature
            icon={<Target />}
            title="Skill-gap priorities"
            text="See what is strong, what needs improvement, and what is missing."
          />

          <Feature
            icon={<BookOpen />}
            title="Matched resources"
            text="Learning resources are linked directly to your roadmap steps."
          />

        </div>

      </div>

    );
  }


  return (

    <div>

      <header className="topbar">

        <div>

          <span className="eyebrow">
            YOUR CAREER DASHBOARD
          </span>

          <h1>{data.role}</h1>

    

        </div>


        <button
          className="primary"
          onClick={() => navigate("/analyze")}
        >
          New analysis
          <Sparkles size={17} />
        </button>

      </header>


      <div className="stats-grid">

        <Stat
          icon={<Gauge />}
          title="Career readiness"
          value={`${data.score}%`}
        />

        <Stat
          icon={<Target />}
          title="Skills to improve"
          value={
            data.improvement.length +
            data.missing.length
          }
        />

        <Stat
          icon={<BookOpen />}
          title="Roadmap steps"
          value={data.roadmap.length}
        />

        <Stat
          icon={<FolderKanban />}
          title="Projects"
          value={data.projects.length}
        />

      </div>


      <div className="dashboard-grid">

        <div className="panel readiness-card">

          <div>

            <span className="eyebrow">
              READINESS
            </span>

            <h2>{data.score}%</h2>

            <p>
              You're building toward{" "}
              <b>{data.role}</b>.
            </p>

          </div>

          <ScoreRing score={data.score} />

        </div>


        <div className="panel">

          <SectionHeading
            title="Skill gap overview"
          />

          <div className="mini-bars">

            <Bar
              label="Strong"
              count={data.strong.length}
              total={data.gaps.length}
              kind="strong"
            />

            <Bar
              label="Improving"
              count={data.improvement.length}
              total={data.gaps.length}
              kind="improve"
            />

            <Bar
              label="Missing"
              count={data.missing.length}
              total={data.gaps.length}
              kind="missing"
            />

          </div>


          <button
            className="text-button"
            onClick={() => navigate("/roadmap")}
          >
            View personalized roadmap
            <ArrowUpRight size={16} />
          </button>

        </div>

      </div>


      <div className="ai-intelligence-grid">

        <div className="panel ai-insight-card">
          <div className="ai-card-heading">
            <div className="ai-card-icon"><Sparkles size={18} /></div>
            <div>
              <span className="eyebrow">AI CAREER INSIGHT</span>
              <h2>What your profile says</h2>
            </div>
          </div>
          <p>{data.ai_guidance?.summary || "Your profile has been analyzed against the selected career. Focus is generated from your current skill levels and gaps."}</p>
          <div className="ai-strategy">
            <b>Learning strategy</b>
            <span>{data.ai_guidance?.learning_strategy || "Work through the highest-impact gaps and validate each new skill with a practical project."}</span>
          </div>
        </div>

        <div className="panel skill-map-panel">
          <SectionHeading
            title="Your dynamic skill map"
            subtitle={`Mapped from your profile against ${data.role}.`}
          />
          <div className="skill-map-grid">
            {[
              ["Strong foundation", "strong", "skill-map-strong"],
              ["Improvement areas", "improvement", "skill-map-improve"],
              ["Priority gaps", "missing", "skill-map-missing"]
            ].map(([label, key, className]) => (
              <div className={`skill-map-column ${className}`} key={key}>
                <div className="skill-map-label">{label}<span>{data.skill_map?.[key]?.length || 0}</span></div>
                <div className="skill-map-list">
                  {(data.skill_map?.[key] || []).map(item => (
                    <div className="skill-map-item" key={item.skill}>
                      <span>{item.skill}</span>
                      <small>{item.importance >= 1.5 ? "High impact" : item.importance >= 1.3 ? "Important" : "Core"}</small>
                    </div>
                  ))}
                  {!data.skill_map?.[key]?.length && <div className="skill-map-empty">Nothing here yet</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="panel priority-panel">

        <SectionHeading
          title="Your next priorities"
          subtitle="Start with the highest-impact roadmap skills."
        />


        <div className="priority-grid">

          {data.roadmap
            .slice(0, 3)
            .map((x, i) => (

              <div
                className="priority-item"
                key={i}
              >

                <span>{i + 1}</span>

                <div>

                  <b>{x.skill}</b>

                  <small>{x.reason}</small>

                </div>

              </div>

            ))}

        </div>

      </div>

    </div>

  );
}


/* =========================================================
   SMALL UI COMPONENTS
========================================================= */

function Feature({ icon, title, text }) {

  return (

    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>

  );
}


function Stat({ icon, title, value }) {

  return (

    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div>

        <small>{title}</small>

        <strong>{value}</strong>

      </div>

    </div>

  );
}


function ScoreRing({ score }) {

  return (

    <div
      className="score-ring"
      style={{
        "--score": `${score * 3.6}deg`
      }}
    >

      <div>

        <b>{score}%</b>

        <small>ready</small>

      </div>

    </div>

  );
}


function Bar({
  label,
  count,
  total,
  kind
}) {

  const width = total
    ? Math.max(5, (count / total) * 100)
    : 5;


  return (

    <div className="bar-row">

      <div>

        <span>{label}</span>

        <b>{count}</b>

      </div>

      <div
        className={`bar-track ${kind}`}
      >

        <i
          style={{
            width: `${width}%`
          }}
        />

      </div>

    </div>

  );
}


function SectionHeading({
  title,
  subtitle
}) {

  return (

    <div className="section-heading">

      <div>

        <h2>{title}</h2>

        {subtitle && (
          <p>{subtitle}</p>
        )}

      </div>

    </div>

  );
}


function PageTitle({
  eyebrow = "AI SKILLGAP",
  title,
  subtitle,
  action
}) {

  return (

    <div className="page-title">

      <div>

        <span className="eyebrow">
          {eyebrow}
        </span>

        <h1>{title}</h1>

        <p>{subtitle}</p>

      </div>

      {action}

    </div>

  );
}


function Field({
  label,
  children,
  required
}) {

  return (

    <label className="field">

      <span>
        {label}{" "}
        {required && <em>*</em>}
      </span>

      {children}

    </label>

  );
}


/* =========================================================
   ANALYZE PAGE
========================================================= */

function Analyze() {

  const {
    setData,
    setUserId
  } = useAppData();


  const [careers, setCareers] =
    useState([]);


  const [role, setRole] =
    useState("");


  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      education: "",
      specialization: "",
      graduation_year: "2027",
      experience: "Student"
    });


  const [selected, setSelected] =
    useState([]);


  const [levels, setLevels] =
    useState({});


  const [search, setSearch] =
    useState("");


  const [file, setFile] =
    useState(null);


  const [resumeSkills, setResumeSkills] =
    useState([]);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");

  // Start the Analyze screen fresh every time it is opened.
  useEffect(() => {
    setFile(null);
    setResumeSkills([]);
    setSelected([]);
    setLevels({});
    setSearch("");
    setLoading(false);
    setError("");
    setSuccess("");
  }, []);


  /* =====================================================
     LOAD CAREERS
  ===================================================== */

  useEffect(() => {

    getCareers()

      .then(response => {

        const list =
          response?.data?.length
            ? response.data
            : FALLBACK_CAREERS;

        setCareers(list);

        if (list.length > 0) {

          setRole(
            String(list[0].id)
          );

        }

      })

      .catch(err => {

        console.error(
          "Career API failed:",
          err
        );

        /*
          IMPORTANT:
          Even if API fails,
          careers will still appear.
        */

        setCareers(
          FALLBACK_CAREERS
        );

        setRole("1");

        // Keep the local career list as a silent UI fallback.
        // Do not show an "offline" warning during the demo.

      });

  }, []);


  const career =
    careers.find(
      c =>
        String(c.id) ===
        String(role)
    );


  /* =====================================================
     SEARCHABLE SKILLS
  ===================================================== */

  const categories =
    Object.entries(
      SKILL_LIBRARY
    )

      .map(
        ([name, items]) => [

          name,

          items.filter(
            skill =>
              !search ||
              skill
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                )
          )

        ]
      )

      .filter(
        ([, items]) =>
          items.length
      );


  const addSkill = skill => {

    if (!selected.includes(skill)) {

      setSelected([
        ...selected,
        skill
      ]);

    }

    setSearch("");

  };


  const removeSkill = skill => {

    setSelected(
      selected.filter(
        x => x !== skill
      )
    );

  };


  const setLevel = (
    skill,
    level
  ) => {

    setLevels({
      ...levels,
      [skill]: level
    });

  };


  /* =====================================================
     RESUME UPLOAD
  ===================================================== */

  const upload = async file => {

    setFile(file);

    setError("");

    setSuccess("");


    try {

      const response =
        await resumeAnalyze(file);


      const detected =
        response.data.skills || [];


      setResumeSkills(
        detected
      );


      setSelected(prev =>
        Array.from(
          new Set([
            ...prev,
            ...detected
          ])
        )
      );


      if (
        response.data.name &&
        !profile.name
      ) {

        setProfile(p => ({
          ...p,
          name: response.data.name
        }));

      }


      if (
        response.data.education &&
        !profile.education
      ) {

        setProfile(p => ({
          ...p,
          education:
            response.data.education
        }));

      }


      setSuccess(
        `${detected.length} skills detected from your resume.`
      );

    } catch (e) {

      setError(
        e?.response?.data?.detail ||
        "Could not read this PDF."
      );

    }

  };


  /* =====================================================
     ANALYSIS SUBMISSION
  ===================================================== */

  const submit = async e => {

    e.preventDefault();

    setLoading(true);

    setError("");

    setSuccess("");


    try {

      if (
        !profile.name ||
        !profile.email ||
        !role
      ) {

        throw new Error(
          "Please complete your name, email and target career."
        );

      }


      const skills =
        selected.map(name => ({

          name,

          level:
            levels[name] ||
            "Basic"

        }));


      /* Create/update user */

      const user =
        await createUser({

          name: profile.name,

          email: profile.email,

          education:
            `${profile.education}${
              profile.specialization
                ? ` • ${profile.specialization}`
                : ""
            }`,

          skills

        });


      setUserId(
        String(user.data.id)
      );


      /* Run analysis */

      const analysis =
        await runAnalysis({

          user_id: user.data.id,

          role_id: Number(role),

          skills

        });


      setData(
        analysis.data
      );


      setSuccess(
        "Analysis complete — your personalized roadmap is ready."
      );


    } catch (e) {

      console.error(
        "Analysis error:",
        e
      );


      setError(
        e?.response?.data?.detail ||
        e.message ||
        "Could not complete the analysis. Make sure FastAPI and MySQL are running."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div>

      <PageTitle
        title="Build your career profile"
        subtitle="Tell us where you are today. We'll compare your skills with the role you want and build the next steps for you."
      />


      <form
        className="panel form-panel"
        onSubmit={submit}
      >

        {/* PROFILE */}

        <div className="step-head">

          <div className="step-number">
            01
          </div>

          <div>

            <b>Your profile</b>

            <small>
              Basic information used to personalize your analysis
            </small>

          </div>

        </div>


        <div className="form-section">

          <div className="form-grid three">

            <Field
              label="Full name"
              required
            >

              <input
                value={profile.name}
                onChange={e =>
                  setProfile({
                    ...profile,
                    name: e.target.value
                  })
                }
                placeholder="e.g., Sudiksha P"
                required
              />

            </Field>


            <Field
              label="Email address"
              required
            >

              <input
                type="email"
                value={profile.email}
                onChange={e =>
                  setProfile({
                    ...profile,
                    email: e.target.value
                  })
                }
                placeholder="e.g., sudiksha@gmail.com"
                required
              />

            </Field>


            <Field
              label="Education"
              required
            >

              <select
                value={profile.education}
                onChange={e =>
                  setProfile({
                    ...profile,
                    education: e.target.value
                  })
                }
                required
              >

                <option value="">
                  Select your education
                </option>

                <option>
                  B.E / B.Tech
                </option>

                <option>
                  BCA
                </option>

                <option>
                  MCA
                </option>

                <option>
                  M.Tech
                </option>

                <option>
                  B.Sc
                </option>

                <option>
                  Other
                </option>

              </select>

            </Field>


            <Field label="Specialization">

              <select
                value={profile.specialization}
                onChange={e =>
                  setProfile({
                    ...profile,
                    specialization:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Select specialization
                </option>

                <option>
                  Computer Science
                </option>

                <option>
                  Information Science
                </option>

                <option>
                  AI / Machine Learning
                </option>

                <option>
                  Data Science
                </option>

                <option>
                  Cybersecurity
                </option>

                <option>
                  Other
                </option>

              </select>

            </Field>


            <Field label="Graduation year">

              <select
                value={
                  profile.graduation_year
                }
                onChange={e =>
                  setProfile({
                    ...profile,
                    graduation_year:
                      e.target.value
                  })
                }
              >

                {[
                  2026,
                  2027,
                  2028,
                  2029,
                  2030
                ].map(year => (

                  <option key={year}>
                    {year}
                  </option>

                ))}

              </select>

            </Field>


            <Field label="Experience level">

              <select
                value={
                  profile.experience
                }
                onChange={e =>
                  setProfile({
                    ...profile,
                    experience:
                      e.target.value
                  })
                }
              >

                <option>
                  Student
                </option>

                <option>
                  Fresher
                </option>

                <option>
                  0–1 years
                </option>

                <option>
                  1–3 years
                </option>

              </select>

            </Field>

          </div>

        </div>


        {/* CAREER */}

        <div className="step-head">

          <div className="step-number">
            02
          </div>

          <div>

            <b>
              Choose your target career
            </b>

            <small>
              Select the role you're preparing for
            </small>

          </div>

        </div>


        <div className="form-section">

          <div className="career-grid">

            {careers.map(careerItem => (

              <button
                type="button"
                key={careerItem.id}
                className={
                  `career-option ${
                    String(careerItem.id) ===
                    String(role)
                      ? "selected"
                      : ""
                  }`
                }
                onClick={() =>
                  setRole(
                    String(careerItem.id)
                  )
                }
              >

                <div className="career-icon">

                  <Target size={19} />

                </div>


                <div>

                  <b>
                    {careerItem.name}
                  </b>



                </div>


                <ChevronRight size={17} />

              </button>

            ))}

          </div>


          {career && (

            <div className="role-preview">

              <div>

                <b>
                  {career.name}
                </b>

                <span>
                  {career.description}
                </span>

              </div>




            </div>

          )}

        </div>


        {/* RESUME */}

        <div className="step-head">

          <div className="step-number">
            03
          </div>

          <div>

            <b>
              Resume & current skills
            </b>

            <small>
              Upload a resume or select the skills you already know
            </small>

          </div>

        </div>


        <div className="form-section">

          <label className="upload-box">

            <div className="upload-icon">

              <Upload size={22} />

            </div>


            <b>
              {
                file
                  ? file.name
                  : "Drop your PDF resume here"
              }
            </b>


            <span>

              {
                file
                  ? "Resume selected — click to replace"
                  : "or click to browse · PDF only · max 5 MB"
              }

            </span>


            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={e =>
                e.target.files?.[0] &&
                upload(
                  e.target.files[0]
                )
              }
            />

          </label>


          {file && resumeSkills.length > 0 && (

            <div className="detected">

              <CheckCircle2 size={17} />

              <span>

                Detected{" "}
                {resumeSkills.length}{" "}
                skills from your resume.
                We've added them below
                for your review.

              </span>

            </div>

          )}


          {/* SKILLS */}

          <div className="skill-selector">

            <div className="skill-toolbar">

              <div className="search-box">

                <Search size={17} />

                <input
                  value={search}
                  onChange={e =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search skills e.g. Python, React, SQL..."
                />

              </div>


              <span>
                {selected.length} selected
              </span>

            </div>


            {selected.length > 0 && (

              <div className="selected-skills">

                {selected.map(skill => (

                  <span
                    className="skill-chip"
                    key={skill}
                  >

                    {skill}

                    <button
                      type="button"
                      onClick={() =>
                        removeSkill(skill)
                      }
                    >

                      <X size={13} />

                    </button>

                  </span>

                ))}

              </div>

            )}


            <div className="skill-categories">

              {categories.map(
                ([category, items]) => (

                  <div
                    className="skill-category"
                    key={category}
                  >

                    <b>
                      {category}
                    </b>


                    <div>

                      {items.map(skill => (

                        <button
                          type="button"
                          key={skill}
                          className={
                            `skill-option ${
                              selected.includes(
                                skill
                              )
                                ? "chosen"
                                : ""
                            }`
                          }
                          onClick={() =>
                            selected.includes(
                              skill
                            )
                              ? removeSkill(
                                  skill
                                )
                              : addSkill(
                                  skill
                                )
                          }
                        >

                          {
                            selected.includes(
                              skill
                            )
                              ? "✓ "
                              : "+ "
                          }

                          {skill}

                        </button>

                      ))}

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>


        {/* CONFIDENCE */}

        <div className="step-head">

          <div className="step-number">
            04
          </div>

          <div>

            <b>
              Skill confidence
            </b>

            <small>
              Choose your current level for each selected skill
            </small>

          </div>

        </div>


        <div className="form-section">

          <div className="confidence-grid">

            {selected.length
              ? selected.map(skill => (

                  <div
                    className="confidence-card"
                    key={skill}
                  >

                    <div>

                      <b>
                        {skill}
                      </b>

                      <small>
                        {
                          LEVEL_HINT[
                            levels[skill] ||
                            "Basic"
                          ]
                        }
                      </small>

                    </div>


                    <div className="level-pills">

                      {LEVELS.map(level => (

                        <button
                          type="button"
                          key={level}
                          className={
                            (
                              levels[skill] ||
                              "Basic"
                            ) === level
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            setLevel(
                              skill,
                              level
                            )
                          }
                        >

                          {level}

                        </button>

                      ))}

                    </div>

                  </div>

                ))

              : (

                <div className="empty-inline">

                  <UserRound size={20} />

                  <span>
                    Select some skills above
                    to set your confidence levels.
                  </span>

                </div>

              )}

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="error-msg">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >

              <X size={16} />

            </button>

          </div>

        )}


        {/* SUCCESS */}

        {success && (

          <div className="success-msg">

            <CheckCircle2 size={17} />

            {success}

          </div>

        )}


        {/* SUBMIT */}

        <div className="submit-row">

          <div>

            <b>
              Ready to discover your gaps?
            </b>

            <small>
              Your roadmap will be generated
              from your selected career,
              skill levels and prerequisites.
            </small>

          </div>


          <button
            className="primary generate"
            disabled={loading}
          >

            {loading ? (

              <>
                <span className="spinner" />
                Building your roadmap...
              </>

            ) : (

              <>
                Generate my roadmap
                <Sparkles size={18} />
              </>

            )}

          </button>

        </div>

      </form>

    </div>

  );
}


/* =========================================================
   RESULT SHELL
========================================================= */

function ResultShell({
  children
}) {

  const { data } =
    useAppData();

  const navigate =
    useNavigate();


  if (!data) {

    return (

      <Empty
        text="Complete an analysis first to unlock this section."
        action={() =>
          navigate("/analyze")
        }
      />

    );

  }


  return children;
}


/* =========================================================
   ROADMAP
========================================================= */

function Roadmap() {

  return (

    <ResultShell>

      <RoadmapContent />

    </ResultShell>

  );

}


function RoadmapContent() {

  const { data } =
    useAppData();

  const roadmap = Array.isArray(data?.roadmap)
    ? data.roadmap
    : [];

  if (!roadmap.length) {
    return (
      <Empty
        text="No roadmap is available yet. Run a new career analysis to generate your personalized roadmap."
        action={() => window.location.href = "/analyze"}
      />
    );
  }

  return (

    <div>

      <PageTitle
        title="Your personalized roadmap"
        subtitle={`A step-by-step plan for ${data.role}, ordered around your current gaps and prerequisites.`}
        action={
          <div className="roadmap-badge">

            <Target size={17} />

            {roadmap.length} steps

          </div>
        }
      />


      <div className="roadmap-callout">

        <Sparkles size={20} />

        <div>

          <b>
            Start with the first step
          </b>

          <span>
            Each step unlocks the knowledge
            needed for the next one.
            Resources are matched directly
            to these roadmap skills.
          </span>

        </div>

      </div>


      <div className="timeline">

        {roadmap.map(
          (item, index) => (

            <div
              className="timeline-item"
              key={`${item.skill}-${index}`}
            >

              <div className="timeline-marker">

                <span>
                  {String(index + 1)
                    .padStart(2, "0")}
                </span>

              </div>


              <div className="panel roadmap-card">

                <div className="roadmap-top">

                  <div>

                    <span className="phase-label">
                      PHASE {item.phase}
                    </span>

                    <h3>
                      {item.skill}
                    </h3>

                  </div>


                  <span className="difficulty">
                    {item.difficulty}
                  </span>

                </div>


                <p>
                  {item.reason}
                </p>


                {item.resources?.length > 0 && (

                  <div className="mapped-resources">

                    <b>

                      <BookOpen size={15} />

                      Learn with these resources

                    </b>


                    <div>

                      {item.resources.map(
                        (resource, index) => (

                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            key={index}
                          >

                            <span>
                              {resource.type}
                            </span>

                            {resource.title}

                            <ArrowUpRight size={14} />

                          </a>

                        )
                      )}

                    </div>

                  </div>

                )}

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}


/* =========================================================
   RESOURCES
========================================================= */

function Resources() {

  return (

    <ResultShell>

      <ResourcesContent />

    </ResultShell>

  );

}


function ResourcesContent() {

  const { data } =
    useAppData();


  return (

    <div>

      <PageTitle
        title="Resources matched to your roadmap"
        subtitle="No random resource list — every resource below is connected to a skill in your personalized learning plan."
      />


      <div className="resource-phase-list">

        {data.roadmap.map(
          (step, index) => (

            <div
              className="resource-phase"
              key={index}
            >

              <div className="resource-phase-head">

                <span>
                  {String(index + 1)
                    .padStart(2, "0")}
                </span>

                <div>

                  <b>
                    {step.skill}
                  </b>

                  <small>
                    Roadmap phase {step.phase}
                  </small>

                </div>

              </div>


              <div className="resource-grid">

                {(step.resources || [])
                  .map(
                    (resource, index) => (

                      <a
                        className="resource-card"
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        key={index}
                      >

                        <span>
                          {resource.type}
                        </span>

                        <h3>
                          {resource.title}
                        </h3>

                        <p>
                          Matched to{" "}
                          <b>
                            {step.skill}
                          </b>
                        </p>

                        <ArrowUpRight
                          size={17}
                        />

                      </a>

                    )
                  )}


                {!(step.resources || [])
                  .length && (

                  <div className="empty-inline">

                    No curated resource
                    found for this step yet.

                  </div>

                )}

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}


/* =========================================================
   PROJECTS
========================================================= */

const PROJECT_GUIDES = {
  "ML Salary Predictor": {
    idea: "Create an end-to-end machine learning application that predicts an estimated salary from factors such as experience, role, education and location.",
    outcome: "A portfolio project showing data cleaning, model training, evaluation and a small prediction interface.",
    steps: [
      "Find a salary dataset and inspect missing values, duplicates and useful features.",
      "Clean and encode categorical columns such as job role, education and location.",
      "Explore relationships using Pandas and Matplotlib, then split the data into train and test sets.",
      "Train regression models such as Linear Regression, Random Forest or Gradient Boosting.",
      "Compare MAE/RMSE and choose a model based on validation results.",
      "Build a simple Streamlit or React + FastAPI interface where a user enters details and gets a prediction.",
      "Add model limitations, sample predictions and a clear README with screenshots."
    ],
    tools: ["Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Jupyter/Colab", "Streamlit or FastAPI"],
    references: [
      ["Scikit-learn Regression", "https://scikit-learn.org/stable/supervised_learning.html"],
      ["Pandas Getting Started", "https://pandas.pydata.org/docs/getting_started/index.html"],
      ["Streamlit Documentation", "https://docs.streamlit.io/"]
    ]
  },
  "Network Threat Detector": {
    idea: "Build an ML-based prototype that learns normal network behaviour and flags traffic that looks anomalous or suspicious.",
    outcome: "A cybersecurity + ML project that demonstrates feature engineering, classification/anomaly detection and security-focused reporting.",
    steps: [
      "Use a public network intrusion dataset such as CIC-IDS or another documented dataset.",
      "Understand each traffic feature and remove irrelevant or duplicated columns.",
      "Preprocess numeric and categorical features and handle class imbalance where required.",
      "Start with a baseline classifier, then compare models such as Random Forest and Logistic Regression.",
      "Measure precision, recall, F1-score and confusion matrix instead of relying only on accuracy.",
      "Create a small dashboard that accepts traffic features and displays normal/suspicious output.",
      "Document false positives, limitations and safe-use considerations."
    ],
    tools: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "Jupyter/Colab", "FastAPI or Streamlit"],
    references: [
      ["Scikit-learn Classification", "https://scikit-learn.org/stable/supervised_learning.html"],
      ["UNB CIC Datasets", "https://www.unb.ca/cic/datasets/"],
      ["OWASP", "https://owasp.org/"]
    ]
  },
  "AI Study Assistant": {
    idea: "Create a retrieval-based assistant that answers questions from a student's notes, PDFs or study material instead of relying only on general answers.",
    outcome: "A practical GenAI/NLP project with document ingestion, search/retrieval, answer generation and a simple chat UI.",
    steps: [
      "Allow users to upload PDFs or text notes and extract their content.",
      "Clean the text and split long documents into smaller chunks.",
      "Create embeddings for the chunks and store them in a simple vector store.",
      "Retrieve the most relevant chunks for each user question.",
      "Pass the retrieved context to an LLM and instruct it to answer from the provided material.",
      "Show source snippets or document names so answers are easier to verify.",
      "Add features such as summary, quiz generation or flashcards as optional extensions."
    ],
    tools: ["Python", "NLP", "Embeddings", "Vector Store", "FastAPI", "React/Streamlit", "LLM API"],
    references: [
      ["Hugging Face NLP Course", "https://huggingface.co/learn/nlp-course/chapter1/1"],
      ["Sentence Transformers", "https://www.sbert.net/"],
      ["FastAPI Documentation", "https://fastapi.tiangolo.com/"]
    ]
  },
  "Smart Career Dashboard": {
    idea: "Build a dashboard that combines a user's skills, target role, readiness score and learning progress in one place.",
    outcome: "A full-stack portfolio project demonstrating APIs, data visualization, authentication-ready architecture and personalized analytics.",
    steps: [
      "Create a profile page for education, target role and skills.",
      "Store users, skills, roles and progress in a relational database.",
      "Create REST API endpoints for profile, skill analysis and progress updates.",
      "Calculate simple readiness metrics from role requirements and user skills.",
      "Display the results with charts, progress bars and priority recommendations.",
      "Add a learning checklist and update the dashboard when a skill is completed.",
      "Deploy the frontend and backend and document the architecture in the README."
    ],
    tools: ["React", "FastAPI", "Python", "MySQL/PostgreSQL", "REST APIs", "Chart.js/Recharts", "Git/GitHub"],
    references: [
      ["React Documentation", "https://react.dev/"],
      ["FastAPI Documentation", "https://fastapi.tiangolo.com/"],
      ["MDN Web Docs", "https://developer.mozilla.org/"]
    ]
  },
  "Sales Analytics Dashboard": {
    idea: "Turn raw sales data into an interactive dashboard that helps users understand revenue, products, regions and trends.",
    outcome: "A data analytics project demonstrating cleaning, KPI design, visualization and business-oriented insights.",
    steps: [
      "Import a sales CSV or Excel dataset and understand the columns.",
      "Clean dates, missing values, duplicates and inconsistent category names.",
      "Create KPIs such as total sales, profit, average order value and growth.",
      "Build charts for monthly trends, product performance and regional sales.",
      "Add filters for date, product, region and customer segment.",
      "Write 5–10 actionable observations from the dashboard instead of only showing charts.",
      "Publish the dashboard and include the dataset, screenshots and findings in the README."
    ],
    tools: ["Excel", "Power BI", "Python", "Pandas", "Matplotlib", "SQL"],
    references: [
      ["Microsoft Power BI", "https://learn.microsoft.com/power-bi/"],
      ["Pandas Documentation", "https://pandas.pydata.org/docs/"],
      ["Kaggle Datasets", "https://www.kaggle.com/datasets"]
    ]
  },
  "Computer Vision Attendance": {
    idea: "Create a webcam-based attendance prototype that detects known faces and records attendance with date and time.",
    outcome: "A computer vision portfolio project covering image processing, face detection/recognition and database logging.",
    steps: [
      "Collect a small consented dataset of sample faces for the prototype.",
      "Use OpenCV to capture webcam frames and detect faces.",
      "Create face representations using a suitable recognition approach.",
      "Match detected faces against enrolled users with a confidence threshold.",
      "Record name, date and time in CSV or a database while avoiding duplicate attendance.",
      "Build a simple interface showing camera status and today's attendance.",
      "Document privacy, consent, false-match risks and how the prototype should be used."
    ],
    tools: ["Python", "OpenCV", "NumPy", "SQLite/MySQL", "Streamlit or FastAPI"],
    references: [
      ["OpenCV Documentation", "https://docs.opencv.org/"],
      ["OpenCV Python Tutorials", "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html"],
      ["NumPy Documentation", "https://numpy.org/doc/stable/"]
    ]
  },
  "REST API Job Tracker": {
    idea: "Build a job application tracker where users can add applications, update interview stages and view their job-search progress through APIs.",
    outcome: "A backend-focused project demonstrating CRUD, REST API design, database modelling, validation and frontend integration.",
    steps: [
      "Design tables for users, companies, jobs and application status.",
      "Create REST endpoints for create, read, update and delete operations.",
      "Add validation for job title, company, application date and status.",
      "Connect the API to MySQL/PostgreSQL and test endpoints with Postman.",
      "Build a simple React interface with filters for Applied, Test, Interview, Offer and Rejected.",
      "Add summary metrics such as total applications and interviews.",
      "Document API endpoints and example requests in the README."
    ],
    tools: ["FastAPI", "Python", "MySQL", "REST APIs", "Postman", "React", "Git/GitHub"],
    references: [
      ["FastAPI Documentation", "https://fastapi.tiangolo.com/"],
      ["Postman Learning Center", "https://learning.postman.com/docs/getting-started/overview/"],
      ["MDN HTTP Overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"]
    ]
  },
  "Web Security Lab": {
    idea: "Create a safe local security-learning environment and document how common web vulnerabilities can be identified and mitigated.",
    outcome: "A hands-on application-security project showing methodology, evidence collection, remediation and responsible testing.",
    steps: [
      "Set up a deliberately vulnerable local application such as OWASP Juice Shop or DVWA.",
      "Map the application attack surface and identify test cases.",
      "Use Burp Suite or OWASP ZAP to inspect requests and responses in the local lab.",
      "Study vulnerabilities such as injection, broken access control and insecure authentication in the lab only.",
      "Capture safe evidence such as request details and screenshots without targeting real systems.",
      "Explain the root cause and a secure remediation for each finding.",
      "Create a professional report with severity, impact, reproduction summary and remediation."
    ],
    tools: ["Burp Suite", "OWASP ZAP", "OWASP Juice Shop/DVWA", "Kali Linux", "Git/GitHub"],
    references: [
      ["OWASP Top 10", "https://owasp.org/www-project-top-ten/"],
      ["OWASP Juice Shop", "https://owasp.org/www-project-juice-shop/"],
      ["PortSwigger Web Security Academy", "https://portswigger.net/web-security"]
    ]
  }
};

function Projects() {
  return (
    <ResultShell>
      <ProjectsContent />
    </ResultShell>
  );
}

function ProjectsContent() {
  const { data } = useAppData();
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div>
      <PageTitle
        title="Projects that close your gaps"
        subtitle="Turn your missing skills into practical portfolio projects with a clear idea, build plan, tools and references."
      />

      <div className="project-helper">
        <div className="project-helper-icon"><Sparkles size={18} /></div>
        <div>
          <b>How to use these ideas</b>
          <span>Open any project to see what to build, a step-by-step plan, suggested tools and references. Start with the project that matches the skills you want to improve.</span>
        </div>
      </div>

      <div className="project-grid">
        {data.projects.map((project, index) => {
          const guide = PROJECT_GUIDES[project.title];
          return (
            <div className="project-card" key={index}>
              <div className="project-icon"><FolderKanban size={20} /></div>

              <span className="ai-project-pill">
                <Sparkles size={11} /> {data.ai_guidance?.ai_used ? "AI suggested" : "Personalized suggestion"}
              </span>

              <h3>{project.title}</h3>
              <p>{project.ai_reason || guide?.idea || project.description}</p>

              <div className="project-skills">
                {(project.skills || []).map(skill => <span key={skill}>{skill}</span>)}
              </div>

              <div className="project-footer">
                <span>{project.difficulty}</span>
                <button className="project-guide-btn" onClick={() => setSelectedProject(project)}>
                  View project guide <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProject && (
        <div className="project-modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="project-modal" onClick={e => e.stopPropagation()}>
            <button className="project-modal-close" onClick={() => setSelectedProject(null)} aria-label="Close">
              <X size={18} />
            </button>

            <div className="project-modal-heading">
              <div className="project-icon"><FolderKanban size={21} /></div>
              <div>
                <span className="eyebrow">PROJECT GUIDE</span>
                <h2>{selectedProject.title}</h2>
                <span className="difficulty">{selectedProject.difficulty}</span>
              </div>
            </div>

            <div className="project-guide-section">
              <h3>Project idea</h3>
              <p>{PROJECT_GUIDES[selectedProject.title]?.idea || selectedProject.description}</p>
              <div className="project-outcome"><b>What you will build:</b> {PROJECT_GUIDES[selectedProject.title]?.outcome}</div>
            </div>

            <div className="project-ai-reason">
              <div className="ai-card-icon"><Sparkles size={16} /></div>
              <div>
                <b>Why this project was suggested for you</b>
                <p>{selectedProject.ai_reason || "This project was selected because it helps you turn one or more current gaps into practical portfolio evidence."}</p>
              </div>
            </div>

            <div className="project-guide-section">
              <h3>Suggested steps</h3>
              <ol className="project-steps">
                {(PROJECT_GUIDES[selectedProject.title]?.steps || []).map((step, i) => (
                  <li key={i}><span>{i + 1}</span><p>{step}</p></li>
                ))}
              </ol>
            </div>

            <div className="project-guide-columns">
              <div className="project-guide-section">
                <h3>Tools & technologies</h3>
                <div className="project-tool-list">
                  {(PROJECT_GUIDES[selectedProject.title]?.tools || selectedProject.skills || []).map(tool => <span key={tool}>{tool}</span>)}
                </div>
              </div>

              <div className="project-guide-section">
                <h3>Reference links</h3>
                <div className="project-reference-list">
                  {(PROJECT_GUIDES[selectedProject.title]?.references || []).map(([label, url]) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer">
                      {label}<ArrowUpRight size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {selectedProject.github_url && (
              <a className="primary project-start-btn" href={selectedProject.github_url} target="_blank" rel="noreferrer">
                Open project repository <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


/* =========================================================
   WHAT IF
========================================================= */

function WhatIf() {

  return (

    <ResultShell>

      <WhatIfContent />

    </ResultShell>

  );

}


function WhatIfContent() {

  const { data } =
    useAppData();


  const [skills, setSkills] =
    useState([]);


  const [result, setResult] =
    useState(null);


  const [busy, setBusy] =
    useState(false);


  const available =
    data.missing.concat(
      data.improvement
    );


  const toggle = skill => {

    setSkills(
      skills.includes(skill)
        ? skills.filter(
            x => x !== skill
          )
        : [...skills, skill]
    );

  };


  const run = async () => {

    setBusy(true);


    try {

      const response =
        await whatIf({

          analysis_id:
            data.analysis_id,

          add_skills:
            skills

        });


      setResult(
        response.data
      );

    } finally {

      setBusy(false);

    }

  };


  return (

    <div>

      <PageTitle
        title="What-If simulator"
        subtitle="See which skills could make the biggest difference to your readiness score."
      />


      <div className="panel whatif-panel">

        <div className="whatif-header">

          <div className="sim-icon">

            <SlidersHorizontal
              size={23}
            />

          </div>


          <div>

            <b>
              Imagine your next learning win
            </b>

            <p>
              Select skills you plan to learn
              and compare your current score
              with the projected score.
            </p>

          </div>

        </div>


        <div className="whatif-skills">

          {available.map(skill => (

            <button
              key={skill}
              className={
                skills.includes(skill)
                  ? "selected"
                  : ""
              }
              onClick={() =>
                toggle(skill)
              }
            >

              {
                skills.includes(skill)
                  ? "✓"
                  : "+"
              }{" "}

              {skill}

            </button>

          ))}

        </div>


        <button
          className="primary"
          disabled={
            !skills.length ||
            busy
          }
          onClick={run}
        >

          {
            busy
              ? "Calculating..."
              : "Calculate projected readiness"
          }

          <Sparkles size={17} />

        </button>


        {result && (

          <div className="projection-card">

            <div>

              <small>
                Current readiness
              </small>

              <strong>
                {result.current_score}%
              </strong>

            </div>


            <ChevronRight
              size={25}
            />


            <div>

              <small>
                Projected readiness
              </small>

              <strong>
                {result.projected_score}%
              </strong>

            </div>


            <div className="delta">

              +
              {Math.max(
                0,
                result.projected_score -
                  result.current_score
              ).toFixed(1)}
              %

            </div>

          </div>

        )}

      </div>

    </div>

  );

}


/* =========================================================
   EMPTY STATE
========================================================= */

function Empty({
  text,
  action
}) {

  const navigate =
    useNavigate();


  return (

    <div className="empty-card">

      <div className="empty-icon">

        <Target size={32} />

      </div>


      <h2>
        Nothing here yet
      </h2>


      <p>
        {text}
      </p>


      <button
        className="secondary"
        onClick={
          action ||
          (() =>
            navigate("/analyze"))
        }
      >

        Start an analysis

        <ChevronRight
          size={16}
        />

      </button>

    </div>

  );

}


/* =========================================================
   APP
========================================================= */

export default function App() {

  return <Layout />;

}