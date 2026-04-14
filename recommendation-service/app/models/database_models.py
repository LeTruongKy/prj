from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.cores.database import Base
from datetime import datetime

class Tag(Base):
    """
    Tags table model
    """
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    activity_tags = relationship("ActivityTag", back_populates="tag")
    user_interests = relationship("UserInterest", back_populates="tag")


class Activity(Base):
    """
    Activities table model
    """
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    categoryId = Column(Integer, nullable=True)
    unitId = Column(Integer, nullable=True)
    createdBy = Column(String(36), nullable=True)
    location = Column(String(255), nullable=True)
    posterUrl = Column(String(500), nullable=True)
    startTime = Column(DateTime, nullable=True)
    endTime = Column(DateTime, nullable=True)
    maxParticipants = Column(Integer, nullable=True)
    status = Column(String(50), nullable=True)
    approvedBy = Column(String(36), nullable=True)
    approvedAt = Column(DateTime, nullable=True)
    criteriaGroupId = Column(Integer, nullable=True)
    qrCodeUrl = Column(String(500), nullable=True)
    requiresProof = Column(String(10), nullable=True)
    pointsValue = Column(Integer, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    activity_tags = relationship("ActivityTag", back_populates="activity")


class ActivityTag(Base):
    """
    ActivityTags junction table model
    Relationships between activities and tags
    """
    __tablename__ = "activity_tags"

    activityId = Column(Integer, ForeignKey("activities.id", ondelete="CASCADE"), primary_key=True)
    tagId = Column(Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

    activity = relationship("Activity", back_populates="activity_tags")
    tag = relationship("Tag", back_populates="activity_tags")


class UserInterest(Base):
    """
    UserInterests table model
    User profile preferences with importance weights
    """
    __tablename__ = "user_interests"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(String(36), nullable=False)  # UUID stored as string
    tagId = Column(Integer, ForeignKey("tags.id", ondelete="CASCADE"), nullable=False)
    weight = Column(Float, default=1.0, nullable=False)  # Interest weight/importance
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tag = relationship("Tag", back_populates="user_interests")


class ActivityRegistration(Base):
    """
    ActivityRegistration table model
    Tracks user participation in activities for collaborative filtering
    """
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(String(36), nullable=False)  # UUID stored as string
    activityId = Column(Integer, ForeignKey("activities.id", ondelete="CASCADE"), nullable=False)
    proofStatus = Column(String(50), default="pending", nullable=False)
    registeredAt = Column(DateTime, default=datetime.utcnow)

    activity = relationship("Activity")


class UserActivitySchedule(Base):
    """
    UserActivitySchedule table model
    Tracks user's activity schedule for conflict detection
    """
    __tablename__ = "user_activity_schedule"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(String(36), nullable=False)  # UUID stored as string
    activityId = Column(Integer, ForeignKey("activities.id", ondelete="CASCADE"), nullable=False)
    startTime = Column(DateTime, nullable=False)
    endTime = Column(DateTime, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)

    activity = relationship("Activity")


class ActivityCriteria(Base):
    """
    ActivityCriteria table model
    Tracks criteria requirements for activities
    """
    __tablename__ = "activity_criteria"

    id = Column(Integer, primary_key=True, index=True)
    activityId = Column(Integer, ForeignKey("activities.id", ondelete="CASCADE"), nullable=False)
    criterionId = Column(Integer, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)

    activity = relationship("Activity")
