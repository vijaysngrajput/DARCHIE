def test_task_submission_completes_single_task_session(client, seeded_users) -> None:
    create_response = client.post(
        "/sessions",
        json={"assignment_id": "assignment-4", "assessment_version_id": "assessment-v4"},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    session_id = create_response.json()["session_id"]
    client.post(
        f"/sessions/{session_id}/start",
        json={},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )

    submit_response = client.post(
        f"/sessions/{session_id}/tasks/task-assessment-v4-1/mark-submitted",
        json={
            "task_id": "ignored-by-path",
            "submission_id": "submission-1",
            "submission_marker": "marker-1",
            "attempt_no": 1,
        },
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert submit_response.status_code == 200
    assert submit_response.json()["session_state"] == "completed"
    assert submit_response.json()["task_id"] is None

    progress_response = client.get(
        f"/sessions/{session_id}/progress",
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert progress_response.status_code == 200
    assert progress_response.json()["completed_tasks"] == 1
    assert progress_response.json()["percent_complete"] == 100.0
