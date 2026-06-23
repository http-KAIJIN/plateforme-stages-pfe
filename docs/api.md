# Documentation API - Stagio

Plateforme intelligente de gestion des stages et PFE.

Base URL : `http://127.0.0.1:8000/api/v1`

## Auth

- `POST /auth/register` : creation compte.
- `POST /auth/login` : connexion, retourne JWT.

## Users Admin

- `GET /users?search=&role=` : liste utilisateurs.
- `GET /users/{id}` : detail utilisateur.
- `PUT /users/{id}` : modification utilisateur, activation/desactivation.
- `DELETE /users/{id}` : suppression utilisateur.

## Stages

- `GET /stages`
- `GET /stages/{id}`
- `POST /stages`
- `PUT /stages/{id}`
- `DELETE /stages/{id}`

## Candidatures

- `POST /applications`
- `GET /applications`
- `PUT /applications/{id}`

## PFE

- `POST /pfe`
- `GET /pfe`
- `PUT /pfe/{id}`

## Rapports

- `POST /reports/{pfe_id}/upload`
- `GET /reports`
- `GET /reports/{id}/download`

## Notifications

- `GET /notifications`
- `PUT /notifications/{id}/read`

## IA

- `POST /ai/match-cv` : upload PDF + texte offre ou `stage_id`, retourne score compatibilite.

## Audit

- `GET /activity-logs` : logs recents, admin uniquement.
