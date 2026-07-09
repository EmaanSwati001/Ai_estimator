import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load env variables from .env file
load_dotenv()

# Pre-defined professional fallback templates based on industry
FALLBACK_DATA = {
    "ecommerce": {
        "summary": (
            "The proposed E-commerce platform is designed to deliver a seamless, high-performance shopping "
            "experience. It addresses modern retail challenges by focusing on fast load times, mobile responsiveness, "
            "and secure transaction handling. The architecture supports product inventory management, user registration, "
            "and smooth checkout flows. By utilizing a modular design, the system can scale as product catalog and traffic grow, "
            "integrating third-party services for payments and shipments efficiently."
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
            "data encryption at rest and in transit, ensuring compliance with standard banking regulations while maintaining "
            "low-latency operations."
        ),
        "tech_stack": {
            "Frontend": "React, TypeScript for type safety, Tailwind CSS, Chart.js/Recharts for financial data visualization.",
            "Backend": "FastAPI (Python) with high-security middleware, OAuth2 + JWT token authentication.",
            "Database": "PostgreSQL with strict constraints, schema migrations (Alembic), and write-ahead transaction logs.",
            "Hosting & Infrastructure": "AWS GovCloud or isolated VPC, SSL/TLS terminates at load balancer, CloudTrail logging.",
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
            "state-of-the-art encryption protocols. Features include patient profile management, scheduling, and health reports, "
            "offered in an intuitive, accessible layout."
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
            "with minimum buffer times. The backend is structured to support scaling concurrent users during peak exam periods."
        ),
        "tech_stack": {
            "Frontend": "React + Vite, Tailwind CSS, Framer Motion for interactive learning widgets.",
            "Backend": "FastAPI (Python), WebSockets for real-time quiz updates and chat rooms.",
            "Database": "MongoDB or PostgreSQL with JSON fields for flexible course curricula.",
            "Hosting & Infrastructure": "Cloudflare CDN for video caching, AWS S3 for media storage, Vercel/AWS Amplify.",
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
            "frequently viewed profiles, database read optimization, and background worker queues for notification distribution, "
            "ensuring a highly responsive user experience."
        ),
        "tech_stack": {
            "Frontend": "React with Tailwind CSS, React Infinite Scroll, Framer Motion for micro-interactions.",
            "Backend": "FastAPI (Python) with WebSockets for instant chats, Celery for email queues.",
            "Database": "PostgreSQL for profiles/comments, Redis for session cache and feed ranking, Neo4j for network graphs.",
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
            "The proposed SaaS (Software as a Service) application is built for business efficiency and collaboration. "
            "It features tenant isolation, user role control (Admin, Member, Viewer), and subscription billing. "
            "The system focuses on high availability, clean dashboard widgets, data exporting (PDF/Excel), and API "
            "interfaces for integrations, providing value to organizations of all sizes."
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
            {"risk": "Integration failures with customer tools", "mitigation": "Provide robust webhooks, detailed API documentation, and standard SDK templates."},
            {"risk": "Sudden growth of data metrics impacting query speeds", "mitigation": "Implement proper indexing on tenant and date columns, with database partitioning."}
        ]
    },
    "other": {
        "summary": (
            "The project represents a custom software application tailored to the client's specific business process. "
            "The architecture is modular, allowing features to be added, modified, and scaled over time. "
            "By focusing on clean code practices and clear separation of concerns, the application ensures high stability "
            "and long-term maintenance compatibility."
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

def generate_ai_response(
    project_name: str,
    description: str,
    industry: str,
    platforms: list[str],
    features: list[str],
    estimate_info: dict
) -> dict:
    """
    Generates professional executive summary, tech stack, and risks.
    Uses OpenAI API if OPENAI_API_KEY exists, otherwise falls back to a template.
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
            
            # Format custom platform/features descriptions
            platforms_str = ", ".join(platforms)
            features_str = ", ".join(features)
            
            system_prompt = (
                "You are an expert solution architect and IT business analyst. "
                "Your job is to generate a professional project proposal sections in JSON format. "
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
                "     {\"risk\": \"First risk name/description\", \"mitigation\": \"First risk mitigation strategy\"},\n"
                "     {\"risk\": \"Second risk name/description\", \"mitigation\": \"Second risk mitigation strategy\"},\n"
                "     {\"risk\": \"Third risk name/description\", \"mitigation\": \"Third risk mitigation strategy\"}\n"
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
                "Generate the tailored executive summary, recommended technology stack, and top 3 technical risks with mitigations. "
                "Ensure details align with the target industry and features specified."
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
            
            # Basic validation
            if "summary" in data and "tech_stack" in data and "risks" in data:
                return data
                
        except Exception as e:
            # If OpenAI calls fail for any reason (rate limits, key invalid, network), log and fallback
            print(f"OpenAI call failed, falling back to local templates. Error: {e}")
            
    # Fallback response compilation
    # Personalize the summary with project name and details
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
        
    return {
        "summary": personal_summary,
        "tech_stack": tech_stack,
        "risks": fallback["risks"]
    }
