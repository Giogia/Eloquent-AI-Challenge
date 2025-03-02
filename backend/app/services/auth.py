import os
import jwt

from datetime import datetime, timedelta, timezone
from typing import Dict, Optional, Tuple
from passlib.context import CryptContext
from fastapi import HTTPException

from app.db.connection import get_db
from app.db.models import User
from app.services.users import Users
from app.schemas.auth import TokenResponse

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self):
        self.users = Users()
        self.auth_algorithm = os.environ.get("AUTH_ALGORITHM", "HS256")
        self.access_token_secret = os.environ.get("ACCESS_TOKEN_SECRET")
        self.access_token_expire_minutes = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
        self.refresh_token_secret = os.environ.get("REFRESH_TOKEN_SECRET")
        self.refresh_token_expire_days = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against its hash.
        """
        return pwd_context.verify(plain_password, hashed_password)

    def hash_password(self, password: str) -> str:
        """
        Generate a hash from a password.
        """
        return pwd_context.hash(password)

    def create_user(self, username: str, email: str, password: str) -> TokenResponse:
        """
        Create a new user with a hashed password and generate JWT tokens.
        
        Args:
            username: Username for the new user
            email: Email for the new user
            password: Plain text password to be hashed
            
        Returns:
            Dict: User details and JWT tokens
        """
        
        if self.users.user_exists(email):
            raise ValueError("User with this email already exists")
        
        password_hash = self.hash_password(password)
        user = self.users.create_user(username, email, password_hash)
        
        access_token, refresh_token = self._create_tokens(user.id)
        
        return {
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "access_token": access_token,
            "refresh_token": refresh_token
        }
    
    def authenticate_user(self, email: str, password: str) -> TokenResponse:
        """
        Authenticate a user and generate JWT tokens.
        
        Args:
            email: User's email
            password: User's password
            
        Returns:
            Dict: User details and JWT tokens if authentication successful
            
        Raises:
            ValueError: If authentication fails
        """

        with get_db() as db:
            user = (
                db
                .query(User)
                .filter(User.email == email)
                .first()
            )
            
            if not user or not self.verify_password(password, user.password_hash):
                raise ValueError("Incorrect email or password")
            
            access_token, refresh_token = self._create_tokens(user.id)
            
            return {
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "access_token": access_token,
                "refresh_token": refresh_token
            }
    
    def refresh_token(self, refresh_token: str) -> Dict:
        """
        Generate a new access token using a valid refresh token.
        
        Args:
            refresh_token: The refresh token
            
        Returns:
            Dict: New access token
            
        Raises:
            ValueError: If refresh token is invalid or expired
        """

        try:
            payload = jwt.decode(
                refresh_token, 
                self.refresh_token_secret, 
                algorithms=[self.auth_algorithm]
            )
            user_id = payload.get("sub")
            
            if not user_id:
                raise ValueError("Invalid token")
            
            user = self.users.get_user_by_id(user_id)
            if not user:
                raise ValueError("User not found")
            
            new_access_token, _ = self._create_tokens(user_id, refresh=False)
            
            return {
                "access_token": new_access_token
            }
        
        except jwt.PyJWTError:
            raise ValueError("Invalid or expired refresh token")
    
    def validate_token(self, token: str, is_refresh_token: bool = False) -> Optional[str]:
        """
        Validate a JWT token and return the user ID if valid.
        
        Args:
            token: JWT token to validate
            is_refresh_token: Whether the token is a refresh token
            
        Returns:
            str: User ID if token is valid, None otherwise
        """

        try:
            secret = self.refresh_token_secret if is_refresh_token else self.access_token_secret

            payload = jwt.decode(
                token, 
                secret, 
                algorithms=[self.auth_algorithm]
            )
            user_id = payload.get("sub")
            
            return user_id
        
        except jwt.PyJWTError:
            raise HTTPException(status_code=403, detail="Unauthorized access")
    
    def _create_tokens(self, user_id: str, refresh: bool = True) -> Tuple[str, Optional[str]]:
        """
        Create access and optionally refresh tokens for a user.
        
        Args:
            user_id: ID of the user
            refresh: Whether to create a refresh token as well
            
        Returns:
            Tuple[str, Optional[str]]: The access token and optionally the refresh token
        """

        access_token = jwt.encode(
            {
                "sub": user_id,
                "exp": datetime.now(timezone.utc) + timedelta(minutes=self.access_token_expire_minutes),
                "type": "access"
            }, 
            self.access_token_secret, 
            algorithm=self.auth_algorithm
        )

        refresh_token = None

        if refresh:
            refresh_token = jwt.encode(
                {
                    "sub": user_id,
                    "exp": datetime.now(timezone.utc) + timedelta(days=self.refresh_token_expire_days),
                    "type": "refresh"
                }, 
                self.refresh_token_secret, 
                algorithm=self.auth_algorithm
            )
        
        return access_token, refresh_token
