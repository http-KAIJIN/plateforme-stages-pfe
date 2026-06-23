import sys
import uuid
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BACKEND = ROOT / "backend"
sys.path.insert(0, str(BACKEND))

from pypdf import PdfWriter
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.database.session import SessionLocal
from app.models.application import Application
from app.models.notification import Notification
from app.models.pfe import PFE
from app.models.report import Report
from app.models.stage import Stage
from app.models.user import User

PASSWORD = "SoutenanceDemo2026!"
DOMAIN = "soutenance.stagepfe.com"

students = [
    "Yassine El Amrani",
    "Sara Benali",
    "Mehdi Alaoui",
    "Nour El Fassi",
    "Imane Berrada",
    "Omar Tazi",
    "Lina Mansouri",
    "Adam Chraibi",
]
companies = ["DataNova Solutions", "Atlas Web Factory", "AI Labs Morocco", "CloudBridge Consulting"]
supervisors = ["Dr. Amal Idrissi", "Pr. Karim Bennani", "Dr. Salma Rami"]

offers = [
    ("DataNova Solutions", "Stage Data Analyst Python SQL", "Analyse de donnees clients, tableaux de bord et automatisation reporting.", "Python SQL Power BI Pandas"),
    ("DataNova Solutions", "Stage Machine Learning Scoring", "Creation d'un modele de scoring pour classifier les profils utilisateurs.", "Python Machine Learning Scikit-learn SQL"),
    ("DataNova Solutions", "Stage BI PostgreSQL", "Modelisation d'un data mart et indicateurs metiers.", "PostgreSQL SQL Data Visualization"),
    ("Atlas Web Factory", "Stage Frontend React Tailwind", "Developpement d'interfaces modernes et responsives pour applications SaaS.", "React Tailwind JavaScript API"),
    ("Atlas Web Factory", "Stage Full-Stack FastAPI React", "Implementation de modules web avec API FastAPI et frontend React.", "FastAPI React PostgreSQL JWT"),
    ("Atlas Web Factory", "Stage UX Dashboard", "Conception et integration de dashboards analytiques.", "React Recharts Tailwind UX"),
    ("AI Labs Morocco", "Stage NLP Classification", "Classification automatique de documents et extraction de mots-cles.", "Python NLP Machine Learning"),
    ("AI Labs Morocco", "Stage Computer Vision", "Prototype de detection d'objets pour controle qualite.", "Python Computer Vision Deep Learning"),
    ("AI Labs Morocco", "Stage IA Generative", "Assistant intelligent pour recherche documentaire interne.", "Python LLM API Vector Database"),
    ("CloudBridge Consulting", "Stage DevOps Docker", "Conteneurisation et automatisation de deploiements.", "Docker Linux Git CI/CD"),
    ("CloudBridge Consulting", "Stage Kubernetes Monitoring", "Monitoring applicatif et orchestration Kubernetes.", "Kubernetes Docker Prometheus"),
    ("CloudBridge Consulting", "Stage Backend APIs", "Developpement et securisation d'APIs REST.", "FastAPI PostgreSQL Security"),
]

pfe_subjects = [
    "Systeme intelligent de recommandation de stages par similarite CV-offre",
    "Dashboard Data Science pour le suivi des candidatures universitaires",
    "Plateforme Web de gestion PFE avec notifications temps reel",
    "Analyse predictive des admissions en stage avec Machine Learning",
    "Moteur NLP d'extraction de competences depuis rapports PDF",
]


