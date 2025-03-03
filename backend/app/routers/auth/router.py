import os
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.db.connection import get_db
from app.services.auth import AuthService
from app.schemas.auth import UserCreate, UserValidate

auth_service = AuthService()

router = APIRouter(prefix="/auth", tags=["authentication"])

secure = os.getenv("ENVIRONMENT", "development") == "production"

@router.post("/signup", response_model=UserValidate)
async def register(user_data: UserCreate, response: Response):
    """
    Register a new user and get authentication tokens.
    """
    try:
        with get_db() as db:
            token_response = auth_service.create_user(
                username=user_data.username,
                email=user_data.email,
                password=user_data.password,
                db=db
            )
        
            # response.set_cookie(
            #     key="refresh_token",
            #     value=token_response.refresh_token,
            #     httponly=True,
            #     secure=False,
            #     samesite="lax",
            #     max_age=60 * 60 * 24 * os.getenv("REFRESH_TOKEN_EXPIRE_DAYS"),
            #     path="/"
            # )

            response.set_cookie(
                key="access_token",
                value=token_response.access_token,
                httponly=True,
                secure=False,
                samesite="lax",
                max_age=60 * os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"),
                path="/"
            )

            return UserValidate(user_id=token_response.user_id)
    
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

@router.post("/token", response_model=UserValidate)
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate a user and get new tokens.
    """
    try:
        with get_db() as db:
            token_response = auth_service.authenticate_user(
                email=form_data.username,
                password=form_data.password,
                db=db
            )

            # response.set_cookie(
            #     key="refresh_token",
            #     value=token_response.refresh_token,
            #     httponly=True,
            #     secure=False,
            #     samesite="lax",
            #     max_age=60 * 60 * 24 * os.getenv("REFRESH_TOKEN_EXPIRE_DAYS"),
            #     path="/"
            # )

            response.set_cookie(
                key="access_token",
                value=token_response.access_token,
                httponly=True,
                secure=False,
                samesite="lax",
                max_age=60 * os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"),
                path="/"
            )

            return UserValidate(user_id=token_response.user_id)
    
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
            headers={ "WWW-Authenticate": "Bearer" }
        )
    
@router.post("/validate", response_model=UserValidate)
async def validate_token(request: Request):
    """
    Validate an access token.
    """
    try:
        access_token = request.cookies.get("access_token")

        if not access_token:
            raise HTTPException(status_code=401, detail="Access token missing")
        
        user_id = auth_service.validate_token(access_token)

        return UserValidate(user_id=user_id)
    
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={ "WWW-Authenticate": "Bearer" }
        )

@router.post("/refresh", response_model=UserValidate)
async def refresh_token(request: Request, response: Response):
    """
    Get a new access token using a refresh token.
    """
    try:
        refresh_token = request.cookies.get("refresh_token")

        if not refresh_token:
            raise HTTPException(status_code=401, detail="Refresh token missing")
    
        with get_db() as db:
            refresh_token_response = auth_service.refresh_token(refresh_token, db)

            response.set_cookie(
                key="access_token",
                value=refresh_token_response.access_token,
                httponly=True,
                secure=False,
                samesite="lax",
                max_age=60 * os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"),
                path="/"
            )

            return UserValidate(user_id=refresh_token_response.user_id)
        
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
            headers={ "WWW-Authenticate": "Bearer" }
        )
