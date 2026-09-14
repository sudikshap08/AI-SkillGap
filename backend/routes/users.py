from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models.models import User, Skill, UserSkill
from ..schemas.schemas import UserCreate
from ..services.skill_normalizer import normalize_skill

router=APIRouter(prefix="/api/users",tags=["Users"])

@router.post("")
def create_user(payload: UserCreate, db: Session=Depends(get_db)):
    user=db.execute(select(User).where(User.email==payload.email)).scalar_one_or_none()
    if not user:
        user=User(name=payload.name,email=payload.email,education=payload.education);db.add(user);db.flush()
    else:
        user.name,user.education=payload.name,payload.education
    for item in payload.skills:
        name=normalize_skill(item.name)
        skill=db.execute(select(Skill).where(Skill.name==name)).scalar_one_or_none()
        if not skill: continue
        existing=db.execute(select(UserSkill).where(UserSkill.user_id==user.id,UserSkill.skill_id==skill.id)).scalar_one_or_none()
        if existing: existing.level=item.level
        else: db.add(UserSkill(user_id=user.id,skill_id=skill.id,level=item.level))
    db.commit();db.refresh(user)
    return {"id":user.id,"name":user.name,"email":user.email}
