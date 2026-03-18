from app.modules.identity_access.models import AccessSessionModel


def test_login_and_me_flow(client, seeded_users, repositories) -> None:
    login_response = client.post(
        "/auth/login",
        json={"email": "candidate@example.com", "password": "secret123"},
    )
    assert login_response.status_code == 200
    payload = login_response.json()
    assert payload["user_id"] == seeded_users["candidate"].user_id
    assert payload["email"] == "candidate@example.com"
    assert payload["display_name"] == "Candidate"
    session = repositories["sessions"].get_by_id(payload["access_session_id"])
    assert isinstance(session, AccessSessionModel)

    me_response = client.get(
        "/auth/me",
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert me_response.status_code == 200
    assert me_response.json()["roles"] == ["candidate"]
