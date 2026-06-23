from fastapi import APIRouter

from app.routes import activity_logs, ai, applications, auth, notifications, pfe, reports, stages, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(stages.router, prefix="/stages", tags=["Stages"])
api_router.include_router(applications.router, prefix="/applications", tags=["Candidatures"])
api_router.include_router(pfe.router, prefix="/pfe", tags=["PFE"])
api_router.include_router(reports.router, prefix="/reports", tags=["Rapports"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(activity_logs.router, prefix="/activity-logs", tags=["Activity Logs"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
