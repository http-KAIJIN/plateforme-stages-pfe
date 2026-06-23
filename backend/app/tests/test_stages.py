from app.tests.conftest import auth_headers, login_user, register_user


def test_company_can_create_stage(client):
    register_user(client, "company@example.com", "company")
    token = login_user(client, "company@example.com")

    response = client.post(
        "/api/v1/stages",
        headers=auth_headers(token),
        json={"title": "Stage Backend", "description": "Developper une API FastAPI propre."},
    )

    assert response.status_code == 201
    assert response.json()["title"] == "Stage Backend"


def test_student_cannot_create_stage(client):
    register_user(client, "student@example.com", "student")
    token = login_user(client, "student@example.com")

    response = client.post(
        "/api/v1/stages",
        headers=auth_headers(token),
        json={"title": "Stage Interdit", "description": "Un etudiant ne publie pas d'offre."},
    )

    assert response.status_code == 403
