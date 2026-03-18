def test_draft_upsert_keeps_single_current_draft(client, seeded_users) -> None:
    session = client.post(
        "/sessions",
        json={"assignment_id": "assignment-r7", "assessment_version_id": "assessment-r7"},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    ).json()
    client.post(
        f"/sessions/{session['session_id']}/start",
        json={},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )

    first = client.post(
        "/responses/draft",
        json={
            "session_id": session["session_id"],
            "task_id": session["current_task_id"],
            "payload": {"answer": "v1"},
            "attempt_no": 1,
        },
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    second = client.post(
        "/responses/draft",
        json={
            "session_id": session["session_id"],
            "task_id": session["current_task_id"],
            "payload": {"answer": "v2"},
            "attempt_no": 1,
        },
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["draft_id"] == second.json()["draft_id"]
    assert second.json()["payload"] == {"answer": "v2"}
