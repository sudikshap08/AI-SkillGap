from pydantic import BaseModel, EmailStr
from typing import List

class SkillInput(BaseModel):
    name: str
    level: str = "Strong"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    education: str = ""
    skills: List[SkillInput] = []

class AnalysisRequest(BaseModel):
    user_id: int
    role_id: int
    skills: List[SkillInput] = []

class WhatIfRequest(BaseModel):
    analysis_id: int
    add_skills: List[str] = []
