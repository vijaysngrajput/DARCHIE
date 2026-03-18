from app.modules.response_capture.schemas.commands import SaveDraftRequest


def test_save_draft_is_upsert_based(client, seeded_users) -> None:
    session = client.post(
        "/sessions",
        json={"assignment_id": "assignment-r1", "assessment_version_id": "assessment-r1"},
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
            "payload": {"answer": "draft-1"},
            "attempt_no": 1,
        },
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    second = client.post(
        "/responses/draft",
        json={
            "session_id": session["session_id"],
            "task_id": session["current_task_id"],
            "payload": {"answer": "draft-2"},
            "attempt_no": 1,
        },
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["draft_id"] == second.json()["draft_id"]
    assert second.json()["payload"] == {"answer": "draft-2"}
