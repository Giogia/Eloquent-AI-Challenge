from uuid import uuid4
from datetime import datetime

from app.db.connection import get_db
from app.db.models import User

class Users:
    def __init__(self):
        self.db = get_db()

    def create_user(self, username: str, email: str, password_hash: str) -> User:
        """
        Create a new user in the database
        
        Args:
            username: Username for the new user
            email: Email for the new user
            password_hash: Hashed password for the new user
            
        Returns:
            User: The newly created user object
        """
        
        with get_db() as db:
            new_user = User(
                id=str(uuid4()),
                username=username,
                email=email,
                password_hash=password_hash,
                created_at=datetime.now()
            )
            db.add(new_user)

            return new_user
    
    def user_exists(self, email: str) -> bool:
        """
        Check if a user with the given email already exists
        
        Args:
            email: Email to check
            
        Returns:
            bool: True if user exists, False otherwise
        """

        with get_db() as db:
            user = (
                db
                .query(User)
                .filter(User.email == email)
                .first()
            )
            return user is not None
        
    def get_user_by_id(self, user_id: str) -> User:
        """
        Get user by ID
        
        Args:
            user_id: ID of the user to retrieve
            
        Returns:
            User: The user object if found, None otherwise
        """

        with get_db() as db:
            user = (
                db
                .query(User)
                .filter(User.id == user_id)
                .first()
            )
            return user
