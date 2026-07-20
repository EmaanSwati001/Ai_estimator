import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

# Define cohesive SaaS branding color palette
PRIMARY_COLOR = colors.HexColor("#4f46e5")      # Indigo
SECONDARY_COLOR = colors.HexColor("#7c3aed")    # Purple
TEXT_DARK = colors.HexColor("#0f172a")          # Slate 900
TEXT_MUTED = colors.HexColor("#334155")         # Slate 700
LIGHT_BG = colors.HexColor("#f8fafc")           # Slate 50
BORDER_COLOR = colors.HexColor("#e2e8f0")       # Slate 200
WHITE = colors.HexColor("#ffffff")
ACCENT_RED = colors.HexColor("#ef4444")         # Red for risks
ACCENT_GREEN = colors.HexColor("#10b981")       # Green for success/milestones

def generate_proposal_pdf(
    project_data: dict,
    estimate_data: dict,
    ai_data: dict,
    output_path: str
) -> str:
    """
    Generates a beautifully formatted multi-page PDF proposal report using ReportLab.
    Contains:
    - Cover Page
    - Executive Summary & Business Objectives
    - Core Features & Recommended Features
    - Recommended Architecture Stack & Tech Stack
    - Project Implementation Roadmap
    - Agile Sprint Planning
    - Technical Team & Budget Breakdown
    - Technical Risks & Next Steps
    """
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Document setup (0.75-inch margins)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # --- Custom Typography Styles ---
    cover_title_style = ParagraphStyle(
        name="CoverTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=30,
        leading=36,
        textColor=PRIMARY_COLOR,
        spaceAfter=10
    )
    
    cover_tagline_style = ParagraphStyle(
        name="CoverTagline",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=SECONDARY_COLOR,
        spaceAfter=30
    )
    
    cover_subtitle_style = ParagraphStyle(
        name="CoverSubTitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=16,
        leading=20,
        textColor=TEXT_DARK,
        spaceAfter=50
    )

    h1_style = ParagraphStyle(
        name="SectionHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=PRIMARY_COLOR,
        spaceBefore=15,
        spaceAfter=12,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        name="SectionSubHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=TEXT_DARK,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        name="DocBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=TEXT_MUTED,
        spaceAfter=10
    )
    
    body_bold_style = ParagraphStyle(
        name="DocBodyBold",
        parent=body_style,
        fontName="Helvetica-Bold",
        textColor=TEXT_DARK
    )
    
    table_header_style = ParagraphStyle(
        name="TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=12,
        textColor=WHITE
    )

    table_cell_style = ParagraphStyle(
        name="TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=TEXT_MUTED
    )

    table_cell_bold_style = ParagraphStyle(
        name="TableCellBold",
        parent=table_cell_style,
        fontName="Helvetica-Bold",
        textColor=TEXT_DARK
    )

    flowables = []

    # ==================== PAGE 1: COVER PAGE ====================
    flowables.append(Spacer(1, 1.2 * inch))
    flowables.append(Paragraph("PROJECTPROPOSAL", cover_title_style))
    flowables.append(Paragraph("PROJECTPILOT AI DISCOVERY ENGINE", cover_tagline_style))
    
    # Decorative line
    dec_line = Table([[""]], colWidths=[6.5 * inch], rowHeights=[4])
    dec_line.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SECONDARY_COLOR),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    flowables.append(dec_line)
    flowables.append(Spacer(1, 20))
    
    flowables.append(Paragraph(f"Scope Architecture & Estimate: {project_data.get('project_name')}", cover_subtitle_style))
    flowables.append(Spacer(1, 0.8 * inch))
    
    # Metadata info table
    metadata_data = [
        [Paragraph("Prepared For:", table_cell_bold_style), Paragraph(f"{project_data.get('name')} ({project_data.get('email')})", table_cell_style)],
        [Paragraph("Business Domain:", table_cell_bold_style), Paragraph(project_data.get('industry', '').upper(), table_cell_style)],
        [Paragraph("Target Platforms:", table_cell_bold_style), Paragraph(", ".join(project_data.get('platforms', [])).upper(), table_cell_style)],
        [Paragraph("Generation Date:", table_cell_bold_style), Paragraph(datetime.now().strftime("%B %d, %Y"), table_cell_style)]
    ]
    meta_table = Table(metadata_data, colWidths=[1.8 * inch, 4.7 * inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('RIGHTPADDING', (0,0), (-1,-1), 15),
        ('BOX', (0,0), (-1,-1), 1.5, PRIMARY_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    flowables.append(meta_table)
    flowables.append(PageBreak())

    # ==================== PAGE 2: EXEC SUMMARY & OBJECTIVES ====================
    flowables.append(Paragraph("1. Executive Summary", h1_style))
    flowables.append(Paragraph(ai_data.get("summary", ""), body_style))
    flowables.append(Spacer(1, 10))

    flowables.append(Paragraph("2. Project Objectives", h1_style))
    flowables.append(Paragraph(
        "The primary business objective is to architect and launch a scalable, secure, and production-quality software application. "
        "Through ProjectPilot AI's automated discovery session, we have analyzed requirements, selected platforms, and structured "
        "business modules to maximize engineering velocity while keeping operational expenditures low.",
        body_style
    ))
    
    # Objectives list card
    objectives_data = [
        [
            Paragraph("🚀 Time-to-Market", table_cell_bold_style),
            Paragraph("Accelerate launch cycles by using a modular, containerized stack (FastAPI & React).", table_cell_style)
        ],
        [
            Paragraph("🔒 Compliance & Security", table_cell_bold_style),
            Paragraph(f"Integrate native encryption, OAuth2 verification, and domain security mapped to {project_data.get('industry', 'other')} standards.", table_cell_style)
        ],
        [
            Paragraph("📈 Future Expansion", table_cell_bold_style),
            Paragraph("Implement clean API separation, allowing effortless third-party integrations and smart automation additions.", table_cell_style)
        ]
    ]
    obj_table = Table(objectives_data, colWidths=[2.0 * inch, 4.5 * inch])
    obj_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    flowables.append(obj_table)
    flowables.append(PageBreak())

    # ==================== PAGE 3: FUNCTIONAL FEATURES ====================
    flowables.append(Paragraph("3. Scope of Work & Features", h1_style))
    flowables.append(Paragraph("The total scope covers a customized combination of standard features selected by the client, combined with intelligent additions recommended by the AI Architect based on industry standards.", body_style))
    
    flowables.append(Paragraph("Core Selected Features", h2_style))
    core_features = project_data.get('features', [])
    core_data = []
    # Display in 2 columns
    for i in range(0, len(core_features), 2):
        row = [Paragraph(f"✔ &nbsp; {core_features[i].replace('_', ' ').title()}", table_cell_bold_style)]
        if i + 1 < len(core_features):
            row.append(Paragraph(f"✔ &nbsp; {core_features[i+1].replace('_', ' ').title()}", table_cell_bold_style))
        else:
            row.append(Paragraph("", table_cell_style))
        core_data.append(row)
        
    core_table = Table(core_data, colWidths=[3.25 * inch, 3.25 * inch])
    core_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
    ]))
    flowables.append(core_table)
    flowables.append(Spacer(1, 15))

    # Recommended Features
    ai_recs = ai_data.get("recommended_features") or []
    if not ai_recs and "recommendations" in ai_data:
        ai_recs = ai_data.get("recommendations")
    if not ai_recs:
        # Fallback if no specific array is compiled in AI responses
        ai_recs = [{"name": "Advanced Analytics Module", "desc": "Custom reporting and visual data monitoring widgets.", "effort": "Medium"}]
        
    flowables.append(Paragraph("AI-Recommended Enhancements", h2_style))
    rec_rows = [[Paragraph("Recommended Feature", table_header_style), Paragraph("Value-Add & Purpose", table_header_style), Paragraph("Effort", table_header_style)]]
    for r in ai_recs:
        rec_rows.append([
            Paragraph(r.get("name", ""), table_cell_bold_style),
            Paragraph(r.get("desc", ""), table_cell_style),
            Paragraph(r.get("effort", "Medium"), table_cell_bold_style)
        ])
    rec_table = Table(rec_rows, colWidths=[2.2 * inch, 3.3 * inch, 1.0 * inch])
    rec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), SECONDARY_COLOR),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG])
    ]))
    flowables.append(rec_table)
    flowables.append(PageBreak())

    # ==================== PAGE 4: ARCHITECTURE & TECH STACK ====================
    flowables.append(Paragraph("4. Solution Architecture", h1_style))
    flowables.append(Paragraph("The platform is structured on a modern, decoupled architecture. Client interactions happen via a responsive Single Page Application (SPA), sending secure, rate-limited requests to a high-speed async backend.", body_style))
    
    # Visual Architecture diagram represented as a table
    arch_flow = [
        [Paragraph("<b>Presentation Layer</b>", table_header_style), Paragraph("<b>Service Layer</b>", table_header_style), Paragraph("<b>Persistence Layer</b>", table_header_style)],
        [
            Paragraph("Vite + React SPA<br/>Framer Motion UI<br/>Responsive Design", table_cell_style),
            Paragraph("FastAPI Async server<br/>Uvicorn Router<br/>JSON Serialization", table_cell_style),
            Paragraph("PostgreSQL relational DB<br/>SQLAlchemy Engine<br/>Redis Cache", table_cell_style)
        ]
    ]
    arch_table = Table(arch_flow, colWidths=[2.16 * inch, 2.16 * inch, 2.16 * inch])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_COLOR),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY_COLOR),
        ('BACKGROUND', (0,1), (-1,-1), LIGHT_BG),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    flowables.append(arch_table)
    flowables.append(Spacer(1, 15))

    flowables.append(Paragraph("Technology Stack Specifications", h2_style))
    tech_data = [[Paragraph("Infrastructure Layer", table_header_style), Paragraph("Recommended Technology Stack", table_header_style)]]
    for layer, rec in ai_data.get("tech_stack", {}).items():
        tech_data.append([
            Paragraph(layer, table_cell_bold_style),
            Paragraph(rec, table_cell_style)
        ])
    tech_table = Table(tech_data, colWidths=[2.2 * inch, 4.3 * inch])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), TEXT_DARK),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG])
    ]))
    flowables.append(tech_table)
    flowables.append(PageBreak())

    # ==================== PAGE 5: ROADMAP & SPRINTS ====================
    flowables.append(Paragraph("5. Project Implementation Roadmap", h1_style))
    
    roadmap_rows = [
        [
            Paragraph("Phase / Milestone", table_header_style),
            Paragraph("Deliverables Scope", table_header_style),
            Paragraph("Est. Duration", table_header_style)
        ]
    ]
    for ph in ai_data.get("roadmap", []):
        feats_list = "<br/>".join(f"&bull; {f}" for f in ph.get("features", []))
        roadmap_rows.append([
            Paragraph(ph.get("title", ""), table_cell_bold_style),
            Paragraph(feats_list, table_cell_style),
            Paragraph(ph.get("duration", ""), table_cell_bold_style)
        ])
        
    roadmap_table = Table(roadmap_rows, colWidths=[2.2 * inch, 3.1 * inch, 1.2 * inch])
    roadmap_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), SECONDARY_COLOR),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG])
    ]))
    flowables.append(roadmap_table)
    flowables.append(Spacer(1, 15))

    # Agile Sprints
    flowables.append(Paragraph("Agile Sprint Planning", h2_style))
    sprint_rows = [
        [
            Paragraph("Sprint", table_header_style),
            Paragraph("Sprint Objectives & Effort", table_header_style),
            Paragraph("Deliverables Checklist", table_header_style)
        ]
    ]
    for sp in ai_data.get("sprint_plan", []):
        delivs_list = "<br/>".join(f"&bull; {d}" for d in sp.get("deliverables", []))
        sprint_rows.append([
            Paragraph(f"<b>{sp.get('title', '')}</b>", table_cell_bold_style),
            Paragraph(f"<i>Objectives:</i> {sp.get('objectives', '')}<br/><b>Effort:</b> {sp.get('effort', '')}", table_cell_style),
            Paragraph(delivs_list, table_cell_style)
        ])
        
    sprint_table = Table(sprint_rows, colWidths=[1.1 * inch, 2.7 * inch, 2.7 * inch])
    sprint_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_COLOR),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG])
    ]))
    flowables.append(sprint_table)
    flowables.append(PageBreak())

    # ==================== PAGE 6: TEAM & BUDGET ====================
    flowables.append(Paragraph("6. Team Allocation & Budget Breakdown", h1_style))
    flowables.append(Paragraph("Based on project parameters, the scope of selected features, and platform requirements, we have computed target effort metrics and engineered a precise allocation layout.", body_style))
    
    # Team metrics table
    roles_list = ", ".join(estimate_data.get('team', {}).get('roles', []))
    metrics_data = [
        [
            Paragraph("Total Est. Effort", table_header_style),
            Paragraph("Est. Timeline Duration", table_header_style),
            Paragraph("Engineering Team Size", table_header_style)
        ],
        [
            Paragraph(f"{estimate_data.get('hours')} hours", table_cell_bold_style),
            Paragraph(estimate_data.get('timeline'), table_cell_bold_style),
            Paragraph(f"{estimate_data.get('team', {}).get('size')} resources", table_cell_bold_style)
        ]
    ]
    metrics_table = Table(metrics_data, colWidths=[2.16 * inch, 2.16 * inch, 2.16 * inch])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_COLOR),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY_COLOR),
        ('BACKGROUND', (0,1), (-1,-1), LIGHT_BG),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    flowables.append(metrics_table)
    flowables.append(Spacer(1, 10))
    flowables.append(Paragraph(f"<b>Allocated Roles:</b> {roles_list}", body_style))
    flowables.append(Spacer(1, 10))

    # Budget breakdown table
    breakdown = estimate_data.get("breakdown") or {
        "design": estimate_data.get("cost", 0) * 0.15,
        "frontend": estimate_data.get("cost", 0) * 0.35,
        "backend": estimate_data.get("cost", 0) * 0.30,
        "qa": estimate_data.get("cost", 0) * 0.12,
        "pm": estimate_data.get("cost", 0) * 0.08
    }
    
    total_cost = estimate_data.get("cost", 0)
    infra_cost = 500.00 # Standard default flat SaaS server hosting estimate
    
    budget_data = [
        [Paragraph("Category Component", table_header_style), Paragraph("Scope Details", table_header_style), Paragraph("Estimated Cost (USD)", table_header_style)],
        [Paragraph("UI/UX Design Phase", table_cell_bold_style), Paragraph("User experience wireframes, interactive mockup builds", table_cell_style), Paragraph(f"${breakdown.get('design', 0):,.2f}", table_cell_style)],
        [Paragraph("Frontend Development", table_cell_bold_style), Paragraph("React / Mobile application interface construction", table_cell_style), Paragraph(f"${breakdown.get('frontend', 0):,.2f}", table_cell_style)],
        [Paragraph("Backend Engineering", table_cell_bold_style), Paragraph("FastAPI endpoints, ORM connections, databases setup", table_cell_style), Paragraph(f"${breakdown.get('backend', 0):,.2f}", table_cell_style)],
        [Paragraph("Quality Assurance", table_cell_bold_style), Paragraph("End-to-end integration tests, responsiveness check", table_cell_style), Paragraph(f"${breakdown.get('qa', 0):,.2f}", table_cell_style)],
        [Paragraph("Project Management", table_cell_bold_style), Paragraph("Agile coordination, milestones, developer logs tracking", table_cell_style), Paragraph(f"${breakdown.get('pm', 0):,.2f}", table_cell_style)],
        [Paragraph("Hosting & Cloud Infrastructure", table_cell_bold_style), Paragraph("Initial VPS staging sandbox setup & pipeline actions", table_cell_style), Paragraph(f"${infra_cost:,.2f}", table_cell_style)],
        [Paragraph("<b>TOTAL BUDGET</b>", table_cell_bold_style), Paragraph("<b>Estimated total investment, excluding hosting</b>", table_cell_bold_style), Paragraph(f"<b>${total_cost:,.2f}</b>", table_cell_bold_style)]
    ]
    
    budget_table = Table(budget_data, colWidths=[2.2 * inch, 2.8 * inch, 1.5 * inch])
    budget_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), TEXT_DARK),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-2,-1), [WHITE, LIGHT_BG]),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor("#e0e7ff")), # Light Indigo background for total
    ]))
    flowables.append(budget_table)
    flowables.append(PageBreak())

    # ==================== PAGE 7: RISKS & NEXT STEPS ====================
    flowables.append(Paragraph("7. Technical Risks & Mitigations", h1_style))
    
    risk_rows = [[Paragraph("Identified Risk Factor", table_header_style), Paragraph("Proposed Mitigation Strategy", table_header_style)]]
    for r_item in ai_data.get("risks", []):
        risk_rows.append([
            Paragraph(r_item.get("risk", ""), table_cell_bold_style),
            Paragraph(r_item.get("mitigation", ""), table_cell_style)
        ])
    risk_table = Table(risk_rows, colWidths=[3.0 * inch, 3.5 * inch])
    risk_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT_RED),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG])
    ]))
    flowables.append(risk_table)
    flowables.append(Spacer(1, 15))

    # Next steps card
    flowables.append(Paragraph("8. Project Execution Next Steps", h1_style))
    next_steps_body = (
        "To initiate the development workflow, we recommend the following phases:<br/><br/>"
        "<b>1. Discovery Alignment:</b> Conduct a developer kick-off session to align architectural preferences and integrations.<br/>"
        "<b>2. Environments Initialization:</b> Provision SQLite/PostgreSQL staging databases and hook continuous integration (CI) actions.<br/>"
        "<b>3. Milestone Sprint 1:</b> Execute Sprint 1 scope, starting with authentication configurations and dashboard scaffolding."
    )
    
    ns_table = Table([[Paragraph(next_steps_body, body_style)]], colWidths=[6.5 * inch])
    ns_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('RIGHTPADDING', (0,0), (-1,-1), 15),
        ('BOX', (0,0), (-1,-1), 1.5, ACCENT_GREEN),
    ]))
    flowables.append(ns_table)
    
    # Build Document with header and footer Disclaimers
    def add_header_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont('Helvetica', 8)
        canvas.setFillColor(TEXT_MUTED)
        
        # Header (Skip on Page 1 cover page)
        if canvas.getPageNumber() > 1:
            canvas.drawString(54, 750, f"AI Project Proposal: {project_data.get('project_name')}")
            canvas.setStrokeColor(BORDER_COLOR)
            canvas.setLineWidth(0.5)
            canvas.line(54, 742, 558, 742)
            
        # Footer (All pages)
        page_num = canvas.getPageNumber()
        canvas.drawString(54, 36, "Confidential - Prepared by ProjectPilot AI Discovery Engine")
        canvas.drawRightString(558, 36, f"Page {page_num}")
        canvas.restoreState()

    doc.build(flowables, onFirstPage=add_header_footer, onLaterPages=add_header_footer)
    return output_path
