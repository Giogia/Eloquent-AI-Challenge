from uuid import uuid4
from datetime import datetime

from app.db.models import User, Db

class Users:
    def create_user(self, username: str, email: str, password_hash: str, db: Db) -> User:
        """
        Create a new user in the database
        
        Args:
            username: Username for the new user
            email: Email for the new user
            password_hash: Hashed password for the new user
            
        Returns:
            User: The newly created user object
        """
        
        new_user = User(
            id=str(uuid4()),
            username=username,
            email=email,
            password_hash=password_hash,
            created_at=datetime.now()
        )
        db.add(new_user)

        return new_user
    
    def user_exists(self, email: str, db: Db) -> bool:
        """
        Check if a user with the given email already exists
        
        Args:
            email: Email to check
            
        Returns:
            bool: True if user exists, False otherwise
        """

        user = (
            db
            .query(User)
            .filter(User.email == email)
            .first()
        )
        return user is not None
        
    def get_user_by_id(self, user_id: str, db: Db) -> User:
        """
        Get user by ID
        
        Args:
            user_id: ID of the user to retrieve
            
        Returns:
            User: The user object if found, None otherwise
        """

        user = (
            db
            .query(User)
            .filter(User.id == user_id)
            .first()
        )
        return user
        
    def get_user_by_email(self, email: str, db: Db) -> User:
        """
        Get user by Email
        
        Args:
            email: Email of the user to retrieve
            
        Returns:
            User: The user object if found, None otherwise
        """

        user = (
            db
            .query(User)
            .filter(User.email == email)
            .first()
        )
        return user
