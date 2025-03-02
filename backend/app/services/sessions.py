import psycopg

from datetime import datetime
from langchain_postgres import PostgresChatMessageHistory

from app.db.models import Session
from app.db.connection import connection_url, get_db

class Sessions:
    def create_session(self, session_id, user_id: str, prompt: str) -> str:   
        """
        Create a new chat session in the database.
        
        Args:
            session_id: The unique identifier for the session
            user_id: The identifier of the user who owns this session
            prompt: The initial prompt or title for the session
            
        Returns:
            str: The session_id of the created session
            
        Note:
            This method establishes a new database connection for each operation
            and ensures it's properly closed regardless of success or failure.
        """

        with get_db() as db:
            new_session = Session(
                id=session_id, 
                user_id=user_id, 
                title=prompt,
                created_at=datetime.now()
            )
            db.add(new_session)

            return new_session.id

    def get_sessions(self, user_id: str) -> list[Session]:
        """
        Retrieve all sessions belonging to a specific user.
        
        Args:
            user_id: The identifier of the user whose sessions to retrieve
            
        Returns:
            list[Session]: A list of session objects ordered by creation date (newest first)
            
        Note:
            Each session object contains id, title, and created_at information.
        """

        with get_db() as db:
            sessions = (
                db
                .query(Session)
                .filter(Session.user_id == user_id)
                .order_by(Session.created_at.desc())
                .all()
            )

            return [
                {
                    'id': session.id, 
                    'title': session.title, 
                    'created_at': session.created_at
                } 
                for session in sessions
            ]
        
    def session_exists(self, session_id: str) -> bool:
        """
        Check if a session with the given ID exists in the database.
        
        Args:
            session_id: The session identifier to check
            
        Returns:
            bool: True if the session exists, False otherwise
        """

        with get_db() as db:
            session = (
                db
                .query(Session)
                .filter(Session.id == session_id)
                .first()
            )
            return session is not None

    def get_message_history(self, session_id: str) -> PostgresChatMessageHistory:
        """
        Get a message history handler for a specific session.
        
        Args:
            session_id: The identifier of the session to get history for
            
        Returns:
            PostgresChatMessageHistory: An object that provides access to the 
            chat message history for the specified session
            
        Note:
            This creates a connection to the database that will need to be managed
            by the caller.
        """
        
        return PostgresChatMessageHistory(
            'chat_history',
            session_id,
            sync_connection=psycopg.connect(connection_url)
        )
