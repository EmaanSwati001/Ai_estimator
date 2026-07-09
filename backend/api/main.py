import os
import uuid
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import List

# Import our database modules
from backend.database.connection import engine, Base, get_db
from backend.database.models import Project, Estimate, AIResponse, Report
from backend.rule_engine.engine import calculate_estimate
from backend.ai.integration import generate_ai_response, generate_feature_recommendations
from backend.reports.pdf_gen import generate_proposal_pdf

# Ensure SQLite tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Project Estimator & Proposal Generator API", version="2.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schema Definitions ---
class RecommendRequest(BaseModel):
    industry: str
    features: List[str]

class RecommendResponseItem(BaseModel):
    id: str
    name: str
    desc: str
    effort: str

class EstimateRequest(BaseModel):
    name: str
    email: EmailStr
    project_name: str
    description: str
    industry: str
    platforms: List[str]
    features: List[str]

class TeamDetails(BaseModel):
    size: int
    roles: List[str]

class EstimateResponseData(BaseModel):
    hours: int
    cost: float
    timeline: str
    team: TeamDetails

class RiskItem(BaseModel):
    risk: str
    mitigation: str

class AIResponseData(BaseModel):
    summary: str
    tech_stack: dict
    risks: List[dict]
    roadmap: List[dict] = []
    sprint_plan: List[dict] = []

class FullProposalResponse(BaseModel):
    project_id: str
    project_name: str
    client_name: str
    email: str
    industry: str
    platforms: List[str]
    features: List[str]
    estimate: EstimateResponseData
    ai_response: AIResponseData

# --- API Endpoints ---

