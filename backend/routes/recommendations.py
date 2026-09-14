from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models.models import Resource, Project

router = APIRouter(prefix="/api", tags=["Recommendations"])

@router.get("/resources")
def resources(db: Session = Depends(get_db)):
    return db.execute(select(Resource)).scalars().all()

@router.get("/projects")
def projects(db: Session = Depends(get_db)):
    return db.execute(select(Project)).scalars().all()
