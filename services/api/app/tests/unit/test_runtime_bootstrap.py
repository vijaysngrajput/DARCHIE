import os

from app.core.config import Settings
from app.core.runtime_bootstrap import seed_local_runtime_data
from app.modules.identity_access.models import RoleAssignmentModel, UserAccountModel


def test_runtime_settings_only_enable_bootstrap_in_local_dev(monkeypatch) -> None:
    monkeypatch.delenv("ENABLE_RUNTIME_BOOTSTRAP", raising=False)
    monkeypatch.delenv("SEED_DEV_DATA", raising=False)
    assert Settings(app_env="development").runtime_bootstrap_enabled is True
    assert Settings(app_env="development").dev_data_seeding_enabled is True
    assert Settings(app_env="production").runtime_bootstrap_enabled is False
    assert Settings(app_env="production").dev_data_seeding_enabled is False


def test_seed_local_runtime_data_creates_missing_records_without_rewriting_existing_ids(db_session) -> None:
    existing = UserAccountModel(
        user_id="external-candidate",
        email="candidate@example.com",
        password_hash="hash",
        display_name="External Candidate",
    )
    db_session.add(existing)
    db_session.flush()

    seed_local_runtime_data(db_session)

    refreshed = db_session.get(UserAccountModel, "external-candidate")
    assert refreshed is not None
    assert refreshed.email == "candidate@example.com"
    role = db_session.query(RoleAssignmentModel).filter_by(user_id="external-candidate", role_name="candidate").one()
    assert role.role_name == "candidate"
    assert db_session.get(UserAccountModel, "candidate-1") is None
