ROLE_ACTIONS: dict[str, dict[str, set[str]]] = {
    "candidate": {
        "assessment": {"view_assigned"},
        "session": {"view_own", "start_own", "resume_own"},
        "response": {"submit_own", "save_draft_own", "view_status_own"},
    },
    "recruiter": {
        "assessment": {"assign"},
        "report": {"view"},
        "candidate_progress": {"view"},
    },
    "hiring_manager": {
        "report": {"view"},
        "component_insight": {"view"},
    },
    "admin": {
        "content": {"draft", "review", "publish"},
        "platform": {"inspect"},
        "user": {"create", "assign_role", "remove_role"},
    },
    "reviewer": {
        "review": {"view_assigned", "submit"},
        "content_review": {"review"},
    },
    "support_admin": {
        "session": {"inspect", "cancel"},
        "platform": {"inspect"},
    },
}


def resource_requires_scope(resource_type: str) -> bool:
    return resource_type in {"report", "component_insight", "review", "candidate_progress", "content"}


def can_access_owned_resource(actor_id: str, resource_owner_id: str) -> bool:
    return actor_id == resource_owner_id


def can_access_scoped_resource(role_names: list[str], grant_records: list, action: str) -> bool:
    if "admin" in role_names or "support_admin" in role_names:
        return True
    return any(grant.action == action for grant in grant_records)
