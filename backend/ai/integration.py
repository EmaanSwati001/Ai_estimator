import os
import re
import math
import json
import random
from openai import OpenAI
from dotenv import load_dotenv

# Load env variables from .env file
load_dotenv()

# Pre-defined professional feature recommendation datasets by industry
RECOMMENDATIONS_DATA = {
    "ecommerce": [
        {"id": "inventory", "name": "Inventory Management", "desc": "Track stock levels, product variants, and automatic low-stock notifications.", "effort": "Medium"},
        {"id": "tracking", "name": "Real-time Order Tracking", "desc": "Interactive delivery timelines with courier API sync (FedEx/UPS).", "effort": "Medium"},
        {"id": "reviews", "name": "Product Reviews & Ratings", "desc": "Allowed buyers to submit ratings, text reviews, and photo uploads.", "effort": "Small"},
        {"id": "wishlist", "name": "Customer Wishlists", "desc": "Bookmark items, share wishlists with friends, and track price changes.", "effort": "Small"},
        {"id": "coupons", "name": "Coupon & Discount Engines", "desc": "Dynamic promo codes, custom rules, and flash sales setups.", "effort": "Small"}
    ],
    "finance": [
        {"id": "security", "name": "Fintech Compliance Auditing", "desc": "Log all mutations in an immutable database audit trail.", "effort": "Large"},
        {"id": "analytics", "name": "Financial Analytics Dashboards", "desc": "Visual spending breakdowns, projections, and recurring charges analytics.", "effort": "Medium"},
        {"id": "export", "name": "Automated PDF/CSV Statements", "desc": "Clean export summaries of transaction history and taxes.", "effort": "Small"},
        {"id": "thirdparty", "name": "Open Banking Sync", "desc": "Direct integration connecting secure bank account APIs.", "effort": "Medium"}
    ],
    "healthcare": [
        {"id": "telehealth", "name": "Video Consultation Rooms", "desc": "Integrated patient-doctor telehealth meetings via web/mobile.", "effort": "Large"},
        {"id": "healthrecords", "name": "EHR / FHIR Interoperability", "desc": "Sync patient health vitals securely matching hospital API schemas.", "effort": "Large"},
        {"id": "scheduling", "name": "Doctor Booking Calendar", "desc": "Interactive calendar allowing scheduling and rescheduling.", "effort": "Medium"},
        {"id": "billing", "name": "Insurance Verification Engine", "desc": "Submit diagnostic codes and verify coverage in real-time.", "effort": "Medium"}
    ],
    "education": [
        {"id": "quiz", "name": "Agile Quiz & Certificates", "desc": "Dynamic assignments with automated grading and PDF certificates.", "effort": "Medium"},
        {"id": "streaming", "name": "Adaptive Video Lecture player", "desc": "HLS streaming support for bandwidth-sensitive student streams.", "effort": "Large"},
        {"id": "collaboration", "name": "Student Study Forums", "desc": "Threaded message boards with role permissions for moderation.", "effort": "Medium"},
        {"id": "export", "name": "Syllabus Exporter", "desc": "Generate custom course material schedules for students.", "effort": "Small"}
    ],
    "social": [
        {"id": "moderation", "name": "AI Content Moderation", "desc": "Filter posts, block inappropriate files, and highlight spammers.", "effort": "Medium"},
        {"id": "analytics", "name": "Profile View Analytics", "desc": "Interactive chart dashboards displaying profile reach stats.", "effort": "Medium"},
        {"id": "search", "name": "Faceted Connection Search", "desc": "Find members by proximity, common interests, and occupation tags.", "effort": "Small"}
    ],
    "saas": [
        {"id": "export", "name": "Custom Organization Exporter", "desc": "Export custom task reports matching company letterheads.", "effort": "Small"},
        {"id": "collaboration", "name": "Shared Workspaces", "desc": "Allows multiple corporate members to edit dashboard elements.", "effort": "Medium"},
        {"id": "analytics", "name": "Corporate Logs Visualizer", "desc": "Identify bottleneck workflows inside operations dashboards.", "effort": "Medium"}
    ],
    "other": [
        {"id": "export", "name": "Automated Report Builder", "desc": "Draft PDF document summaries matching specific inputs.", "effort": "Small"},
        {"id": "analytics", "name": "Universal Charts UI", "desc": "Render basic line, bar, and pie diagrams based on CSV loads.", "effort": "Medium"},
        {"id": "scheduling", "name": "Global Meeting Scheduler", "desc": "Book general tasks events inside calendars.", "effort": "Medium"}
    ]
}

