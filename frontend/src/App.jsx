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


  const roleSkills =
    career?.skills || [];


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

                  <small>
                    {
                      careerItem.skills?.length ||
                      0
                    }{" "}
                    core skills
                  </small>

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


              <div className="role-skill-list">

                {roleSkills.map(skill => (

                  <span
                    key={
                      skill.name ||
                      skill.id
                    }
                  >
                    {skill.name}
                  </span>

                ))}

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

function Projects() {

  return (

    <ResultShell>

      <ProjectsContent />

    </ResultShell>

  );

}


function ProjectsContent() {

  const { data } =
    useAppData();


  return (

    <div>

      <PageTitle
        title="Projects that close your gaps"
        subtitle="Build practical portfolio projects that reinforce the skills you need for your target role."
      />


      <div className="project-grid">

        {data.projects.map(
          (project, index) => (

            <div
              className="project-card"
              key={index}
            >

              <div className="project-icon">

                <FolderKanban size={20} />

              </div>


              <span className="match-pill">

                {
                  project.match_score ||
                  "Recommended"
                }

                {
                  project.match_score
                    ? "% match"
                    : ""
                }

              </span>


              <h3>
                {project.title}
              </h3>


              <p>
                {project.description}
              </p>


              <div className="project-skills">

                {(project.skills || [])
                  .map(skill => (

                    <span key={skill}>
                      {skill}
                    </span>

                  ))}

              </div>


              <div className="project-footer">

                <span>
                  {project.difficulty}
                </span>


                {project.github_url && (

                  <a
                    href={
                      project.github_url
                    }
                    target="_blank"
                    rel="noreferrer"
                  >

                    GitHub

                    <ArrowUpRight
                      size={14}
                    />

                  </a>

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