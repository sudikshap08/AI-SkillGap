from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models.models import CareerRole, RoleSkill

router = APIRouter(prefix="/api/careers", tags=["Careers"])

@router.get("")
def careers(db: Session = Depends(get_db)):
    roles=db.execute(select(CareerRole).order_by(CareerRole.id)).scalars().all()
    return [{"id":r.id,"name":r.name,"description":r.description,"skills":[{"id":rs.skill_id,"name":rs.skill.name,"importance":rs.importance} for rs in r.role_skills]} for r in roles]

@router.get("/{career_id}")
def career(career_id: int, db: Session = Depends(get_db)):
    role=db.get(CareerRole,career_id)
    if not role: raise HTTPException(404,"Career role not found")
    return {"id":role.id,"name":role.name,"description":role.description,"skills":[{"id":rs.skill_id,"name":rs.skill.name,"importance":rs.importance,"prerequisite":rs.prerequisite.name if rs.prerequisite else None} for rs in role.role_skills]}