# Pre-defined professional fallback templates based on industry for main generation
FALLBACK_DATA = {
    "ecommerce": {
        "summary": (
            "The proposed E-commerce platform is designed to deliver a seamless, high-performance shopping "
            "experience. It addresses retail challenges by focusing on fast load times, mobile responsiveness, "
            "and transaction handling. The architecture supports product inventory management, user registration, "
            "and smooth checkout flows. By utilizing a modular design, the system can scale as product catalog and traffic grow."
        ),
        "tech_stack": {
            "Frontend": "React + Vite, Tailwind CSS for styling, Redux Toolkit for state management.",
            "Backend": "FastAPI (Python) for fast, asynchronous API endpoints, Pydantic for validation.",
            "Database": "PostgreSQL for robust relational data (products, users, orders) with Redis for caching.",
            "Hosting & Infrastructure": "AWS S3 for product images, Docker containerization, AWS ECS/Fargate for compute.",
            "External Integrations": "Stripe API for payment processing, SendGrid for order confirmation emails."
        },
        "risks": [
            {"risk": "Payment Gateway downtime during peak hours", "mitigation": "Implement queue retry mechanisms and local transaction logging."},
            {"risk": "Cart abandonment due to slow checkout UI", "mitigation": "Optimize checkout steps, use client-side state caching, and offer guest checkout options."},
            {"risk": "SQL injection on product search filters", "mitigation": "Utilize SQLAlchemy parameterized queries and strictly validate search inputs using Pydantic."}
        ]
    },
    "finance": {
        "summary": (
            "The project aims to build a secure, audit-compliant financial application tailored for modern fintech services. "
            "Security and accuracy are the core pillars of the proposed solution. The system features multi-factor authentication, "
            "role-based access controls, and detailed ledger logging for all transactions. The backend architecture prioritizes "
            "data encryption at rest and in transit."
        ),
        "tech_stack": {
            "Frontend": "React, TypeScript for type safety, Tailwind CSS, Recharts for financial data visualization.",
            "Backend": "FastAPI (Python) with high-security middleware, OAuth2 + JWT token authentication.",
            "Database": "PostgreSQL with strict constraints, schema migrations (Alembic), and write-ahead transaction logs.",
            "Hosting & Infrastructure": "AWS isolated VPC, SSL/TLS terminates at load balancer, CloudTrail logging.",
            "External Integrations": "Plaid API for bank account connections, Plivo for SMS-based 2FA."
        },
        "risks": [
            {"risk": "Compliance issues and regulatory audits", "mitigation": "Ensure database logging stores all system modifications; maintain detailed audit trails."},
            {"risk": "Data leakage of sensitive customer financial records", "mitigation": "Implement AES-256 field-level encryption for personal identifiable information (PII)."},
            {"risk": "Distributed Denial of Service (DDoS) on transaction API", "mitigation": "Set up AWS Shield, Cloudflare rate limiting, and backend request throttling."}
        ]
    },
    "healthcare": {
        "summary": (
            "The proposed digital health application is designed to connect patients and healthcare providers. "
            "The core focus is HIPAA compliance, patient privacy, and clear health data tracking. "
            "The application architecture separates protected health information (PHI) from transactional logs and utilizes "
            "encryption protocols. Features include patient profile management, scheduling, and health reports."
        ),
        "tech_stack": {
            "Frontend": "React, Tailwind CSS, Next-Gen UI library with accessibility features conforming to WCAG 2.1.",
            "Backend": "FastAPI (Python) with security auditing, encrypted logging, token-based authentication.",
            "Database": "AWS Aurora PostgreSQL (HIPAA-compliant configuration) with automated daily backups.",
            "Hosting & Infrastructure": "AWS HIPAA-compliant host, KMS for encryption key management, AWS IAM restricted access.",
            "External Integrations": "Twilio for telehealth video, integration with Electronic Health Record (EHR) APIs via FHIR standards."
        },
        "risks": [
            {"risk": "HIPAA compliance violations on data leaks", "mitigation": "Ensure PHI is encrypted both at rest (AWS KMS) and in transit (TLS 1.3). Set up strict access policies."},
            {"risk": "Low doctor adoption due to complex software interface", "mitigation": "Run interactive workshops, include a dedicated onboarding flow, and keep layouts uncluttered."},
            {"risk": "Sync delay of patient records across clinics", "mitigation": "Use asynchronous message queues (RabbitMQ/Celery) to handle data sync in the background."}
        ]
    },
    "education": {
        "summary": (
            "The proposed EdTech platform delivers a virtual learning environment for students and teachers. "
            "It emphasizes course management, content consumption, and interactive quizzes. "
            "The solution is optimized for varying network conditions, allowing students to access videos and text materials "
            "with minimum buffer times."
        ),
        "tech_stack": {
            "Frontend": "React + Vite, Tailwind CSS, Framer Motion for interactive learning widgets.",
            "Backend": "FastAPI (Python), WebSockets for real-time quiz updates and chat rooms.",
            "Database": "MongoDB or PostgreSQL with JSON fields for course curricula.",
            "Hosting & Infrastructure": "Cloudflare CDN for video caching, AWS S3 for media storage, AWS Amplify.",
            "External Integrations": "Zoom API for live lectures, Vimeo API for video hosting, Zoom SDK for inside-app calls."
        },
        "risks": [
            {"risk": "Video streaming buffering on low bandwidth connections", "mitigation": "Implement adaptive bitrate streaming (HLS/DASH) and utilize Cloudflare CDN."},
            {"risk": "Cheating on quizzes and assignments", "mitigation": "Randomize question orders, disable copy-paste actions on quiz pages, and add strict submission timeouts."},
            {"risk": "Media storage costs rising quickly with course uploads", "mitigation": "Apply automatic video compression and transcoding tools (AWS Elemental MediaConvert) on upload."}
        ]
    },
    "social": {
        "summary": (
            "The project aims to build an engaging social networking platform. It prioritizes user engagement, "
            "activity feeds, real-time messaging, and media sharing. The architecture focuses on caching "
            "frequently viewed profiles, database read optimization, and background worker queues."
        ),
        "tech_stack": {
            "Frontend": "React with Tailwind CSS, React Infinite Scroll, Framer Motion for micro-interactions.",
            "Backend": "FastAPI (Python) with WebSockets for instant chats, Celery for email queues.",
            "Database": "PostgreSQL for profiles/comments, Redis for session cache and feed ranking.",
            "Hosting & Infrastructure": "AWS EC2 instances under an Auto Scaling Group, CloudFront for media distribution.",
            "External Integrations": "Firebase Cloud Messaging for push notifications, Google/Facebook login APIs."
        },
        "risks": [
            {"risk": "Database performance bottleneck due to newsfeed reads", "mitigation": "Implement pre-computed feeds in Redis cache and query in batches."},
            {"risk": "Spam accounts and malicious post submissions", "mitigation": "Implement Captcha on registration, spam filters, and report flags on posts."},
            {"risk": "High image upload bandwidth and storage usage", "mitigation": "Transcode images to WebP format on upload and compress resolution before storing in AWS S3."}
        ]
    },
    "saas": {
        "summary": (
            "The proposed SaaS application is built for business efficiency and collaboration. "
            "It features tenant isolation, user role control (Admin, Member, Viewer), and subscription billing. "
            "The system focuses on high availability, clean dashboard widgets, and exporting metrics."
        ),
        "tech_stack": {
            "Frontend": "React, Tailwind CSS, Recharts for data dashboards, Tailwind UI components.",
            "Backend": "FastAPI, PyJWT for authentication, SQLAlchemy ORM with multi-tenant schemas.",
            "Database": "PostgreSQL (logical separation of tenant data via tenant_id index).",
            "Hosting & Infrastructure": "AWS ECS, RDS Multi-AZ for failover security, Cloudwatch monitoring.",
            "External Integrations": "Stripe Billing/Customer Portal for subscriptions, Postmark for business transactional emails."
        },
        "risks": [
            {"risk": "Cross-tenant data access (Security Leak)", "mitigation": "Implement database row-level security (RLS) or global query filters on tenant_id."},
            {"risk": "Integration failures with customer tools", "mitigation": "Provide webhooks, detailed API documentation, and standard SDK templates."},
            {"risk": "Sudden growth of data metrics impacting query speeds", "mitigation": "Implement proper indexing on tenant and date columns, with database partitioning."}
        ]
    },
    "other": {
        "summary": (
            "The project represents a custom software application tailored to the client's specific process. "
            "The architecture is modular, allowing features to be added, modified, and scaled over time. "
            "By focusing on clean code practices and clear separation of concerns, the application ensures high stability."
        ),
        "tech_stack": {
            "Frontend": "React + Vite, CSS Modules / Tailwind CSS for responsive user interface designs.",
            "Backend": "FastAPI (Python) for API logic, Pydantic for validation, SQLAlchemy for database queries.",
            "Database": "SQLite for initial staging, migrating to PostgreSQL for production deployments.",
            "Hosting & Infrastructure": "Docker containers, deployment on Render, DigitalOcean, or AWS.",
            "External Integrations": "SendGrid for automated notifications, Google OAuth for single-sign-on (SSO)."
        },
        "risks": [
            {"risk": "Requirement creep during early development phase", "mitigation": "Lock down milestone definitions and iterate in two-week agile sprint cycles."},
            {"risk": "Integration delays with legacy internal databases", "mitigation": "Develop REST adapters and mock schemas to run parallel frontend development."},
            {"risk": "Low user adoption due to manual data migration", "mitigation": "Create bulk CSV/JSON import scripts to migrate historic records rapidly."}
        ]
    }
}

