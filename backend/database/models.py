from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database.connection import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    project_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    industry = Column(String, nullable=False)
    platforms = Column(JSON, nullable=False)  # List of strings: ["web", "mobile"]
    features = Column(JSON, nullable=False)   # List of strings: ["auth", "payments"]

    # Relationships
    estimate = relationship("Estimate", back_populates="project", uselist=False, cascade="all, delete-orphan")
    ai_response = relationship("AIResponse", back_populates="project", uselist=False, cascade="all, delete-orphan")
    report = relationship("Report", back_populates="project", uselist=False, cascade="all, delete-orphan")


class Estimate(Base):
    __tablename__ = "estimates"

    project_id = Column(String, ForeignKey("projects.id"), primary_key=True)
    hours = Column(Integer, nullable=False)
    cost = Column(Float, nullable=False)
    timeline = Column(String, nullable=False)  # e.g. "4-6 weeks"
    team = Column(JSON, nullable=False)       # JSON object or list representing recommended roles

    project = relationship("Project", back_populates="estimate")


class AIResponse(Base):
    __tablename__ = "ai_responses"

    project_id = Column(String, ForeignKey("projects.id"), primary_key=True)
    summary = Column(Text, nullable=False)      # Executive summary
    tech_stack = Column(JSON, nullable=False)   # List/JSON of tech recommendation categories
    risks = Column(JSON, nullable=False)        # List/JSON of risks & mitigations
    roadmap = Column(JSON, nullable=True)       # Dynamic project roadmap phases
    sprint_plan = Column(JSON, nullable=True)   # Agile sprint plans

    project = relationship("Project", back_populates="ai_response")


class Report(Base):
    __tablename__ = "reports"

    project_id = Column(String, ForeignKey("projects.id"), primary_key=True)
    pdf_path = Column(String, nullable=False)

    project = relationship("Project", back_populates="report")
