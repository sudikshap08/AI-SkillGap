from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models.models import *
from ..schemas.schemas import AnalysisRequest, WhatIfRequest
from ..services.skill_normalizer import normalize_skill
from ..services.readiness_engine import classify, calculate_score
from ..services.roadmap_generator import build_roadmap
from ..services.recommendation_engine import resources_for_skills, projects_for_skills
from ..services.llm_service import generate_explanation

router=APIRouter(prefix="/api",tags=["Analysis"])

def make_analysis(db,user_id,role_id,skills):
    role=db.get(CareerRole,role_id); user=db.get(User,user_id)
    if not role or not user: raise HTTPException(404,"User or career not found")
    current={}
    for item in skills:
        name=normalize_skill(item.name); skill=db.execute(select(Skill).where(Skill.name==name)).scalar_one_or_none()
        if skill: current[skill.id]=item.level
    role_skills=db.execute(select(RoleSkill).where(RoleSkill.role_id==role_id)).scalars().all()
    results=[]; strong=[]; improvement=[]; missing=[]; prereqs={}; status_by_id={}
    for rs in role_skills:
        us=UserSkill(level=current[rs.skill_id]) if rs.skill_id in current else None
        status,value=classify(rs,us); status_by_id[rs.skill_id]=status
        reason=(f"You already have a strong foundation in {rs.skill.name}." if status=="Strong" else f"{rs.skill.name} is a key skill for {role.name} and should be developed next." if status=="Improvement" else f"{rs.skill.name} is currently missing for {role.name}.")
        if status=="Strong": strong.append(rs.skill.name)
        elif status=="Improvement": improvement.append(rs.skill.name)
        else: missing.append(rs.skill.name)
        results.append({"skill_id":rs.skill_id,"skill_name":rs.skill.name,"status":status,"value":value,"importance":rs.importance,"reason":reason})
        if rs.prerequisite_id: prereqs[rs.skill_id]=rs.prerequisite_id
    score=calculate_score(results)
    analysis=Analysis(user_id=user_id,role_id=role_id,score=score);db.add(analysis);db.flush()
    for r in results: db.add(SkillGapResult(analysis_id=analysis.id,skill_id=r["skill_id"],status=r["status"],importance=r["importance"],reason=r["reason"]))
    gaps=[r for r in results if r["status"]!="Strong"]
    roadmap=build_roadmap(gaps,prereqs,status_by_id)
    for item in roadmap: db.add(RoadmapItem(analysis_id=analysis.id,phase=item["phase"],skill_id=item["skill_id"],reason=item["reason"],difficulty=item["difficulty"]))
    roadmap_skill_ids=[x["skill_id"] for x in roadmap]
    resources=resources_for_skills(db,roadmap_skill_ids)
    resource_by_skill={}
    for r in resources: resource_by_skill.setdefault(r.skill_id,[]).append(r)
    gap_ids=[r["skill_id"] for r in gaps]
    projects=projects_for_skills(db,gap_ids)
    for p in projects: db.add(AnalysisProject(analysis_id=analysis.id,project_id=p.id))
    explanation=generate_explanation(role.name,score,strong,improvement,missing);analysis.explanation=explanation
    db.commit();db.refresh(analysis)
    roadmap_rows=db.execute(select(RoadmapItem).where(RoadmapItem.analysis_id==analysis.id).order_by(RoadmapItem.phase,RoadmapItem.id)).scalars().all()
    return {"analysis_id":analysis.id,"role":role.name,"score":score,"strong":strong,"improvement":improvement,"missing":missing,"gaps":results,
      "roadmap":[{"phase":x.phase,"skill":x.skill.name,"skill_id":x.skill_id,"reason":x.reason,"difficulty":x.difficulty,"resources":[{"title":r.title,"url":r.url,"type":r.resource_type,"skill":r.skill.name} for r in resource_by_skill.get(x.skill_id,[])]} for x in roadmap_rows],
      "resources":[{"title":r.title,"url":r.url,"type":r.resource_type,"skill":r.skill.name} for r in resources],
      "projects":[{"title":p.title,"description":p.description,"difficulty":p.difficulty,"github_url":p.github_url,"skills":[ps.skill.name for ps in p.project_skills],"match_score":round(len({ps.skill_id for ps in p.project_skills}&set(gap_ids))/max(1,len(gap_ids))*100)} for p in projects],"explanation":explanation}

@router.post("/analysis")
def run_analysis(payload:AnalysisRequest,db:Session=Depends(get_db)): return make_analysis(db,payload.user_id,payload.role_id,payload.skills)

@router.get("/analysis/{analysis_id}")
def get_analysis(analysis_id:int,db:Session=Depends(get_db)):
    a=db.get(Analysis,analysis_id)
    if not a: raise HTTPException(404,"Analysis not found")
    return {"id":a.id,"role":a.role.name,"score":a.score,"explanation":a.explanation}

@router.get("/analysis/history/{user_id}")
def history(user_id:int,db:Session=Depends(get_db)):
    rows=db.execute(select(Analysis).where(Analysis.user_id==user_id).order_by(Analysis.created_at.desc())).scalars().all()
    return [{"id":x.id,"role":x.role.name,"score":x.score,"created_at":x.created_at} for x in rows]

@router.post("/what-if")
def what_if(payload:WhatIfRequest,db:Session=Depends(get_db)):
    a=db.get(Analysis,payload.analysis_id)
    if not a: raise HTTPException(404,"Analysis not found")
    role_skills=db.execute(select(RoleSkill).where(RoleSkill.role_id==a.role_id)).scalars().all();add={normalize_skill(x) for x in payload.add_skills};total=sum(x.importance for x in role_skills) or 1;weighted=0
    for rs in role_skills:
        existing=db.execute(select(SkillGapResult).where(SkillGapResult.analysis_id==a.id,SkillGapResult.skill_id==rs.skill_id)).scalar_one_or_none()
        value=1 if rs.skill.name in add else {"Strong":1,"Improvement":0.5,"Missing":0}.get(existing.status if existing else "Missing",0)
        weighted+=value*rs.importance
    projected=round(weighted/total*100,1)
    return {"current_score":a.score,"projected_score":projected,"added_skills":[x for x in add if any(rs.skill.name==x for rs in role_skills)]}
