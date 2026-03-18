def test_finalize_emits_submission_event_and_updates_summary(client, seeded_users, event_publisher) -> None:
    session = client.post(
        "/sessions",
        json={"assignment_id": "assignment-r6", "assessment_version_id": "assessment-r6"},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    ).json()
    client.post(
        f"/sessions/{session['session_id']}/start",
        json={},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )

    response = client.post(
        "/responses/finalize",
        json={
            "session_id": session["session_id"],
            "task_id": session["current_task_id"],
            "payload": {"answer": "final body"},
            "submission_key": "submission-key-r6",
            "attempt_no": 1,
        },
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )

    assert response.status_code == 200
    assert any(event.event_name == "response.submitted" for event in event_publisher.events)

    summary = client.get(
        f"/responses/summary/{session['session_id']}/{session['current_task_id']}",
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert summary.status_code == 200
    assert summary.json()["finalized"] is True
    assert summary.json()["checkpoint_milestone"] == "submitted"
