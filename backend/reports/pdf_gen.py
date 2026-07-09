import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

# Define color palette matching SaaS branding
PRIMARY_COLOR = colors.HexColor("#4f46e5")    # Indigo
SECONDARY_COLOR = colors.HexColor("#7c3aed")  # Purple
DARK_NEUTRAL = colors.HexColor("#1f2937")     # Dark slate
LIGHT_NEUTRAL = colors.HexColor("#f9fafb")    # Very light gray
BORDER_COLOR = colors.HexColor("#e5e7eb")     # Light gray border
WHITE = colors.HexColor("#ffffff")
ACCENT_RED = colors.HexColor("#dc2626")       # Red for risks

def generate_proposal_pdf(
    project_data: dict,
    estimate_data: dict,
    ai_data: dict,
    output_path: str
) -> str:
    """
    Generates a beautifully styled, professional multi-page PDF proposal report.
    Includes a cover page, project roadmap table, agile sprint plan, architecture layers,
    and risk mitigations.
    """
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Document setup
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    # Style sheet configuration
    styles = getSampleStyleSheet()
    
    # Custom style definitions
    cover_title_style = ParagraphStyle(
        name="CoverTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=32,
        leading=38,
        textColor=PRIMARY_COLOR,
        spaceAfter=15
    )
    
    cover_subtitle_style = ParagraphStyle(
        name="CoverSubTitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=18,
        leading=22,
        textColor=DARK_NEUTRAL,
        spaceAfter=40
    )

    h1_style = ParagraphStyle(
        name="SectionHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        textColor=SECONDARY_COLOR,
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        name="DocBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=DARK_NEUTRAL,
        spaceAfter=10
    )
    
    table_header_style = ParagraphStyle(
        name="TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12,
        textColor=WHITE
    )

    table_cell_style = ParagraphStyle(
        name="TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=DARK_NEUTRAL
    )

    table_cell_bold_style = ParagraphStyle(
        name="TableCellBold",
        parent=table_cell_style,
        fontName="Helvetica-Bold"
    )

    flowables = []

    # ==================== PAGE 1: COVER PAGE ====================
    flowables.append(Spacer(1, 1.5 * inch))
    flowables.append(Paragraph("AI PROJECT ESTIMATE & PROPOSAL", cover_title_style))
    flowables.append(Paragraph(f"Project Scope: {project_data.get('project_name')}", cover_subtitle_style))
    flowables.append(Spacer(1, 1.0 * inch))
    
    # Metadata info table on Cover Page
    metadata_data = [
        [Paragraph("Prepared For:", table_cell_bold_style), Paragraph(f"{project_data.get('name')} ({project_data.get('email')})", table_cell_style)],
        [Paragraph("Business Domain:", table_cell_bold_style), Paragraph(project_data.get('industry', '').capitalize(), table_cell_style)],
        [Paragraph("Target Platforms:", table_cell_bold_style), Paragraph(", ".join(project_data.get('platforms', [])).title(), table_cell_style)],
        [Paragraph("Date Generated:", table_cell_bold_style), Paragraph(datetime.now().strftime("%B %d, %Y"), table_cell_style)]
    ]
    meta_table = Table(metadata_data, colWidths=[1.5 * inch, 4.5 * inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_NEUTRAL),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('BOX', (0,0), (-1,-1), 1.5, PRIMARY_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    flowables.append(meta_table)
    flowables.append(PageBreak())

    # ==================== PAGE 2: EXEC SUMMARY & COST SUMMARY ====================
    flowables.append(Paragraph("Executive Summary", h1_style))
    flowables.append(Paragraph(ai_data.get("summary", ""), body_style))
    flowables.append(Spacer(1, 15))

    flowables.append(Paragraph("Cost & Effort Summary", h1_style))
    
    # High-level estimates metrics table
    metrics_data = [
        [
            Paragraph("Total Est. Effort", table_header_style),
            Paragraph("Est. Development Cost", table_header_style),
            Paragraph("Project Timeline", table_header_style),
            Paragraph("Team Size", table_header_style)
        ],
        [
            Paragraph(f"{estimate_data.get('hours')} hours", table_cell_bold_style),
            Paragraph(f"${estimate_data.get('cost'):,.2f}", table_cell_bold_style),
            Paragraph(estimate_data.get('timeline'), table_cell_bold_style),
            Paragraph(f"{estimate_data.get('team', {}).get('size')} members", table_cell_bold_style)
        ]
    ]
    metrics_table = Table(metrics_data, colWidths=[1.625 * inch, 1.625 * inch, 1.625 * inch, 1.625 * inch])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_COLOR),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY_COLOR),
        ('BACKGROUND', (0,1), (-1,-1), LIGHT_NEUTRAL),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    flowables.append(metrics_table)
    flowables.append(Spacer(1, 10))
    
    roles_list = ", ".join(estimate_data.get('team', {}).get('roles', []))
    flowables.append(Paragraph(f"<b>Recommended Project Roles:</b> {roles_list}", body_style))
    
    # Scope of Work Selected Features
    flowables.append(Paragraph("Scope of Work Features", h1_style))
    features_list = ", ".join(project_data.get('features', [])).replace("_", " ").title()
    flowables.append(Paragraph(f"The scope of build covers: {features_list}.", body_style))
    flowables.append(PageBreak())

    # ==================== PAGE 3: ARCHITECTURE STACK & ROADMAP ====================
    flowables.append(Paragraph("Recommended Architecture Stack", h1_style))
    
    tech_data = [[Paragraph("Layer", table_header_style), Paragraph("Recommended Technology Stack", table_header_style)]]
    for layer, rec in ai_data.get("tech_stack", {}).items():
        tech_data.append([
            Paragraph(layer, table_cell_bold_style),
            Paragraph(rec, table_cell_style)
        ])
    tech_table = Table(tech_data, colWidths=[2.2 * inch, 4.3 * inch])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK_NEUTRAL),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_NEUTRAL])
    ]))
    flowables.append(tech_table)
    flowables.append(Spacer(1, 15))

    # Project Roadmap Section
    flowables.append(Paragraph("Project Implementation Roadmap", h1_style))
    
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
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_NEUTRAL])
    ]))
    flowables.append(roadmap_table)
    flowables.append(PageBreak())

    # ==================== PAGE 4: SPRINT PLAN & RISKS ====================
    flowables.append(Paragraph("Agile Sprint Planning", h1_style))
    
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
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_NEUTRAL])
    ]))
    flowables.append(sprint_table)
    flowables.append(Spacer(1, 15))

    # Risks & Mitigations
    flowables.append(Paragraph("Technical Risks & Mitigations", h1_style))
    
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
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_NEUTRAL])
    ]))
    flowables.append(risk_table)
    
    # Build Document with header and footer Disclaimers
    def add_header_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont('Helvetica', 8)
        canvas.setFillColor(DARK_NEUTRAL)
        # Header
        canvas.drawString(54, 750, f"AI Project Proposal: {project_data.get('project_name')}")
        canvas.setStrokeColor(BORDER_COLOR)
        canvas.setLineWidth(0.5)
        canvas.line(54, 742, 558, 742)
        # Footer
        page_num = canvas.getPageNumber()
        canvas.drawString(54, 36, "Confidential - Prepared by AI Project Estimator & Proposal Generator")
        canvas.drawRightString(558, 36, f"Page {page_num}")
        canvas.restoreState()

    doc.build(flowables, onFirstPage=add_header_footer, onLaterPages=add_header_footer)
    return output_path
