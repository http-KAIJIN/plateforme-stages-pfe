# Guide Installation

## Prerequis

- Python 3.12+
- Node.js 20+
- PostgreSQL

## Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
createdb -U postgres stages_pfe
alembic upgrade head
uvicorn app.main:app --reload
```

Variables importantes dans `.env` :

- `DATABASE_URL`
- `SECRET_KEY`
- `UPLOAD_DIR`
- `MAX_UPLOAD_SIZE_MB`
- `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_SERVER` pour activer l'envoi email.

## Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Variable frontend :

- `VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1`

## Verification

```bash
cd backend && .venv/bin/pytest
cd frontend && npm run build
```
