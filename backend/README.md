# Backend FastAPI - Plateforme Stages PFE

## Installation

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## PostgreSQL

Creer la base de donnees :

```bash
createdb stages_pfe
```

Adapter ensuite `DATABASE_URL` dans `.env` si besoin.

## Migrations Alembic

```bash
alembic upgrade head
```

## Lancement API

```bash
uvicorn app.main:app --reload
```

Swagger UI : `http://127.0.0.1:8000/docs`

OpenAPI JSON : `http://127.0.0.1:8000/openapi.json`

## Tests

```bash
pytest
```
