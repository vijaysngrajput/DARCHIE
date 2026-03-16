def test_admin_can_create_and_assign_role(client, seeded_users) -> None:
    create_response = client.post(
        "/users",
        json={
            "email": "new.user@example.com",
            "password": "newpass123",
            "display_name": "New User",
            "initial_role": "candidate",
        },
        headers={"x-actor-id": seeded_users["admin"].user_id, "x-roles": "admin"},
    )
    assert create_response.status_code == 200
    payload = create_response.json()
    assert payload["roles"] == ["candidate"]

    assign_response = client.post(
        f"/users/{payload['user_id']}/roles",
        json={"role_name": "reviewer"},
        headers={"x-actor-id": seeded_users["admin"].user_id, "x-roles": "admin"},
    )
    assert assign_response.status_code == 200
    assert sorted(assign_response.json()["roles"]) == ["candidate", "reviewer"]