def generate_feature_recommendations(industry: str, features: list[str]) -> list[dict]:
    """
    Generates intelligent feature suggestions based on project settings.
    Utilizes OpenAI API if available, otherwise falls back to pre-defined templates.
    """
    api_key = os.environ.get("OPENAI_API_KEY")
    ind_key = industry.lower()
    fallback_recs = RECOMMENDATIONS_DATA.get(ind_key, RECOMMENDATIONS_DATA["other"])
    
    # Filter out features already selected in input basic features
    selected_lowered = [f.lower() for f in features]
    filtered_fallback = [r for r in fallback_recs if r["id"].lower() not in selected_lowered]
    
    if api_key:
        try:
            client = OpenAI(api_key=api_key)
            system_prompt = (
                "You are an expert software product manager. Based on the client's industry "
                "and their initial feature choices, suggest 4 to 6 intelligent, relevant recommendations. "
                "Respond ONLY with a JSON object. The response must match exactly this JSON format:\n"
                "{\n"
                "  \"recommendations\": [\n"
                "     {\"id\": \"unique_short_id\", \"name\": \"Feature Name\", \"desc\": \"One-line explanation\", \"effort\": \"Small/Medium/Large\"}\n"
                "  ]\n"
                "}"
            )
            
            user_prompt = (
                f"Project Industry: {industry}\n"
                f"Basic Selected Features: {', '.join(features)}\n"
                "\n"
                "Provide recommendations that build upon these. For effort, estimate based on software scale "
                "(Small for <30h features, Medium for 30-50h features, Large for 50h+ features)."
            )
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            data = json.loads(response.choices[0].message.content.strip())
            if "recommendations" in data and isinstance(data["recommendations"], list):
                # Ensure returned items don't collide with existing selections
                cleaned_recs = []
                for r in data["recommendations"]:
                    if "id" in r and "name" in r and "desc" in r and "effort" in r:
                        if r["id"].lower() not in selected_lowered:
                            cleaned_recs.append(r)
                if cleaned_recs:
                    return cleaned_recs
        except Exception as e:
            print(f"OpenAI recommendations failed, falling back. Error: {e}")
            
    return filtered_fallback

