from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserValidate(BaseModel):
    user_id: str

class TokenResponse(BaseModel):
    user_id: str
    username: str
    email: EmailStr
    access_token: str
    refresh_token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class RefreshTokenResponse(BaseModel):
    user_id: str
    access_token: str