def slug(value: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", ".", value.lower()).strip(".")
    return re.sub(r"\.+", ".", cleaned)


def get_or_create_user(db: Session, full_name: str, role: str, email: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
    user = User(
        full_name=full_name,
        email=email,
        password_hash=get_password_hash(PASSWORD),
        role=role,
        is_active=True,
    )
    db.add(user)
    db.flush()
    return user


def create_pdf(path: Path, title: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    writer = PdfWriter()
    writer.add_blank_page(width=595, height=842)
    with path.open("wb") as file:
        writer.write(file)


def main() -> None:
    db = SessionLocal()
    try:
        admin = get_or_create_user(db, "Admin Soutenance", "admin", f"admin@{DOMAIN}")
        student_users = [get_or_create_user(db, name, "student", f"{slug(name)}@{DOMAIN}") for name in students]
        company_users = [get_or_create_user(db, name, "company", f"contact.{slug(name)}@{DOMAIN}") for name in companies]
        supervisor_users = [get_or_create_user(db, name, "supervisor", f"{slug(name)}@{DOMAIN}") for name in supervisors]

        company_by_name = {company.full_name: company for company in company_users}
        stage_objects = []
        for company_name, title, description, requirements in offers:
            existing = db.query(Stage).filter(Stage.title == title).first()
            if existing:
                stage_objects.append(existing)
                continue
            stage = Stage(
                company_id=company_by_name[company_name].id,
                title=title,
                description=description,
                requirements=requirements,
                location="Casablanca" if "Cloud" not in company_name else "Rabat",
                duration="3 a 6 mois",
                stage_type="internship_or_pfe",
                status="published",
            )
            db.add(stage)
            db.flush()
            stage_objects.append(stage)

        statuses = ["accepted", "rejected", "submitted", "accepted", "submitted", "rejected", "submitted", "accepted", "submitted", "rejected", "submitted", "accepted", "submitted", "rejected", "submitted"]
        applications = []
        for index, status in enumerate(statuses):
            student = student_users[index % len(student_users)]
            stage = stage_objects[index % len(stage_objects)]
            existing = db.query(Application).filter(Application.student_id == student.id, Application.stage_id == stage.id).first()
            if existing:
                existing.status = status
                applications.append(existing)
                continue
            application = Application(
                student_id=student.id,
                stage_id=stage.id,
                cover_letter=f"Candidature de {student.full_name} pour {stage.title}.",
                status=status,
            )
            db.add(application)
            db.flush()
            applications.append(application)

        pfe_projects = []
        for index, title in enumerate(pfe_subjects):
            student = student_users[index]
            company = company_users[index % len(company_users)]
            supervisor = supervisor_users[index % len(supervisor_users)]
            application = applications[index]
            existing = db.query(PFE).filter(PFE.title == title).first()
            if existing:
                pfe_projects.append(existing)
                continue
            pfe = PFE(
                title=title,
                description=f"Projet PFE applique : {title}.",
                student_id=student.id,
                company_id=company.id,
                supervisor_id=supervisor.id,
                application_id=application.id,
                status=["approved", "in_progress", "approved", "completed", "in_progress"][index],
            )
            db.add(pfe)
            db.flush()
            pfe_projects.append(pfe)

        notification_targets = student_users[:5] + company_users[:2] + supervisor_users[:3]
        for index, user in enumerate(notification_targets[:10]):
            title = ["Candidature mise a jour", "Nouvelle offre pertinente", "Rapport depose", "PFE valide", "Rappel soutenance"][index % 5]
            existing = db.query(Notification).filter(Notification.user_id == user.id, Notification.title == title).first()
            if existing:
                continue
            db.add(Notification(user_id=user.id, title=title, message=f"Notification de demonstration pour {user.full_name}.", is_read=index % 3 == 0))

        uploads_dir = BACKEND / "uploads" / "reports"
        for index, pfe in enumerate(pfe_projects[:5]):
            filename = f"rapport_pfe_demo_{index + 1}.pdf"
            existing = db.query(Report).filter(Report.pfe_id == pfe.id, Report.filename == filename).first()
            if existing:
                continue
            file_path = uploads_dir / f"{uuid.uuid4()}_{filename}"
            create_pdf(file_path, pfe.title)
            db.add(Report(
                pfe_id=pfe.id,
                author_id=pfe.student_id,
                filename=filename,
                file_path=str(file_path),
                content_type="application/pdf",
            ))

        db.commit()

        counts = {
            "users": db.query(User).count(),
            "stages": db.query(Stage).count(),
            "applications": db.query(Application).count(),
            "pfe": db.query(PFE).count(),
            "notifications": db.query(Notification).count(),
            "reports": db.query(Report).count(),
        }
        print(counts)
        print({
            "admin": f"admin@{DOMAIN}",
            "student": f"{slug(students[0])}@{DOMAIN}",
            "company": f"contact.{slug(companies[0])}@{DOMAIN}",
            "supervisor": f"{slug(supervisors[0])}@{DOMAIN}",
            "password": PASSWORD,
        })
    finally:
        db.close()


if __name__ == "__main__":
    main()
