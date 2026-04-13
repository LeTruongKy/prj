from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """
    Application Settings
    """
    # Database Configuration (individual components)
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USERNAME: str = "postgres"
    DB_PASSWORD: str = "postgres"
    DB_NAME: str = "ctuactivity"
    
    # Service Configuration
    SERVICE_HOST: str = "0.0.0.0"
    SERVICE_PORT: int = 8001
    
    # Recommendation Configuration
    RECOMMENDATION_LIMIT: int = 10
    MIN_SIMILARITY_SCORE: float = 0.0
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def DATABASE_URL(self) -> str:
        """
        Build DATABASE_URL from individual components
        """
        return f"postgresql://{self.DB_USERNAME}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

settings = Settings()
