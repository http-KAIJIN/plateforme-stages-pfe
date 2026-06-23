from app.tests.conftest import auth_headers, login_user, register_user


def test_student_can_apply_to_stage(client):
    register_user(client, "company@example.com", "company")
    company_token = login_user(client, "company@example.com")
    stage_response = client.post(
        "/api/v1/stages",
        headers=auth_headers(company_token),
        json={"title": "Stage Data", "description": "Analyse de donnees pour un projet etudiant."},
    )
    stage_id = stage_response.json()["id"]

    register_user(client, "student@example.com", "student")
    student_token = login_user(client, "student@example.com")
    response = client.post(
        "/api/v1/applications",
        headers=auth_headers(student_token),
        json={"stage_id": stage_id, "cover_letter": "Je suis interesse par ce stage."},
    )

    assert response.status_code == 201
    assert response.json()["stage_id"] == stage_id


def test_company_can_update_application_status(client):
    register_user(client, "company@example.com", "company")
    company_token = login_user(client, "company@example.com")
    stage_response = client.post(
        "/api/v1/stages",
        headers=auth_headers(company_token),
        json={"title": "Stage DevOps", "description": "Mise en place CI/CD pour projet web."},
    )

    register_user(client, "student@example.com", "student")
    student_token = login_user(client, "student@example.com")
    application_response = client.post(
        "/api/v1/applications",
        headers=auth_headers(student_token),
        json={"stage_id": stage_response.json()["id"]},
    )

    response = client.put(
        f"/api/v1/applications/{application_response.json()['id']}",
        headers=auth_headers(company_token),
        json={"status": "accepted"},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "accepted"
