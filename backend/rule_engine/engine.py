import math

# Hourly rate in USD
HOURLY_RATE = 100

# Base hours mapping for features
FEATURE_HOURS = {
    "auth": 40,          # User Authentication & Profiles
    "dashboard": 50,     # Dashboard & Analytics
    "payments": 30,      # Payment Integration (Stripe/Subscriptions)
    "chat": 60,          # Real-time Chat & Messaging
    "notifications": 20, # Push Notifications
    "search": 25,        # Advanced Search & Filtering
    "social": 15,        # Social Media Login/Sharing
    "upload": 25,        # File Upload & Media Storage
    "ai": 80,            # AI & Smart Recommendations
    "admin": 40,         # Admin Panel / CMS
    "multilang": 20,     # Multi-language Support
    "thirdparty": 30,    # Third-party API Integrations
    # Recommended Features Mapping
    "inventory": 40,     # Inventory Management
    "tracking": 35,      # Order Tracking
    "reviews": 20,       # Reviews & Ratings
    "wishlist": 15,      # Wishlist
    "coupons": 20,       # Coupon System
    "scheduling": 40,    # Appointment Scheduling
    "telehealth": 60,    # Video Consultation
    "healthrecords": 50, # Secure EHR Data
    "quiz": 30,          # Course Quizzes
    "streaming": 50,     # Video Streaming
    "analytics": 40,     # Advanced Analytics Dashboard
    "moderation": 35,    # Content Moderation
    "security": 50,      # Compliance Audits
    "collaboration": 45, # Collaboration Tools
    "export": 20         # Data Export CSV/PDF
}

# Industry multipliers
INDUSTRY_MULTIPLIERS = {
    "ecommerce": 1.2,
    "finance": 1.4,
    "healthcare": 1.5,
    "education": 1.1,
    "social": 1.2,
    "saas": 1.1,
    "other": 1.0
}

def get_platform_multiplier(platforms: list[str]) -> float:
    """
    Calculate platform multiplier based on combination of selections.
    Supports 'web', 'mobile', and 'desktop'.
    """
    # Normalize platforms to lowercase
    normalized = [p.lower() for p in platforms]
    
    has_web = "web" in normalized
    has_mobile = "mobile" in normalized
    has_desktop = "desktop" in normalized
    
    count = sum([has_web, has_mobile, has_desktop])
    
    if count == 0:
        return 1.0
    if count == 1:
        if has_mobile:
            return 1.3
        if has_desktop:
            return 1.2
        return 1.0  # Web only
    if count == 2:
        if has_web and has_mobile:
            return 1.7
        if has_web and has_desktop:
            return 1.5
        return 1.8  # Mobile + Desktop
    return 2.2  # All three

def calculate_estimate(
    features: list[str],
    platforms: list[str],
    industry: str
) -> dict:
    """
    Computes hours, cost, timeline, and team composition based on project attributes.
    """
    # Calculate base hours
    base_hours = sum(FEATURE_HOURS.get(f.lower(), 20) for f in features)
    if base_hours == 0:
        # Default fallback hours if no features selected
        base_hours = 40

    # Get multipliers
    platform_mult = get_platform_multiplier(platforms)
    industry_mult = INDUSTRY_MULTIPLIERS.get(industry.lower(), 1.0)

    # Compute total hours
    total_hours = round(base_hours * platform_mult * industry_mult)
    
    # Calculate cost
    total_cost = total_hours * HOURLY_RATE
    
    # Determine team size and roles
    if total_hours <= 100:
        team_size = 1
        team_roles = ["Full-Stack Developer"]
        weeks = max(2, round(total_hours / 30))
    elif total_hours <= 300:
        team_size = 2
        team_roles = ["Frontend Developer", "Backend Developer"]
        weeks = max(4, round(total_hours / 50))
    elif total_hours <= 600:
        team_size = 3
        team_roles = ["Frontend Developer", "Backend Developer", "QA Engineer / PM"]
        weeks = max(6, round(total_hours / 70))
    else:
        team_size = 5
        team_roles = ["Project Manager", "UI/UX Designer", "Frontend Developer", "Backend Developer", "QA Engineer"]
        weeks = max(8, round(total_hours / 100))
        
    timeline_str = f"{weeks} weeks" if weeks == 1 else f"{weeks - 1}-{weeks + 1} weeks"
    if weeks <= 2:
        timeline_str = f"{weeks} weeks"
        
    return {
        "hours": total_hours,
        "cost": float(total_cost),
        "timeline": timeline_str,
        "team": {
            "size": team_size,
            "roles": team_roles
        }
    }
