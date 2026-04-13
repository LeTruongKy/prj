"""
Recommendation API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
import logging

from app.cores.database import get_db
from app.services.recommendation_service import RecommendationService
from app.schemas.schemas import (
    RecommendationsListResponse,
    RecommendationResponse,
    ErrorResponse
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/recommend/{user_id}",
    response_model=RecommendationsListResponse,
    tags=["recommendations"],
    summary="Get personalized activity recommendations for a user",
    description="Calculate recommendations using Hybrid approach: Content-Based Filtering (60%) + Collaborative Filtering (40%)"
)
async def get_recommendations(
    user_id: str,
    limit: int = Query(10, ge=1, le=100, description="Maximum number of recommendations"),
    db: Session = Depends(get_db)
) -> RecommendationsListResponse:
    """
    Get personalized activity recommendations for a user
    
    **Hybrid Recommendation Algorithm:**
    - **Content-Based (60%)**: Uses cosine similarity between user interests and activity tags
    - **Collaborative (40%)**: Analyzes activities other similar users have joined
    - **Final Score**: Weighted combination of both approaches + small randomness for diversity
    
    **Path Parameters:**
    - `user_id`: UUID of the user
    
    **Query Parameters:**
    - `limit`: Maximum number of recommendations (default: 10, max: 100)
    
    **Returns:**
    - List of recommended activities with scores
    - Each recommendation includes:
      - `activity_id`: Activity identifier
      - `activity_title`: Activity name
      - `description`: Activity description
      - `similarity_score`: Content-based score (0-1)
      - `collaborative_score`: Collaborative score (0-1)
      - `final_score`: Hybrid score combining both approaches (0-1)
      - `tags`: Associated activity tags
    
    **Edge Cases:**
    - If user has no interests: Uses only collaborative filtering
    - If user has no registration history: Uses only content-based filtering
    - Results include randomness for recommendation diversity
    """
    try:
        recommendation_service = RecommendationService(db)
        recommendations = recommendation_service.calculate_recommendations(user_id, limit)

        return RecommendationsListResponse(
            user_id=user_id,
            total_count=len(recommendations),
            recommendations=[
                RecommendationResponse(**rec) for rec in recommendations
            ]
        )

    except Exception as e:
        logger.error(f"Error getting recommendations for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating recommendations: {str(e)}"
        )


@router.get(
    "/user-profile/{user_id}",
    tags=["user-profiles"],
    summary="Get user's interest profile",
    description="Retrieve user's interests and their associated weights"
)
async def get_user_profile(
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    Get user's interest profile with weights
    
    **Path Parameters:**
    - `user_id`: UUID of the user
    
    **Returns:**
    - User's tags/interests with their weights
    - Total number of interests
    """
    try:
        recommendation_service = RecommendationService(db)
        profile = recommendation_service.get_user_profile(user_id)

        if not profile['interests']:
            raise HTTPException(
                status_code=404,
                detail=f"No interests found for user {user_id}"
            )

        return profile

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user profile {user_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving user profile: {str(e)}"
        )


@router.get(
    "/activity/{activity_id}",
    tags=["activities"],
    summary="Get activity details",
    description="Retrieve activity information including its tags"
)
async def get_activity_details(
    activity_id: int,
    db: Session = Depends(get_db)
):
    """
    Get activity details with associated tags
    
    **Path Parameters:**
    - `activity_id`: ID of the activity
    
    **Returns:**
    - Activity information: id, title, description, tags
    """
    try:
        recommendation_service = RecommendationService(db)
        activity = recommendation_service.get_activity_details(activity_id)

        if not activity:
            raise HTTPException(
                status_code=404,
                detail=f"Activity {activity_id} not found"
            )

        return activity

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting activity {activity_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving activity: {str(e)}"
        )


@router.post(
    "/batch-recommend",
    tags=["recommendations"],
    summary="Get recommendations for multiple users",
    description="Calculate recommendations for multiple users at once"
)
async def batch_get_recommendations(
    user_ids: List[str],
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get recommendations for multiple users in a single batch request
    
    **Request Body:**
    - `user_ids`: List of user UUIDs
    
    **Query Parameters:**
    - `limit`: Maximum recommendations per user
    
    **Returns:**
    - Dictionary mapping user_id to their recommendations
    """
    try:
        recommendation_service = RecommendationService(db)
        batch_results = {}

        for user_id in user_ids:
            recommendations = recommendation_service.calculate_recommendations(user_id, limit)
            batch_results[user_id] = {
                'total_count': len(recommendations),
                'recommendations': recommendations
            }

        return {
            'batch_count': len(batch_results),
            'results': batch_results
        }

    except Exception as e:
        logger.error(f"Error in batch recommendations: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error in batch processing: {str(e)}"
        )
