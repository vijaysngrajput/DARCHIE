def test_access_check_route_returns_allowed_for_scoped_recruiter(client, seeded_users) -> None:
    response = client.post(
        "/access/check",
        json={"resource_type": "report", "resource_id": "candidate-1", "action": "view"},
        headers={"x-actor-id": seeded_users["recruiter"].user_id, "x-roles": "recruiter"},
    )
    assert response.status_code == 200
    assert response.json()["allowed"] is True


def test_access_context_route_returns_roles(client, seeded_users) -> None:
    response = client.get(
        "/access/context",
        headers={"x-actor-id": seeded_users["admin"].user_id, "x-roles": "admin"},
    )
    assert response.status_code == 200
    assert response.json()["roles"] == ["admin"]
