from app.modules.identity_access.schemas.access import AccessCheckRequest


def test_candidate_can_access_owned_session(authorization_service, seeded_users) -> None:
    decision = authorization_service.check_access(
        AccessCheckRequest(resource_type="session", action="start_own", resource_owner_id=seeded_users["candidate"].user_id),
        actor_id=seeded_users["candidate"].user_id,
    )
    assert decision.allowed is True


def test_recruiter_can_access_scoped_report(authorization_service, seeded_users) -> None:
    decision = authorization_service.check_access(
        AccessCheckRequest(resource_type="report", action="view", resource_id="candidate-1"),
        actor_id=seeded_users["recruiter"].user_id,
    )
    assert decision.allowed is True


def test_deny_by_default(authorization_service, seeded_users) -> None:
    decision = authorization_service.check_access(
        AccessCheckRequest(resource_type="platform", action="inspect"),
        actor_id=seeded_users["candidate"].user_id,
    )
    assert decision.allowed is False
