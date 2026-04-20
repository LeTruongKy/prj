"""
Recommendation Service Module
Hybrid Recommendation System: Content-Based + Collaborative Filtering
"""
import numpy as np
import pandas as pd
import random
from typing import List, Dict, Tuple
from sqlalchemy.orm import Session
from sklearn.metrics.pairwise import cosine_similarity
from app.models.database_models import (
    UserInterest,
    ActivityTag,
    Tag,
    Activity,
    ActivityRegistration,
    UserActivitySchedule,
    ActivityCriteria,
    UserActivityInteraction,
)
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class RecommendationService:
    """
    Content-based filtering recommendation service
    Uses user interests and activity tags to recommend activities
    """

    def __init__(self, db: Session):
        """
        Initialize recommendation service
        
        Args:
            db: Database session
        """
        self.db = db

    def _get_user_profile_vector(self, user_id: str) -> Tuple[np.ndarray, List[int]]:
        """
        Create user profile vector from user interests
        
        Args:
            user_id: User UUID
            
        Returns:
            Tuple of (user_vector, tag_ids)
            - user_vector: numpy array of user interest weights
            - tag_ids: corresponding tag IDs
        """
        # Query user interests with weights
        user_interests = self.db.query(UserInterest).filter(
            UserInterest.userId == user_id
        ).all()

        if not user_interests:
            logger.warning(f"No interests found for user {user_id}")
            return np.array([]), []

        tag_ids = [interest.tagId for interest in user_interests]
        weights = np.array([interest.weight for interest in user_interests], dtype=float)

        # Fixed Min-Max Normalization: convert weight (0-100) to (0-1)
        MIN_WEIGHT = 0
        MAX_WEIGHT = 100
        
        weights_normalized = (weights - MIN_WEIGHT) / (MAX_WEIGHT - MIN_WEIGHT)
        weights_normalized = np.clip(weights_normalized, 0.0, 1.0)

        return weights_normalized, tag_ids

    def _get_activity_matrix(self, tag_ids: List[int]) -> Tuple[pd.DataFrame, Dict[int, dict]]:
        """
        Create activity matrix from activity tags
        Each activity is represented by a vector of tag weights
        
        Args:
            tag_ids: List of relevant tag IDs from user interests
            
        Returns:
            Tuple of (activity_matrix, activity_info_dict)
            - activity_matrix: DataFrame with activities as rows and user's tags as columns
            - activity_info_dict: Dictionary with activity metadata
        """
        if not tag_ids:
            logger.warning("No tag IDs provided for activity matrix creation")
            return pd.DataFrame(), {}

        # Query activities that have tags matching user interests
        activity_tags = self.db.query(ActivityTag).filter(
            ActivityTag.tagId.in_(tag_ids)
        ).all()

        if not activity_tags:
            logger.warning(f"No activities found for tags {tag_ids}")
            return pd.DataFrame(), {}

        # Get unique activity IDs
        activity_ids = list(set([at.activityId for at in activity_tags]))

        # Create a mapping of activity_id -> tags
        activity_tag_map = {}
        for at in activity_tags:
            if at.activityId not in activity_tag_map:
                activity_tag_map[at.activityId] = []
            activity_tag_map[at.activityId].append(at.tagId)

        # Get activity details
        activities = self.db.query(Activity).filter(
            Activity.id.in_(activity_ids)
        ).all()

        activity_info = {}
        for activity in activities:
            activity_info[activity.id] = {
                'title': activity.title,
                'description': activity.description,
                'tags': activity_tag_map.get(activity.id, [])
            }

        # Create activity matrix (sparse representation)
        # Rows: activities, Columns: tags that user is interested in
        matrix_data = []
        matrix_indexes = []

        for activity_id in activity_ids:
            activity_vector = []
            for tag_id in tag_ids:
                # 1 if activity has this tag, 0 otherwise
                has_tag = 1 if tag_id in activity_tag_map.get(activity_id, []) else 0
                activity_vector.append(has_tag)
            matrix_data.append(activity_vector)
            matrix_indexes.append(activity_id)

        activity_matrix = pd.DataFrame(
            matrix_data,
            index=matrix_indexes,
            columns=tag_ids
        )

        return activity_matrix, activity_info

    def _calculate_similarities(
        self,
        user_vector: np.ndarray,
        activity_matrix: pd.DataFrame
    ) -> Dict[int, float]:
        """
        Calculate cosine similarity between user profile and activities
        
        Args:
            user_vector: User interest weight vector
            activity_matrix: DataFrame of activity tag vectors
            
        Returns:
            Dictionary mapping activity_id to similarity score
        """
        if len(user_vector) == 0 or activity_matrix.empty:
            return {}

        # Reshape user vector for sklearn
        user_vector_reshaped = user_vector.reshape(1, -1)

        # Calculate cosine similarities
        similarities = cosine_similarity(
            user_vector_reshaped,
            activity_matrix.values
        )[0]

        # Create similarity mapping
        similarity_scores = {}
        for idx, activity_id in enumerate(activity_matrix.index):
            similarity_scores[activity_id] = float(similarities[idx])

        return similarity_scores

    def _get_user_activity_history(self, user_id: str) -> List[int]:
        """
        Get list of activities user has registered for (user history)
        Used to exclude already registered activities
        
        Args:
            user_id: User UUID
            
        Returns:
            List of activity IDs user has registered for
        """
        try:
            # Query all registrations (exclude activities user already registered)
            registrations = self.db.query(ActivityRegistration).filter(
                ActivityRegistration.userId == user_id
            ).all()
            
            activity_ids = [reg.activityId for reg in registrations]
            
            if activity_ids:
                logger.info(f"User {user_id} has registered for {len(activity_ids)} activities")
                return activity_ids
            else:
                logger.info(f"User {user_id} has no activity registrations")
                return []
                
        except Exception as e:
            logger.warning(f"Error fetching user activity history for {user_id}: {str(e)}")
            return []

    def _build_activity_co_occurrence_matrix(self) -> Dict[int, Dict[int, float]]:
        """
        Build activity co-occurrence matrix from user activity interactions
        If many users join both activity A and B, they are considered similar
        Uses REGISTER and CHECK_IN events for more data than verified only
        
        Returns:
            Dictionary: {activity_id: {similar_activity_id: similarity_score}}
        """
        try:
            # Query user interactions (REGISTER and CHECK_IN for collaborative filtering)
            interactions = self.db.query(UserActivityInteraction).filter(
                UserActivityInteraction.action.in_(["REGISTER", "CHECK_IN"])
            ).all()
            if not interactions:
                logger.warning("No interactions found for collaborative filtering")
                return {}
            # Build user -> activities mapping
            user_activity_map = {}
            for interaction in interactions:
                if interaction.userId not in user_activity_map:
                    user_activity_map[interaction.userId] = set()
                user_activity_map[interaction.userId].add(interaction.activityId)
            
            # Build activity co-occurrence matrix
            # co_occurrence[A][B] = number of users who joined both A and B
            co_occurrence = {}
            
            for user_activities in user_activity_map.values():
                activities_list = list(user_activities)
                # For each pair of activities user has joined
                for i, activity_a in enumerate(activities_list):
                    if activity_a not in co_occurrence:
                        co_occurrence[activity_a] = {}
                    
                    for activity_b in activities_list[i+1:]:
                        if activity_b not in co_occurrence[activity_a]:
                            co_occurrence[activity_a][activity_b] = 0
                        co_occurrence[activity_a][activity_b] += 1
            # logger.info(f"Raw co-occurrence matrix built with {co_occurrence} activities")
            # Normalize co-occurrence scores to 0-1 range
            if co_occurrence:
                max_co_occurrence = max(
                    max(scores.values()) if scores else 0
                    for scores in co_occurrence.values()
                )
                
                if max_co_occurrence > 0:
                    # Normalize by dividing by max value
                    for activity_a in co_occurrence:
                        for activity_b in co_occurrence[activity_a]:
                            co_occurrence[activity_a][activity_b] = (
                                co_occurrence[activity_a][activity_b] / max_co_occurrence
                            )
            
            logger.info(f"Built co-occurrence matrix with {len(co_occurrence)} activities")
            return co_occurrence
            
        except Exception as e:
            logger.warning(f"Error building co-occurrence matrix: {str(e)}")
            return {}

    def _calculate_collaborative_score(
        self,
        user_activity_history: List[int],
        candidate_activity_id: int,
        co_occurrence_matrix: Dict[int, Dict[int, float]]
    ) -> float:
        """
        Calculate collaborative filtering score for a candidate activity
        Based on similarity to activities user has already joined
        
        Args:
            user_activity_history: List of activity IDs user has joined
            candidate_activity_id: Activity to score
            co_occurrence_matrix: Activity similarity matrix
            
        Returns:
            Collaborative score (0-1)
        """
        if not user_activity_history:
            return 0.0
        
        collaborative_scores = []
        
        for joined_activity_id in user_activity_history:
            # Check if there's a co-occurrence relationship
            if joined_activity_id in co_occurrence_matrix:
                if candidate_activity_id in co_occurrence_matrix[joined_activity_id]:
                    score = co_occurrence_matrix[joined_activity_id][candidate_activity_id]
                    collaborative_scores.append(score)
            
            # Check reverse direction
            if candidate_activity_id in co_occurrence_matrix:
                if joined_activity_id in co_occurrence_matrix[candidate_activity_id]:
                    score = co_occurrence_matrix[candidate_activity_id][joined_activity_id]
                    collaborative_scores.append(score)
        
        # Return average score, or 0 if no similar activities found
        if collaborative_scores:
            return np.mean(collaborative_scores)
        else:
            return 0.0

    def _normalize_score(self, score: float) -> float:
        """
        Normalize score to 0-1 range
        """
        return min(max(score, 0.0), 1.0)

    def _check_schedule_conflict(self, user_id: str, activity: Activity) -> bool:
        """
        Check if activity conflicts with user's scheduled activities
        
        Args:
            user_id: User UUID
            activity: Activity object to check
            
        Returns:
            True if conflict exists, False otherwise
        """
        try:
            # Get user's scheduled activities
            user_schedules = self.db.query(UserActivitySchedule).filter(
                UserActivitySchedule.userId == user_id
            ).all()
            
            if not user_schedules:
                return False
            
            # Check for time overlap with any scheduled activity
            for schedule in user_schedules:
                # Conflict if: activity.startTime < schedule.endTime AND activity.endTime > schedule.startTime
                if (activity.startTime < schedule.endTime and 
                    activity.endTime > schedule.startTime):
                    return True
            
            return False
        except Exception as e:
            logger.warning(f"Error checking schedule conflict for user {user_id}: {str(e)}")
            return False

    def _calculate_criteria_bonus(self, user_id: str, activity: Activity) -> float:
        """
        Calculate bonus score based on activity criteria matching
        
        Args:
            user_id: User UUID
            activity: Activity object
            
        Returns:
            Bonus score (0.0-0.3)
        """
        if activity.criteriaGroupId is None:
            return 0.0
        
        try:
            # Check if activity has criteria requirements
            criteria = self.db.query(ActivityCriteria).filter(
                ActivityCriteria.activityId == activity.id
            ).first()
            
            if criteria is not None:
                # Activity has criteria, apply small bonus
                return 0.1
            else:
                return 0.0
        except Exception as e:
            logger.warning(f"Error calculating criteria bonus: {str(e)}")
            return 0.0

    def _hybrid_score(
        self,
        content_score: float,
        collaborative_score: float,
        content_weight: float = 0.6,
        collaborative_weight: float = 0.4
    ) -> float:
        """
        Combine content-based and collaborative scores
        
        Args:
            content_score: Content-based similarity score (0-1)
            collaborative_score: Collaborative similarity score (0-1)
            content_weight: Weight for content-based (default 0.6)
            collaborative_weight: Weight for collaborative (default 0.4)
            
        Returns:
            Combined hybrid score (0-1) with small random noise for diversity
        """
        # Normalize both scores
        content_norm = self._normalize_score(content_score)
        collab_norm = self._normalize_score(collaborative_score)
        
        # Calculate weighted combination
        hybrid = (content_weight * content_norm) + (collaborative_weight * collab_norm)
        
        # Add small random noise for diversity (0 to 0.1)
        noise = random.uniform(0, 0.1)
        final_score = hybrid + noise
        
        # Ensure final score stays in 0-1 range
        return self._normalize_score(final_score)

    def calculate_recommendations(
        self,
        user_id: str,
        limit: int = None
    ) -> List[Dict]:
        """
        Main recommendation calculation function using Hybrid approach
        Combines Content-Based Filtering (60%) + Collaborative Filtering (40%)
        
        Args:
            user_id: User UUID
            limit: Maximum number of recommendations to return
            
        Returns:
            List of recommended activities with content/collaborative/final scores
        """
        if limit is None:
            limit = settings.RECOMMENDATION_LIMIT

        try:
            # ========== CONTENT-BASED FILTERING ==========
            # Step 1: Create user profile vector from interests
            user_vector, tag_ids = self._get_user_profile_vector(user_id)

            if len(user_vector) == 0:
                logger.warning(f"User {user_id} has no interests - using collaborative only")
                content_scores = {}
                activity_info = {}
            else:
                # Step 2: Create activity matrix
                activity_matrix, activity_info = self._get_activity_matrix(tag_ids)

                if activity_matrix.empty:
                    logger.warning(f"No activities found for user {user_id} interests")
                    content_scores = {}
                else:
                    # Step 3: Calculate content-based similarities
                    content_scores = self._calculate_similarities(user_vector, activity_matrix)
            
            # ========== COLLABORATIVE FILTERING ==========
            # Step 4: Get user's activity history
            user_activity_history = self._get_user_activity_history(user_id)
            
            # Step 5: Build activity co-occurrence matrix
            co_occurrence_matrix = self._build_activity_co_occurrence_matrix()
            
            # ========== HYBRID SCORING ==========
            # Step 6: Get all approved activities and calculate hybrid scores
            all_activities = self.db.query(Activity).filter(
                Activity.status == "PUBLISHED"
            ).all()
            
            hybrid_scores = {}
            for activity in all_activities:
                activity_id = activity.id
                
                # Skip if user already registered for this activity
                if activity_id in user_activity_history:
                    continue
                
                # Skip if schedule conflict with verified activities
                if self._check_schedule_conflict(user_id, activity):
                    continue
                
                # Get content-based score (default 0 if not found)
                content_score = content_scores.get(activity_id, 0.0)
                
                # Get collaborative score
                collaborative_score = self._calculate_collaborative_score(
                    user_activity_history,
                    activity_id,
                    co_occurrence_matrix
                )
                
                # Calculate criteria bonus
                criteria_bonus = self._calculate_criteria_bonus(user_id, activity)
                
                # Calculate hybrid score with randomness and apply bonus
                final_score = self._hybrid_score(content_score, collaborative_score) + criteria_bonus
                final_score = self._normalize_score(final_score)
                
                # Filter by minimum similarity
                if final_score >= settings.MIN_SIMILARITY_SCORE:
                    hybrid_scores[activity_id] = {
                        'content_score': round(content_score, 4),
                        'collaborative_score': round(collaborative_score, 4),
                        'final_score': round(final_score, 4),
                        'title': activity.title,
                        'description': activity.description,
                        'categoryId': activity.categoryId,
                        'unitId': activity.unitId,
                        'createdBy': activity.createdBy,
                        'location': activity.location,
                        'posterUrl': activity.posterUrl,
                        'startTime': activity.startTime,
                        'endTime': activity.endTime,
                        'maxParticipants': activity.maxParticipants,
                        'status': activity.status,
                        'approvedBy': activity.approvedBy,
                        'approvedAt': activity.approvedAt,
                        'criteriaGroupId': activity.criteriaGroupId,
                        'qrCodeUrl': activity.qrCodeUrl,
                        'requiresProof': activity.requiresProof,
                        'pointsValue': activity.pointsValue,
                        'createdAt': activity.createdAt,
                        'updatedAt': activity.updatedAt,
                        'activity_object': activity
                    }
            
            # Step 7: Sort by final score and get top N
            sorted_recommendations = sorted(
                hybrid_scores.items(),
                key=lambda x: x[1]['final_score'],
                reverse=True
            )[:limit]
            
            # Step 8: Build final response with all scores
            recommendations = []
            for activity_id, scores in sorted_recommendations:
                # Get tags for this activity
                activity_tags = self.db.query(Tag).join(
                    ActivityTag,
                    ActivityTag.tagId == Tag.id
                ).filter(
                    ActivityTag.activityId == activity_id
                ).all()

                # Convert requiresProof to boolean
                requires_proof = False
                if isinstance(scores['requiresProof'], bool):
                    requires_proof = scores['requiresProof']
                elif isinstance(scores['requiresProof'], str):
                    requires_proof = scores['requiresProof'].lower() in ['true', '1', 'yes']

                # Convert UUID objects to strings
                created_by = str(scores['createdBy']) if scores['createdBy'] else None
                approved_by = str(scores['approvedBy']) if scores['approvedBy'] else None

                recommendations.append({
                    'activity_id': activity_id,
                    'activity_title': scores['title'],
                    'description': scores['description'],
                    'categoryId': scores['categoryId'],
                    'unitId': scores['unitId'],
                    'createdBy': created_by,
                    'location': scores['location'],
                    'posterUrl': scores['posterUrl'],
                    'startTime': scores['startTime'],
                    'endTime': scores['endTime'],
                    'maxParticipants': scores['maxParticipants'],
                    'status': scores['status'],
                    'approvedBy': approved_by,
                    'approvedAt': scores['approvedAt'],
                    'criteriaGroupId': scores['criteriaGroupId'],
                    'qrCodeUrl': scores['qrCodeUrl'],
                    'requiresProof': requires_proof,
                    'pointsValue': scores['pointsValue'],
                    'createdAt': scores['createdAt'],
                    'updatedAt': scores['updatedAt'],
                    'similarity_score': scores['content_score'],  # Keep for backward compatibility
                    'collaborative_score': scores['collaborative_score'],
                    'final_score': scores['final_score'],
                    'tags': [
                        {
                            'id': tag.id,
                            'name': tag.name
                        }
                        for tag in activity_tags
                    ]
                })

            logger.info(f"Generated {len(recommendations)} hybrid recommendations for user {user_id}")
            return recommendations

        except Exception as e:
            logger.error(f"Error calculating recommendations for user {user_id}: {str(e)}")
            raise

    def get_user_profile(self, user_id: str) -> Dict:
        """
        Get user profile information (interests with weights)
        
        Args:
            user_id: User UUID
            
        Returns:
            Dictionary with user profile data
        """
        user_interests = self.db.query(UserInterest).filter(
            UserInterest.userId == user_id
        ).all()

        if not user_interests:
            return {
                'user_id': user_id,
                'interests': [],
                'total_interests': 0
            }

        interests_data = []
        for interest in user_interests:
            interests_data.append({
                'tag_id': interest.tagId,
                'tag_name': interest.tag.name,
                'weight': interest.weight
            })

        return {
            'user_id': user_id,
            'interests': interests_data,
            'total_interests': len(interests_data)
        }

    def get_activity_details(self, activity_id: int) -> Dict:
        """
        Get activity details with its tags
        
        Args:
            activity_id: Activity ID
            
        Returns:
            Dictionary with activity information
        """
        activity = self.db.query(Activity).filter(
            Activity.id == activity_id
        ).first()

        if not activity:
            return None

        activity_tags = self.db.query(Tag).join(
            ActivityTag,
            ActivityTag.tagId == Tag.id
        ).filter(
            ActivityTag.activityId == activity_id
        ).all()

        return {
            'id': activity.id,
            'title': activity.title,
            'description': activity.description,
            'tags': [
                {
                    'id': tag.id,
                    'name': tag.name
                }
                for tag in activity_tags
            ]
        }
