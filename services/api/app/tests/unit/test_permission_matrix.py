from app.modules.identity_access.permissions import ROLE_ACTIONS, can_access_owned_resource, resource_requires_scope


def test_role_actions_contains_expected_candidate_permissions() -> None:
    assert "start_own" in ROLE_ACTIONS["candidate"]["session"]
    assert "submit_own" in ROLE_ACTIONS["candidate"]["response"]


def test_scope_requirements_cover_reports() -> None:
    assert resource_requires_scope("report") is True
    assert resource_requires_scope("session") is False


def test_owned_resource_rule() -> None:
    assert can_access_owned_resource("user-1", "user-1") is True
    assert can_access_owned_resource("user-1", "user-2") is False
