from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, nullable=False)
    education = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)

    skills = relationship(
        "UserSkill",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    analyses = relationship(
        "Analysis",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class CareerRole(Base):
    __tablename__ = "career_roles"

    id = Column(Integer, primary_key=True)
    name = Column(String(120), unique=True, nullable=False)
    description = Column(Text)

    role_skills = relationship(
        "RoleSkill",
        back_populates="role",
        cascade="all, delete-orphan",
    )


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True)
    name = Column(String(120), unique=True, nullable=False)
    category = Column(String(80), default="Technical")

    user_skills = relationship(
        "UserSkill",
        back_populates="skill",
    )

    # IMPORTANT:
    # RoleSkill has TWO foreign keys pointing to skills:
    # skill_id and prerequisite_id.
    # We explicitly tell SQLAlchemy that this relationship
    # uses skill_id.
    role_skills = relationship(
        "RoleSkill",
        foreign_keys="RoleSkill.skill_id",
        back_populates="skill",
    )


class RoleSkill(Base):
    __tablename__ = "role_skills"

    id = Column(Integer, primary_key=True)

    role_id = Column(
        Integer,
        ForeignKey("career_roles.id"),
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
    )

    importance = Column(
        Float,
        default=1.0,
    )

    prerequisite_id = Column(
        Integer,
        ForeignKey("skills.id"),
        nullable=True,
    )

    role = relationship(
        "CareerRole",
        back_populates="role_skills",
    )

    # Main skill required for the career role
    skill = relationship(
        "Skill",
        foreign_keys=[skill_id],
        back_populates="role_skills",
    )

    # Optional prerequisite skill
    prerequisite = relationship(
        "Skill",
        foreign_keys=[prerequisite_id],
    )


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
    )

    level = Column(
        String(30),
        default="Basic",
    )

    user = relationship(
        "User",
        back_populates="skills",
    )

    skill = relationship(
        "Skill",
        back_populates="user_skills",
    )


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
    )

    role_id = Column(
        Integer,
        ForeignKey("career_roles.id"),
    )

    score = Column(
        Float,
        default=0,
    )

    explanation = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    user = relationship(
        "User",
        back_populates="analyses",
    )

    role = relationship(
        "CareerRole",
    )

    gaps = relationship(
        "SkillGapResult",
        back_populates="analysis",
        cascade="all, delete-orphan",
    )

    roadmap = relationship(
        "RoadmapItem",
        back_populates="analysis",
        cascade="all, delete-orphan",
    )

    projects = relationship(
        "AnalysisProject",
        back_populates="analysis",
        cascade="all, delete-orphan",
    )


class SkillGapResult(Base):
    __tablename__ = "skill_gap_results"

    id = Column(Integer, primary_key=True)

    analysis_id = Column(
        Integer,
        ForeignKey("analyses.id"),
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
    )

    status = Column(String(30))
    importance = Column(Float)
    reason = Column(Text)

    analysis = relationship(
        "Analysis",
        back_populates="gaps",
    )

    skill = relationship(
        "Skill",
    )


class RoadmapItem(Base):
    __tablename__ = "roadmap_items"

    id = Column(Integer, primary_key=True)

    analysis_id = Column(
        Integer,
        ForeignKey("analyses.id"),
    )

    phase = Column(Integer)

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
    )

    reason = Column(Text)
    difficulty = Column(String(30))

    analysis = relationship(
        "Analysis",
        back_populates="roadmap",
    )

    skill = relationship(
        "Skill",
    )


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True)

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
    )

    title = Column(String(200))
    url = Column(String(500))

    resource_type = Column(
        String(50),
        default="Course",
    )

    is_free = Column(
        Boolean,
        default=True,
    )

    skill = relationship(
        "Skill",
    )


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)

    title = Column(String(200))
    description = Column(Text)

    difficulty = Column(
        String(30),
        default="Intermediate",
    )

    github_url = Column(
        String(500),
        nullable=True,
    )

    project_skills = relationship(
        "ProjectSkill",
        back_populates="project",
    )


class ProjectSkill(Base):
    __tablename__ = "project_skills"

    id = Column(Integer, primary_key=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
    )

    project = relationship(
        "Project",
        back_populates="project_skills",
    )

    skill = relationship(
        "Skill",
    )


class AnalysisProject(Base):
    __tablename__ = "analysis_projects"

    id = Column(Integer, primary_key=True)

    analysis_id = Column(
        Integer,
        ForeignKey("analyses.id"),
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
    )

    analysis = relationship(
        "Analysis",
        back_populates="projects",
    )

    project = relationship(
        "Project",
    )