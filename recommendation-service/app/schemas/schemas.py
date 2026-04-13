from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class TagBase(BaseModel):
    """Base Tag schema"""
    name: str = Field(..., min_length=1, max_length=100)


class TagResponse(TagBase):
    """Tag response schema"""
    id: int

    class Config:
        from_attributes = True


class ActivityBase(BaseModel):
    """Base Activity schema"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    categoryId: Optional[int] = None


class ActivityResponse(ActivityBase):
    """Activity response schema"""
    id: int

    class Config:
        from_attributes = True


class ActivityTagResponse(BaseModel):
    """Activity with tags response"""
    id: int
    title: str
    description: Optional[str]
    tags: List[TagResponse] = []

    class Config:
        from_attributes = True


class UserInterestResponse(BaseModel):
    """User interest response"""
    id: int
    userId: str
    tag: TagResponse
    weight: float

    class Config:
        from_attributes = True


class RecommendationResponse(BaseModel):
    """Single recommendation response"""
    activity_id: int
    activity_title: str
    description: Optional[str]
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    collaborative_score: float = Field(default=0.0, ge=0.0, le=1.0)
    final_score: float = Field(default=0.0, ge=0.0, le=1.0)
    tags: List[TagResponse] = []


class RecommendationsListResponse(BaseModel):
    """List of recommendations response"""
    user_id: str
    total_count: int
    recommendations: List[RecommendationResponse] = []


class ErrorResponse(BaseModel):
    """Error response schema"""
    detail: str
    status_code: int
