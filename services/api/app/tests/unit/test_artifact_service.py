def test_artifact_metadata_requires_existing_draft_or_submission(client, seeded_users) -> None:
    session = client.post(
        "/sessions",
        json={"assignment_id": "assignment-r3", "assessment_version_id": "assessment-r3"},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    ).json()
    client.post(
        f"/sessions/{session['session_id']}/start",
        json={},
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )

    no_ref = client.post(
        "/responses/artifacts",
        json={
            "session_id": session["session_id"],
            "task_id": session["current_task_id"],
            "artifact_kind": "code_file",
            "storage_reference": "s3://fake/path.py",
            "metadata": {"filename": "path.py"},
        },
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )

    assert no_ref.status_code == 422
