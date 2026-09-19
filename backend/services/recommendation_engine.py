from sqlalchemy import select
from ..models.models import Resource, Project, ProjectSkill

def resources_for_skills(db, skill_ids):
    if not skill_ids:
        return []
    rows = db.execute(select(Resource).where(Resource.skill_id.in_(skill_ids))).scalars().all()
    return rows

def projects_for_skills(db, skill_ids, limit=8):
    if not skill_ids:
        return []
    rows = db.execute(select(Project).join(ProjectSkill).where(ProjectSkill.skill_id.in_(skill_ids))).scalars().unique().all()
    scored=[]
    target=set(skill_ids)
    for p in rows:
        ids={ps.skill_id for ps in p.project_skills}
        overlap=len(target & ids)
        scored.append((overlap,p))
    scored.sort(key=lambda x:x[0], reverse=True)
    return [p for _,p in scored[:limit]]
