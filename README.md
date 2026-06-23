# Stagio

Plateforme intelligente de gestion des stages et PFE.

Application web complete pour centraliser les offres de stage, candidatures, projets PFE, rapports, notifications et tableaux de bord par role.

## Stack

- Frontend : React, Vite, Tailwind CSS, React Router, Axios, Zustand, React Hook Form, Lucide React, Recharts.
- Backend : FastAPI, SQLAlchemy, Alembic, PostgreSQL, JWT, Passlib, FastAPI-Mail.
- Base de donnees : PostgreSQL.

## Roles

- Etudiant : consulter stages, postuler, suivre candidatures, consulter PFE, deposer rapports, analyser CV.
- Entreprise : publier stages, gerer candidatures recues.
- Encadrant : suivre et valider les PFE.
- Administrateur : gerer utilisateurs, stages, PFE et supervision globale.

## Fonctionnalites Phase 4

- Gestion utilisateurs admin avec recherche, filtre role, activation/desactivation.
- Notifications avec compteur non lu.
- Tableaux de bord avec graphiques.
- IA bonus : compatibilite CV/offre via extraction PDF et mots-cles.
- Emails automatiques configurables.
- Audit logs.
- Rate limiting et securite upload.

## Lancement rapide

Backend :

```bash
cd backend
source .venv/bin/activate
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend :

```bash
cd frontend
npm install
npm run dev
```

Swagger : `http://127.0.0.1:8000/docs`

Frontend : `http://localhost:5173`
