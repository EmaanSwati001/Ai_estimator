import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

# Define color palette
PRIMARY_COLOR = colors.HexColor("#4f46e5")    # Indigo
SECONDARY_COLOR = colors.HexColor("#7c3aed")  # Purple
DARK_NEUTRAL = colors.HexColor("#1f2937")     # Dark slate
LIGHT_NEUTRAL = colors.HexColor("#f9fafb")    # Very light gray
BORDER_COLOR = colors.HexColor("#e5e7eb")     # Light gray border
WHITE = colors.HexColor("#ffffff")

def generate_proposal_pdf(
    project_data: dict,
    estimate_data: dict,
    ai_data: dict,
    output_path: str
) -> str:
    """
    Generates a beautifully styled, professional PDF proposal report.
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
    
    # Custom styles
    title_style = ParagraphStyle(
        name="DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=26,
        leading=32,
        textColor=PRIMARY_COLOR,
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        name="DocSubTitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=14,
        leading=18,
        textColor=DARK_NEUTRAL,
        spaceAfter=30
    )

    h1_style = ParagraphStyle(
        name="SectionHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        textColor=SECONDARY_COLOR,
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        name="SubSectionHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=DARK_NEUTRAL,
        spaceBefore=10,
        spaceAfter=6,
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
    
    bold_body_style = ParagraphStyle(
        name="DocBodyBold",
        parent=body_style,
        fontName="Helvetica-Bold"
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

    # --- Title Page / Cover Section ---
    flowables.append(Paragraph("Software Project Proposal", title_style))
    flowables.append(Paragraph(f"Project Name: {project_data.get('project_name')}", subtitle_style))
    
    # Metadata info table
    metadata_data = [
        [Paragraph("Prepared For:", table_cell_bold_style), Paragraph(f"{project_data.get('name')} ({project_data.get('email')})", table_cell_style)],
        [Paragraph("Industry Domain:", table_cell_bold_style), Paragraph(project_data.get('industry', '').capitalize(), table_cell_style)],
        [Paragraph("Target Platforms:", table_cell_bold_style), Paragraph(", ".join(project_data.get('platforms', [])).title(), table_cell_style)],
        [Paragraph("Date Generated:", table_cell_bold_style), Paragraph(datetime.now().strftime("%B %d, %Y"), table_cell_style)]
    ]
    meta_table = Table(metadata_data, colWidths=[1.5 * inch, 5.0 * inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_NEUTRAL),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    flowables.append(meta_table)
    flowables.append(Spacer(1, 20))

    # --- Executive Summary ---
    flowables.append(Paragraph("Executive Summary", h1_style))
    flowables.append(Paragraph(ai_data.get("summary", ""), body_style))
    flowables.append(Spacer(1, 15))

    # --- Estimates & Cost Breakdown ---
    flowables.append(Paragraph("Cost & Timeline Estimates", h1_style))
    
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
    
    # Team Composition Description
    roles_list = ", ".join(estimate_data.get('team', {}).get('roles', []))
    flowables.append(Paragraph(f"<b>Recommended Project Roles:</b> {roles_list}", body_style))
    flowables.append(Spacer(1, 15))

    # --- Feature Breakdown ---
    flowables.append(Paragraph("Scope of Work & Features", h1_style))
    
    # Standard mapping for details to print in PDF
    feature_meta = {
        "auth": ("Authentication", "Secure user sign up, login, password recovery, and user profiles."),
        "dashboard": ("Dashboard & Analytics", "Interactive metrics, graphical data charts, and usage analysis."),
        "payments": ("Payment Gateway", "Stripe payment checkouts, invoice billing, and subscriptions handler."),
        "chat": ("Real-time Chat", "Messaging systems, socket-based delivery, and chat history storage."),
        "notifications": ("Push Notifications", "In-app alerts, mobile device registration, and notification history."),
        "search": ("Advanced Search", "Faceted indexing, filtering, search keywords, and high-speed retrieval."),
        "social": ("Social Integration", "Social single-sign-on (SSO) and direct text sharing buttons."),
        "upload": ("Media Storage", "Cloud file uploading, file organization directories, and media compression."),
        "ai": ("AI Recommendations", "Intelligent machine-learning matching, recommendations engine, and smart text output."),
        "admin": ("Admin CMS Panel", "Database management interface, user bans, and app configuration keys."),
        "multilang": ("Multi-Language", "Localization setup, translated labels, and user language settings selector."),
        "thirdparty": ("Third-Party APIs", "Integrations connecting internal dashboards with generic exterior service tools.")
    }
    
    feature_rows = [[Paragraph("Feature Name", table_header_style), Paragraph("Description", table_header_style)]]
    for feat_key in project_data.get('features', []):
        feat_name, feat_desc = feature_meta.get(feat_key.lower(), (feat_key.replace('_', ' ').title(), "Custom project feature implementation."))
        feature_rows.append([
            Paragraph(feat_name, table_cell_bold_style),
            Paragraph(feat_desc, table_cell_style)
        ])
        
    feat_table = Table(feature_rows, colWidths=[2.2 * inch, 4.3 * inch])
    feat_table.setStyle(TableStyle([
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
    flowables.append(feat_table)
    flowables.append(Spacer(1, 20))

    # --- Technical Recommendations & Architecture ---
    flowables.append(Paragraph("Recommended Technology Stack", h1_style))
    
    tech_data = [[Paragraph("Layer", table_header_style), Paragraph("Recommended Technology", table_header_style)]]
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
    flowables.append(Spacer(1, 20))

    # --- Risks & Mitigations ---
    flowables.append(Paragraph("Technical Risks & Mitigations", h1_style))
    
    risk_rows = [[Paragraph("Identified Risk Factor", table_header_style), Paragraph("Proposed Mitigation Strategy", table_header_style)]]
    for r_item in ai_data.get("risks", []):
        risk_rows.append([
            Paragraph(r_item.get("risk", ""), table_cell_bold_style),
            Paragraph(r_item.get("mitigation", ""), table_cell_style)
        ])
    risk_table = Table(risk_rows, colWidths=[3.05 * inch, 3.45 * inch])
    risk_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#dc2626")), # Red header for risks
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
    
    # Build Document
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
