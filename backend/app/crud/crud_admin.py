from sqlalchemy.orm import Session
from app import models

def get_dashboard_stats(db: Session) -> dict:
    """
    Calculates statistics for the admin dashboard.
    """
    pending_count = db.query(models.user.User).filter(models.user.User.status == models.user.UserStatus.PENDING_APPROVAL).count()
    active_users_count = db.query(models.user.User).filter(models.user.User.status == models.user.UserStatus.ACTIVE).count()
    total_users_count = db.query(models.user.User).count()
    
    return {
        "pending_count": pending_count,
        "active_users_count": active_users_count,
        "total_users_count": total_users_count,
    }

def get_access_logs(db: Session, skip: int = 0, limit: int = 100) -> list[models.user.AccessLog]:
    """
    Retrieves a paginated list of all access logs, ordered by most recent.
    """
    return db.query(models.user.AccessLog).order_by(models.user.AccessLog.access_time.desc()).offset(skip).limit(limit).all()