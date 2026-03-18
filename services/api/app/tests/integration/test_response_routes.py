def test_candidate_can_save_fetch_and_summarize_draft(client, seeded_users) -> None:
    session = client.post(
        "/sessions",
        json={"assignment_id": "assignment-r4", "assessment_version_id": "assessment-r4"},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    ).json()
    client.post(
        f"/sessions/{session['session_id']}/start",
        json={},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )

    draft = client.post(
        "/responses/draft",
        json={
            "session_id": session["session_id"],
            "task_id": session["current_task_id"],
            "payload": {"answer": "draft body"},
            "attempt_no": 1,
        },
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    fetched = client.get(
        f"/responses/draft/{session['session_id']}/{session['current_task_id']}",
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    summary = client.get(
        f"/responses/summary/{session['session_id']}/{session['current_task_id']}",
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )

    assert draft.status_code == 200
    assert fetched.status_code == 200
    assert fetched.json()["payload"] == {"answer": "draft body"}
    assert summary.status_code == 200
    assert summary.json()["draft_exists"] is True
    assert summary.json()["finalized"] is False


def test_another_candidate_cannot_access_response_data(client, seeded_users) -> None:
    session = client.post(
        "/sessions",
        json={"assignment_id": "assignment-r5", "assessment_version_id": "assessment-r5"},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    ).json()
    client.post(
        f"/sessions/{session['session_id']}/start",
        json={},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    client.post(
        "/responses/draft",
        json={
            "session_id": session["session_id"],
            "task_id": session["current_task_id"],
            "payload": {"answer": "secret"},
            "attempt_no": 1,
        },
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    other = client.post(
        "/users",
        json={
            "email": "other.response@example.com",
            "password": "otherpass123",
            "display_name": "Other Response Candidate",
            "initial_role": "candidate",
        },
        headers={"x-actor-id": seeded_users["admin"].user_id, "x-roles": "admin"},
    ).json()
    denied = client.get(
        f"/responses/draft/{session['session_id']}/{session['current_task_id']}",
        headers={"x-actor-id": other['user_id'], "x-roles": "candidate"},
    )

    assert denied.status_code == 404