def get_fallback_roadmap(features: list[str], industry: str, estimate_info: dict) -> list[dict]:
    """
    Computes a realistic 3-phase roadmap based on selected features.
    """
    timeline_str = estimate_info["timeline"]
    # Estimate total weeks from string (e.g. "4-6 weeks" or "3 weeks")
    weeks = 6
    try:
        parts = [int(s) for s in timeline_str.split() if s.isdigit()]
        if parts:
            weeks = max(3, parts[-1])
    except:
        pass
        
    w_ph1 = max(1, round(weeks * 0.3))
    w_ph2 = max(1, round(weeks * 0.5))
    w_ph3 = max(1, weeks - w_ph1 - w_ph2)
    
    # Feature category division
    fe_lower = [f.lower() for f in features]
    
    ph1_items = ["Database Schema setup", "Core API configurations"]
    if "auth" in fe_lower or "social" in fe_lower:
        ph1_items.append("User Accounts & Authentication module")
    else:
        ph1_items.append("Basic Account Roles framework")
        
    ph2_items = []
    for f in features:
        f_title = f.replace("_", " ").title()
        if f.lower() not in ["auth", "social"]:
            ph2_items.append(f"{f_title} module development")
    if not ph2_items:
        ph2_items.append("Core custom business dashboard flow")
        
    ph3_items = [
        "Quality Assurance & Integration tests",
        "Performance optimization runs"
    ]
    if "payments" in fe_lower:
        ph3_items.append("PCI audits & billing live runs check")
    if "security" in fe_lower:
        ph3_items.append("Regulatory compliance validation review")
    ph3_items.append("Cloud production environment deployment")

    return [
        {
            "title": "Phase 1: Foundations & User Core",
            "features": ph1_items,
            "duration": f"{w_ph1} Weeks" if w_ph1 > 1 else "1 Week"
        },
        {
            "title": "Phase 2: Product Core Modules",
            "features": ph2_items,
            "duration": f"{w_ph2} Weeks" if w_ph2 > 1 else "1 Week"
        },
        {
            "title": "Phase 3: QA, Security & Deployment",
            "features": ph3_items,
            "duration": f"{w_ph3} Weeks" if w_ph3 > 1 else "1 Week"
        }
    ]

