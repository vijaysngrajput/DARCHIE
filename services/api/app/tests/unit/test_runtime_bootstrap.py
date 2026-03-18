from sqlalchemy import select

from app.core.runtime_bootstrap import seed_local_runtime_data
from app.modules.identity_access.models import ResourceGrantModel, RoleAssignmentModel, UserAccountModel


def test_runtime_bootstrap_seeds_local_users_idempotently(db_session) -> None:
    seed_local_runtime_data(db_session)
    seed_local_runtime_data(db_session)

    users = list(db_session.scalars(select(UserAccountModel).order_by(UserAccountModel.user_id)))
    roles = list(db_session.scalars(select(RoleAssignmentModel)))
    grants = list(db_session.scalars(select(ResourceGrantModel)))

    assert [user.user_id for user in users] == ["admin-1", "candidate-1", "recruiter-1", "reviewer-1"]
    assert len(roles) == 4
    assert len(grants) == 1
