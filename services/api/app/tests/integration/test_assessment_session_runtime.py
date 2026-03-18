def test_candidate_can_create_start_and_read_session_runtime(client, seeded_users) -> None:
    create_response = client.post(
        "/sessions",
        json={"assignment_id": "assignment-1", "assessment_version_id": "assessment-v1"},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert create_response.status_code == 200
    session_payload = create_response.json()
    assert session_payload["session_state"] == "created"
    assert session_payload["current_task_id"] == "task-assessment-v1-1"

    session_id = session_payload["session_id"]
    start_response = client.post(
        f"/sessions/{session_id}/start",
        json={},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert start_response.status_code == 200
    assert start_response.json()["session_state"] == "active"

    summary_response = client.get(
        f"/sessions/{session_id}",
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert summary_response.status_code == 200
    assert summary_response.json()["session_state"] == "active"

    current_unit_response = client.get(
        f"/sessions/{session_id}/current-unit",
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert current_unit_response.status_code == 200
    assert current_unit_response.json()["task_state"] == "in_progress"
    assert current_unit_response.json()["task_id"] == "task-assessment-v1-1"

    progress_response = client.get(
        f"/sessions/{session_id}/progress",
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert progress_response.status_code == 200
    assert progress_response.json()["total_tasks"] == 1
    assert progress_response.json()["completed_tasks"] == 0


def test_invalid_transition_returns_conflict(client, seeded_users) -> None:
    create_response = client.post(
        "/sessions",
        json={"assignment_id": "assignment-2", "assessment_version_id": "assessment-v2"},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    session_id = create_response.json()["session_id"]

    first_start = client.post(
        f"/sessions/{session_id}/start",
        json={},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert first_start.status_code == 200

    second_start = client.post(
        f"/sessions/{session_id}/start",
        json={},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert second_start.status_code == 409
    assert second_start.json()["error_code"] == "INVALID_STATE"


def test_candidate_cannot_access_another_candidates_session(client, seeded_users) -> None:
    create_response = client.post(
        "/sessions",
        json={"assignment_id": "assignment-3", "assessment_version_id": "assessment-v3"},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    session_id = create_response.json()["session_id"]

    other_candidate_response = client.post(
        "/users",
        json={
            "email": "other.candidate@example.com",
            "password": "otherpass123",
            "display_name": "Other Candidate",
            "initial_role": "candidate",
        },
        headers={"x-actor-id": seeded_users["admin"].user_id, "x-roles": "admin"},
    )
    other_candidate_id = other_candidate_response.json()["user_id"]

    denied_response = client.get(
        f"/sessions/{session_id}",
        headers={"x-actor-id": other_candidate_id, "x-roles": "candidate"},
    )
    assert denied_response.status_code == 403
    assert denied_response.json()["error_code"] == "AUTHORIZATION_DENIED"


def test_session_not_found_returns_404(client, seeded_users) -> None:
    response = client.get(
        "/sessions/missing-session",
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert response.status_code == 404
    assert response.json()["error_code"] == "RESOURCE_NOT_FOUND"