def get_fallback_sprint_plan(features: list[str], industry: str, estimate_info: dict) -> list[dict]:
    """
    Groups tasks into Agile sprints depending on the estimated hours.
    """
    total_hours = estimate_info["hours"]
    roles = estimate_info["team"]["roles"]
    
    # Determine sprint counts (Assume 2-week sprints, i.e., 80 hours per developer)
    # Average sprint capability
    dev_capacity_per_sprint = 80
    total_capacity_sprint = dev_capacity_per_sprint * estimate_info["team"]["size"]
    sprint_count = max(2, min(5, math.ceil(total_hours / total_capacity_sprint)))
    
    sprints = []
    
    # Divide features roughly across sprints
    for s_idx in range(1, sprint_count + 1):
        s_effort = round(total_hours / sprint_count)
        
        if s_idx == 1:
            objectives = "Establish infrastructure, build base APIs, and set up landing dashboard frames."
            deliverables = [
                "Docker infrastructure and API templates initialized",
                "Database migrations complete and connected locally",
                "User account registration UI & Backend logic verified"
            ]
        elif s_idx == sprint_count:
            objectives = "Complete end-to-end integration tests, resolve UI issues, and deploy to staging."
            deliverables = [
                "Full integration unit test suite checks passing",
                "Responsive styling issues resolved across web/mobile viewports",
                "Continuous Integration (CI/CD) pipelines running successfully"
            ]
        else:
            objectives = f"Implement functional milestones and complete user feature blocks (Sprint {s_idx} scope)."
            deliverables = [
                f"Feature milestone block {s_idx} validation complete",
                "API endpoints connected to client UI components",
                "Local developer documentation logs compiled"
            ]
            
        sprints.append({
            "title": f"Sprint {s_idx}",
            "objectives": objectives,
            "effort": f"{s_effort} Hours",
            "deliverables": deliverables,
            "progress": 0 if s_idx > 1 else 100 # Initial sprint marked complete, others pending
        })
        
    return sprints

