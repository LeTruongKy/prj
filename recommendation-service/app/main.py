"""
FastAPI Application for Recommendation Service
"""
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Create FastAPI application
app = FastAPI(
    title="CTU Activity Recommendation Service",
    description="Hybrid Recommendation System: Content-Based Filtering (60%) + Collaborative Filtering (40%)",
    version="2.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from app.api.routes import recommendations

# Include routers
app.include_router(
    recommendations.router,
    prefix="/api/recommendations",
    tags=["recommendations"]
)

@app.get("/", tags=["health"])
async def root():
    """
    Health check endpoint
    """
    return {
        "message": "CTU Activity Recommendation Service",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health", tags=["health"])
async def health_check():
    """
    Service health check endpoint
    """
    return {
        "status": "healthy",
        "service": "recommendation-service"
    }

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """
    Global exception handler
    """
    logger = logging.getLogger(__name__)
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc)
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.SERVICE_HOST,
        port=settings.SERVICE_PORT,
        reload=True
    )
