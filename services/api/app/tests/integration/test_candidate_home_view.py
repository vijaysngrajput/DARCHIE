from datetime import timedelta

from app.core.database import utc_now
from app.modules.assessment_orchestration.models import AssessmentSessionModel, CandidateAssignmentModel
from app.modules.identity_access.auth_service import AuthenticationService
from app.modules.identity_access.models import RoleAssignmentModel, UserAccountModel


def test_candidate_home_view_shows_invited_assignment_for_first_login(client, seeded_users, seeded_assignments) -> None:
    headers = {"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"}

    response = client.get("/candidate/home-view", headers=headers)
    assert response.status_code == 200
    payload = response.json()

    assert payload["candidate_profile"]["user_id"] == seeded_users["candidate"].user_id
    assert len(payload["assignments"]) == 1
    assignment = payload["assignments"][0]
    assert assignment["assignment_id"] == seeded_assignments["default"].assignment_id
    assert assignment["assignment_state"] == "invited"
    assert assignment["primary_action"] == "Start assessment"
    assert assignment["current_session_id"] is None


def test_start_assignment_session_creates_session_and_changes_home_state(client, seeded_users, seeded_assignments) -> None:
    headers = {"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"}
    assignment_id = seeded_assignments["default"].assignment_id

    start_response = client.post(f"/candidate/assignments/{assignment_id}/start-session", headers=headers)
    assert start_response.status_code == 200
    session_payload = start_response.json()
    assert session_payload["assignment_id"] == assignment_id
    assert session_payload["session_state"] == "created"

    home_response = client.get("/candidate/home-view", headers=headers)
    assert home_response.status_code == 200
    assignment = home_response.json()["assignments"][0]
    assert assignment["assignment_state"] == "in_progress"
    assert assignment["primary_action"] == "Resume assessment"
    assert assignment["current_session_id"] == session_payload["session_id"]


def test_completed_assignment_shows_completion_instead_of_resume(client, seeded_users, repositories) -> None:
    headers = {"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"}
    completed_session = repositories["assessment_sessions"].create(
        AssessmentSessionModel(
            assignment_id="assignment-complete",
            assessment_version_id="assessment-v2",
            candidate_user_id=seeded_users["candidate"].user_id,
            session_state="completed",
            completed_at=utc_now() - timedelta(minutes=5),
        )
    )
    repositories["candidate_assignments"].create(
        CandidateAssignmentModel(
            assignment_id="assignment-complete",
            candidate_user_id=seeded_users["candidate"].user_id,
            assessment_version_id="assessment-v2",
            assignment_state="completed",
            latest_completed_session_id=completed_session.session_id,
            completed_at=utc_now() - timedelta(minutes=5),
        )
    )

    response = client.get("/candidate/home-view", headers=headers)
    assert response.status_code == 200
    assignments = {item["assignment_id"]: item for item in response.json()["assignments"]}
    completed_assignment = assignments["assignment-complete"]
    assert completed_assignment["assignment_state"] == "completed"
    assert completed_assignment["primary_action"] == "View completion"
    assert completed_assignment["latest_completed_session_id"] == completed_session.session_id


def test_expired_assignment_surfaces_without_resume(client, seeded_users, repositories) -> None:
    headers = {"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"}
    repositories["candidate_assignments"].create(
        CandidateAssignmentModel(
            assignment_id="assignment-expired",
            candidate_user_id=seeded_users["candidate"].user_id,
            assessment_version_id="assessment-v3",
            assignment_state="invited",
            invite_expires_at=utc_now() - timedelta(seconds=1),
        )
    )

    response = client.get("/candidate/home-view", headers=headers)
    assert response.status_code == 200
    assignments = {item["assignment_id"]: item for item in response.json()["assignments"]}
    expired_assignment = assignments["assignment-expired"]
    assert expired_assignment["assignment_state"] == "expired"
    assert expired_assignment["primary_action"] == "View expired state"


def test_candidate_cannot_start_another_candidates_assignment(client, seeded_users, repositories) -> None:
    other_candidate = repositories["users"].create(
        UserAccountModel(
            email="other.candidate@example.com",
            password_hash=AuthenticationService._hash_password("otherpass123"),
            display_name="Other Candidate",
        )
    )
    repositories["roles"].create(RoleAssignmentModel(user_id=other_candidate.user_id, role_name="candidate"))
    repositories["candidate_assignments"].create(
        CandidateAssignmentModel(
            assignment_id="other-assignment",
            candidate_user_id=other_candidate.user_id,
            assessment_version_id="assessment-v4",
            assignment_state="invited",
            invite_expires_at=utc_now() + timedelta(days=3),
        )
    )

    response = client.post(
        "/candidate/assignments/other-assignment/start-session",
        headers={"x-actor-id": seeded_users["candidate"].user_id, "x-roles": "candidate"},
    )
    assert response.status_code == 403
    assert response.json()["error_code"] == "AUTHORIZATION_DENIED"