def generate_ai_response(
    project_name: str,
    description: str,
    industry: str,
    platforms: list[str],
    features: list[str],
    estimate_info: dict
) -> dict:
    """
    Generates professional executive summary, tech stack, risks, roadmap, and sprint plans.
    Uses OpenAI API if OPENAI_API_KEY exists, otherwise falls back to a template generator.
    """
    api_key = os.environ.get("OPENAI_API_KEY")
    
    # Pre-select normalized industry fallback
    ind_key = industry.lower()
    if ind_key not in FALLBACK_DATA:
        ind_key = "other"
    fallback = FALLBACK_DATA[ind_key]
    
    # If API key exists, call OpenAI
    if api_key:
        try:
            client = OpenAI(api_key=api_key)
            platforms_str = ", ".join(platforms)
            features_str = ", ".join(features)
            
            system_prompt = (
                "You are an expert solution architect and IT business analyst. "
                "Your job is to generate a professional project proposal in JSON format. "
                "Respond ONLY with a valid JSON object. Do not include markdown codeblocks or text around it."
                "The JSON object must contain exactly the following structure:\n"
                "{\n"
                "  \"summary\": \"A 3-5 sentence professional executive summary of this software project.\",\n"
                "  \"tech_stack\": {\n"
                "     \"Frontend\": \"Recommended frontend technology list\",\n"
                "     \"Backend\": \"Recommended backend technologies\",\n"
                "     \"Database\": \"Recommended database system\",\n"
                "     \"Hosting & Infrastructure\": \"Recommended hosting details\",\n"
                "     \"External Integrations\": \"Third-party integrations list\"\n"
                "  },\n"
                "  \"risks\": [\n"
                "     {\"risk\": \"First risk description\", \"mitigation\": \"First risk mitigation strategy\"},\n"
                "     {\"risk\": \"Second risk description\", \"mitigation\": \"Second risk mitigation strategy\"},\n"
                "     {\"risk\": \"Third risk description\", \"mitigation\": \"Third risk mitigation strategy\"}\n"
                "  ],\n"
                "  \"roadmap\": [\n"
                "     {\"title\": \"Phase 1: Foundation Name\", \"features\": [\"Feature A\", \"Feature B\"], \"duration\": \"2 Weeks\"},\n"
                "     {\"title\": \"Phase 2: Core Development\", \"features\": [\"Feature C\", \"Feature D\"], \"duration\": \"4 Weeks\"},\n"
                "     {\"title\": \"Phase 3: Integration & QA\", \"features\": [\"Testing\", \"Deployment\"], \"duration\": \"2 Weeks\"}\n"
                "  ],\n"
                "  \"sprint_plan\": [\n"
                "     {\n"
                "       \"title\": \"Sprint 1\",\n"
                "       \"objectives\": \"Sprint 1 objectives summary\",\n"
                "       \"effort\": \"80 Hours\",\n"
                "       \"deliverables\": [\"Deliverable A\", \"Deliverable B\"],\n"
                "       \"progress\": 100\n"
                "     }\n"
                "  ]\n"
                "}"
            )
            
            user_prompt = (
                f"Project Name: {project_name}\n"
                f"Description: {description}\n"
                f"Industry: {industry}\n"
                f"Platforms: {platforms_str}\n"
                f"Features: {features_str}\n"
                f"Calculated Hours: {estimate_info['hours']}\n"
                f"Calculated Cost: ${estimate_info['cost']}\n"
                f"Calculated Timeline: {estimate_info['timeline']}\n"
                f"Recommended Team: {estimate_info['team']['size']} people ({', '.join(estimate_info['team']['roles'])})\n"
                "\n"
                "Generate the executive summary, tech stack, top 3 risks, a 3-phase project roadmap, "
                "and a logical list of Agile sprints. Ensure everything aligns perfectly. "
                "In sprint_plan, generate between 2 to 5 sprints according to project scope."
            )
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content.strip()
            data = json.loads(content)
            
            # Validation
            if "summary" in data and "tech_stack" in data and "risks" in data and "roadmap" in data and "sprint_plan" in data:
                return data
                
        except Exception as e:
            print(f"OpenAI call failed, falling back to local templates. Error: {e}")
            
    # Fallback response compilation
    personal_summary = (
        f"The proposed project '{project_name}' is designed to serve as a high-quality {industry} platform. "
        f"Built for {', '.join(platforms)}, it incorporates core features including {', '.join(features[:4])}. "
        f"{fallback['summary']}"
    )
    
    # Custom-tailor technology stack recommendations based on platforms selection
    tech_stack = fallback["tech_stack"].copy()
    
    # Tailor Frontend depending on platform selections
    plat_lower = [p.lower() for p in platforms]
    frontend_rec = []
    if "web" in plat_lower:
        frontend_rec.append("React + Vite (Tailwind CSS, Framer Motion)")
    if "mobile" in plat_lower:
        frontend_rec.append("React Native (Expo, NativeWind) for mobile app deployment")
    if "desktop" in plat_lower:
        frontend_rec.append("Electron / Tauri for desktop app containerization")
        
    if frontend_rec:
        tech_stack["Frontend"] = " + ".join(frontend_rec)
        
    # Generate roadmap and sprint plan fallbacks
    roadmap = get_fallback_roadmap(features, industry, estimate_info)
    sprint_plan = get_fallback_sprint_plan(features, industry, estimate_info)
    
    return {
        "summary": personal_summary,
        "tech_stack": tech_stack,
        "risks": fallback["risks"],
        "roadmap": roadmap,
        "sprint_plan": sprint_plan
    }



