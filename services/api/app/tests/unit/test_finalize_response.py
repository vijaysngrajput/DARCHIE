def test_finalize_response_is_idempotent_for_same_submission_key(client, seeded_users) -> None:
    session = client.post(
        "/sessions",
        json={"assignment_id": "assignment-r2", "assessment_version_id": "assessment-r2"},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    ).json()
    client.post(
        f"/sessions/{session['session_id']}/start",
        json={},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )

    first = client.post(
        "/responses/finalize",
        json={
            "session_id": session["session_id"],
            "task_id": session["current_task_id"],
            "payload": {"answer": "final"},
            "submission_key": "submission-key-1",
            "attempt_no": 1,
        },
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    second = client.post(
        "/responses/finalize",
        json={
            "session_id": session["session_id"],
            "task_id": session["current_task_id"],
            "payload": {"answer": "final"},
            "submission_key": "submission-key-1",
            "attempt_no": 1,
        },
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["submission_id"] == second.json()["submission_id"]
