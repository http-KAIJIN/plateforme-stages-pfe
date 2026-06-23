from app.tests.conftest import login_user, register_user


def test_register_and_login(client):
    register_response = register_user(client, "student@example.com", "student")
    assert register_response.status_code == 201
    assert register_response.json()["email"] == "student@example.com"

    token = login_user(client, "student@example.com")
    assert token


def test_register_duplicate_email(client):
    register_user(client, "duplicate@example.com", "student")
    response = register_user(client, "duplicate@example.com", "student")
    assert response.status_code == 409
