# D-ARCHIE Identity and Access Code Engine Task Pack

Source spec:
- [`Identity-and-Access-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/identity-and-access/Identity-and-Access-CDS.md)

## 1. Auth Tasks
1. Create `router.py` and all auth endpoints from CDS section 5.
2. Create `auth_service.py` and `session_service.py`.
3. Implement login, logout, refresh, and current-user flows.
4. Create `schemas/auth.py`.

## 2. Authorization Tasks
1. Create `authorization_service.py`.
2. Create `permissions.py` with role/action/resource mapping from CDS section 8.
3. Create `schemas/access.py`.
4. Implement access-check and access-context endpoints.

## 3. Persistence Tasks
1. Create ORM models in `models.py`.
2. Create repositories in `repositories.py`.
3. Ensure audit records can be written inside the same transaction as privileged auth/access events.

## 4. Admin Identity Tasks
1. Create `user_admin_service.py`.
2. Create `schemas/admin.py`.
3. Implement user creation and role assignment/removal endpoints.

## 5. Error and Test Tasks
1. Create `errors.py` with HTTP mapping from CDS section 10.
2. Create `events.py` for login, deny, and role-change audit events.
3. Add unit and integration tests from CDS section 11.

## 6. Completion Criteria
- Auth and access routes exist and are wired through dependencies.
- Deny-by-default logic is enforced centrally.
- Role/resource checks are unit tested.
- Audit markers are emitted for login failure, access denial, and role mutation.
