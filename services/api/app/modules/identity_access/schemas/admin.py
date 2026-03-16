from pydantic import BaseModel, EmailStr


class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str
    display_name: str
    initial_role: str


class AssignRoleRequest(BaseModel):
    role_name: str


class UserAdminResponse(BaseModel):
    user_id: str
    email: EmailStr
    display_name: str
    roles: list[str]