@app.post("/api/recommend-features", response_model=List[RecommendResponseItem])
def get_recommendations(payload: RecommendRequest):
    """
    Endpoint that generates tailored feature recommendations based on selected industry and basic features list.
    """
    try:
        recommendations = generate_feature_recommendations(
            industry=payload.industry,
            features=payload.features
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get AI recommendations: {str(e)}")


@app.post("/api/estimate", response_model=FullProposalResponse)
def create_project_estimate(payload: EstimateRequest, db: Session = Depends(get_db)):
    """
    Endpoint that accepts user input, computes development scope/costs via rule engine,
    calls AI model (or fallback templates) for summary/stack/risks/roadmap/sprint plans,
    saves to SQLite, generates a proposal PDF, and returns the full structured response.
    """
    try:
        project_id = str(uuid.uuid4())
        
        # 1. Save Project Information
        db_project = Project(
            id=project_id,
            name=payload.name,
            email=payload.email,
            project_name=payload.project_name,
            description=payload.description,
            industry=payload.industry,
            platforms=payload.platforms,
            features=payload.features
        )
        db.add(db_project)
        
        # 2. Run Rule Engine calculations
        calc_result = calculate_estimate(
            features=payload.features,
            platforms=payload.platforms,
            industry=payload.industry
        )
        
        db_estimate = Estimate(
            project_id=project_id,
            hours=calc_result["hours"],
            cost=calc_result["cost"],
            timeline=calc_result["timeline"],
            team=calc_result["team"]
        )
        db.add(db_estimate)
        
        # 3. Call AI prompts (or templates fallback)
        ai_result = generate_ai_response(
            project_name=payload.project_name,
            description=payload.description,
            industry=payload.industry,
            platforms=payload.platforms,
            features=payload.features,
            estimate_info=calc_result
        )
        
        db_ai = AIResponse(
            project_id=project_id,
            summary=ai_result["summary"],
            tech_stack=ai_result["tech_stack"],
            risks=ai_result["risks"],
            roadmap=ai_result.get("roadmap", []),
            sprint_plan=ai_result.get("sprint_plan", [])
        )
        db.add(db_ai)
        
        # 4. Generate Proposal PDF
        pdf_dir = os.path.join(os.path.dirname(__file__), "..", "reports", "files")
        os.makedirs(pdf_dir, exist_ok=True)
        pdf_path = os.path.join(pdf_dir, f"{project_id}.pdf")
        
        # Re-pack dict values for generator
        proj_dict = {
            "project_name": payload.project_name,
            "name": payload.name,
            "email": payload.email,
            "industry": payload.industry,
            "platforms": payload.platforms,
            "features": payload.features
        }
        
        generate_proposal_pdf(
            project_data=proj_dict,
            estimate_data=calc_result,
            ai_data=ai_result,
            output_path=pdf_path
        )
        
        db_report = Report(
            project_id=project_id,
            pdf_path=pdf_path
        )
        db.add(db_report)
        
        # Commit to Database
        db.commit()
        db.refresh(db_project)
        
        return FullProposalResponse(
            project_id=project_id,
            project_name=db_project.project_name,
            client_name=db_project.name,
            email=db_project.email,
            industry=db_project.industry,
            platforms=db_project.platforms,
            features=db_project.features,
            estimate=EstimateResponseData(
                hours=db_estimate.hours,
                cost=db_estimate.cost,
                timeline=db_estimate.timeline,
                team=TeamDetails(
                    size=db_estimate.team["size"],
                    roles=db_estimate.team["roles"]
                )
            ),
            ai_response=AIResponseData(
                summary=db_ai.summary,
                tech_stack=db_ai.tech_stack,
                risks=db_ai.risks,
                roadmap=db_ai.roadmap,
                sprint_plan=db_ai.sprint_plan
            )
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to generate proposal: {str(e)}")


@app.get("/api/estimates", response_model=List[FullProposalResponse])
def get_all_estimates(db: Session = Depends(get_db)):
    """
    Lists all generated estimates. Used by the Admin Dashboard.
    """
    try:
        projects = db.query(Project).all()
        results = []
        for p in projects:
            est = db.query(Estimate).filter(Estimate.project_id == p.id).first()
            ai_resp = db.query(AIResponse).filter(AIResponse.project_id == p.id).first()
            if est and ai_resp:
                results.append(
                    FullProposalResponse(
                        project_id=p.id,
                        project_name=p.project_name,
                        client_name=p.name,
                        email=p.email,
                        industry=p.industry,
                        platforms=p.platforms,
                        features=p.features,
                        estimate=EstimateResponseData(
                            hours=est.hours,
                            cost=est.cost,
                            timeline=est.timeline,
                            team=TeamDetails(
                                size=est.team["size"],
                                roles=est.team["roles"]
                            )
                        ),
                        ai_response=AIResponseData(
                            summary=ai_resp.summary,
                            tech_stack=ai_resp.tech_stack,
                            risks=ai_resp.risks,
                            roadmap=ai_resp.roadmap or [],
                            sprint_plan=ai_resp.sprint_plan or []
                        )
                    )
                )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list estimates: {str(e)}")


@app.get("/api/estimate/{project_id}", response_model=FullProposalResponse)
def get_project_estimate(project_id: str, db: Session = Depends(get_db)):
    """
    Fetches an existing project estimate by its unique project ID.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project estimate not found")
        
    estimate = db.query(Estimate).filter(Estimate.project_id == project_id).first()
    ai_resp = db.query(AIResponse).filter(AIResponse.project_id == project_id).first()
    
    if not estimate or not ai_resp:
        raise HTTPException(status_code=404, detail="Incomplete proposal data records")
        
    return FullProposalResponse(
        project_id=project.id,
        project_name=project.project_name,
        client_name=project.name,
        email=project.email,
        industry=project.industry,
        platforms=project.platforms,
        features=project.features,
        estimate=EstimateResponseData(
            hours=estimate.hours,
            cost=estimate.cost,
            timeline=estimate.timeline,
            team=TeamDetails(
                size=estimate.team["size"],
                roles=estimate.team["roles"]
            )
        ),
        ai_response=AIResponseData(
            summary=ai_resp.summary,
            tech_stack=ai_resp.tech_stack,
            risks=ai_resp.risks,
            roadmap=ai_resp.roadmap or [],
            sprint_plan=ai_resp.sprint_plan or []
        )
    )


@app.delete("/api/estimate/{project_id}")
def delete_project_estimate(project_id: str, db: Session = Depends(get_db)):
    """
    Deletes an existing project estimate from the SQLite database and clears the compiled proposal PDF.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        # Check and delete the PDF report file from disk
        report = db.query(Report).filter(Report.project_id == project_id).first()
        if report and report.pdf_path and os.path.exists(report.pdf_path):
            os.remove(report.pdf_path)

        # Cascading relations will delete dependencies in estimates, ai_responses, reports
        db.delete(project)
        db.commit()
        return {"status": "success", "message": f"Project {project_id} deleted successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")


@app.get("/api/estimate/{project_id}/pdf")
def get_proposal_pdf(project_id: str, db: Session = Depends(get_db)):
    """
    Serves the generated proposal PDF download.
    """
    report = db.query(Report).filter(Report.project_id == project_id).first()
    if not report or not os.path.exists(report.pdf_path):
        raise HTTPException(status_code=404, detail="PDF report file not found")
        
    project = db.query(Project).filter(Project.id == project_id).first()
    filename = f"proposal_{project.project_name.replace(' ', '_')}.pdf" if project else "proposal.pdf"
    
    return FileResponse(
        path=report.pdf_path,
        media_type="application/pdf",
        filename=filename
    )
