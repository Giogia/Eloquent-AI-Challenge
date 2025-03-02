from typing import Dict

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.services.auth import AuthService
from app.schemas.auth import UserCreate, TokenResponse, RefreshTokenRequest

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

router = APIRouter(prefix="/auth", tags=["authentication"])

auth_service = AuthService()

@router.post("/signup", response_model=TokenResponse)
async def register(user_data: UserCreate):
    """
    Register a new user and get authentication tokens.
    """
    try:
        return auth_service.create_user(
            username=user_data.username,
            email=user_data.email,
            password=user_data.password
        )
    
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

@router.post("/token", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate a user and get new tokens.
    """
    try:
        return auth_service.authenticate_user(
            email=form_data.username,
            password=form_data.password
        )
    
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={ "WWW-Authenticate": "Bearer" }
        )

@router.post("/refresh", response_model=Dict[str, str])
async def refresh_token(request: RefreshTokenRequest):
    """
    Get a new access token using a refresh token.
    """
    try:
        result = auth_service.refresh_token(request.refresh_token)
        return result
    
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
            headers={ "WWW-Authenticate": "Bearer" }
        )
