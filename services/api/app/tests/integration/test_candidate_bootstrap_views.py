def test_candidate_landing_and_task_bootstrap_views(client, seeded_users) -> None:
    headers = {"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"}
    create_response = client.post(
        "/sessions",
        json={"assignment_id": "assignment-bootstrap", "assessment_version_id": "assessment-bootstrap-v1"},
        headers=headers,
    )
    session_id = create_response.json()["session_id"]

    landing_response = client.get(f"/candidate/sessions/{session_id}/landing-view", headers=headers)
    assert landing_response.status_code == 200
    landing_payload = landing_response.json()
    assert landing_payload["session"]["session_id"] == session_id
    assert landing_payload["current_unit"]["task_id"] == "task-assessment-bootstrap-v1-1"
    assert landing_payload["progress"]["completed_tasks"] == 0

    task_response = client.get(f"/candidate/sessions/{session_id}/task-view", headers=headers)
    assert task_response.status_code == 200
    task_payload = task_response.json()
    assert task_payload["draft"] is None
    assert task_payload["response_summary"]["draft_exists"] is False


def test_candidate_task_bootstrap_view_returns_latest_draft(client, seeded_users) -> None:
    headers = {"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"}
    create_response = client.post(
        "/sessions",
        json={"assignment_id": "assignment-bootstrap-2", "assessment_version_id": "assessment-bootstrap-v2"},
        headers=headers,
    )
    session_id = create_response.json()["session_id"]
    client.post(f"/sessions/{session_id}/start", json={}, headers=headers)
    draft_response = client.post(
        "/responses/draft",
        json={
            "session_id": session_id,
            "task_id": "task-assessment-bootstrap-v2-1",
            "payload": {"answer": "draft text"},
            "attempt_no": 1,
        },
        headers=headers,
    )
    assert draft_response.status_code == 200

    task_response = client.get(f"/candidate/sessions/{session_id}/task-view", headers=headers)
    assert task_response.status_code == 200
    task_payload = task_response.json()
    assert task_payload["draft"]["payload"]["answer"] == "draft text"
    assert task_payload["response_summary"]["draft_exists"] is True
