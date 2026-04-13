# CTU Activity Recommendation Service

## Overview

A high-performance Python recommendation service for the CTU Activity thesis project that uses content-based filtering to provide personalized activity recommendations to users.

### Key Features

- **Content-Based Filtering Algorithm**: Uses cosine similarity to match user interests with activities
- **FastAPI Framework**: High-performance async API endpoints
- **PostgreSQL Integration**: Direct database connection for real-time recommendations
- **User Profile Vector**: Dynamically creates user interest profiles with weighted preferences
- **Activity Vectorization**: Converts activities into tag-based feature vectors
- **Batch Processing**: Support for single and batch recommendation requests
- **Comprehensive API**: Multiple endpoints for recommendations, profiles, and activities

## Technology Stack

- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn
- **Database**: PostgreSQL with SQLAlchemy ORM
- **ML/Data**: scikit-learn, pandas, numpy
- **Validation**: Pydantic

## Project Structure

```
recommendation-service/
├── app/
│   ├── api/
│   │   └── routes/
│   │       └── recommendations.py      # API endpoints
│   ├── cores/
│   │   └── database.py                 # Database configuration
│   ├── models/
│   │   └── database_models.py          # SQLAlchemy models
│   ├── schemas/
│   │   └── schemas.py                  # Pydantic schemas
│   ├── services/
│   │   └── recommendation_service.py   # Core recommendation logic
│   ├── config.py                       # Application settings
│   └── main.py                         # FastAPI app initialization
├── requirements.txt                    # Python dependencies
├── .env.example                        # Environment configuration template
└── README.md                           # This file
```

## Installation & Setup

### 1. Prerequisites

- Python 3.9 or higher
- PostgreSQL database with CTU Activity database
- pip package manager

### 2. Clone and Setup

```bash
cd recommendation-service
```

### 3. Create Virtual Environment

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/ctu_activity
SERVICE_HOST=0.0.0.0
SERVICE_PORT=8001
RECOMMENDATION_LIMIT=10
MIN_SIMILARITY_SCORE=0.0
```

## Running the Service

### Development Mode

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

### Production Mode

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### Using Python Main

```bash
python -m app.main
```

The service will be available at: `http://localhost:8001`

## API Documentation

### Interactive API Documentation

Once running, access Swagger UI at:
- **Swagger**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

### API Endpoints

#### 1. Get Recommendations

**Endpoint**: `GET /api/recommendations/recommend/{user_id}`

**Parameters**:
- `user_id` (path): User UUID
- `limit` (query): Max recommendations (1-100, default: 10)

**Response**:
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "total_count": 5,
  "recommendations": [
    {
      "activity_id": 1,
      "activity_title": "Leadership Workshop",
      "description": "Develop leadership skills",
      "similarity_score": 0.95,
      "tags": [
        {"id": 1, "name": "leadership"},
        {"id": 2, "name": "development"}
      ]
    }
  ]
}
```

#### 2. Get User Profile

**Endpoint**: `GET /api/recommendations/user-profile/{user_id}`

**Response**:
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "interests": [
    {
      "tag_id": 1,
      "tag_name": "leadership",
      "weight": 0.8
    }
  ],
  "total_interests": 1
}
```

#### 3. Get Activity Details

**Endpoint**: `GET /api/recommendations/activity/{activity_id}`

**Response**:
```json
{
  "id": 1,
  "title": "Leadership Workshop",
  "description": "Develop leadership skills",
  "tags": [
    {"id": 1, "name": "leadership"}
  ]
}
```

#### 4. Batch Recommendations

**Endpoint**: `POST /api/recommendations/batch-recommend`

**Request Body**:
```json
{
  "user_ids": ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"],
  "limit": 10
}
```

#### 5. Health Check

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "healthy",
  "service": "recommendation-service"
}
```

## Algorithm Details

### Content-Based Filtering

The recommendation algorithm uses cosine similarity to match user interests with activities.

#### Step 1: User Profile Vector Creation

From `user_interests` table, create a weighted vector:
- Extract all tags the user is interested in
- Use the `weight` column as interest strength (0.0-1.0)
- Normalize weights to 0-1 range

```
User Profile Vector = [w1, w2, w3, ...] 
where wi = normalized weight for tag i
```

#### Step 2: Activity Matrix Creation

For each activity with matching tags:
- Create a binary vector indicating tag presence
- 1 if activity has the tag, 0 otherwise

```
Activity Matrix = 
[a1_tag1, a1_tag2, a1_tag3, ...]
[a2_tag1, a2_tag2, a2_tag3, ...]
[a3_tag1, a3_tag2, a3_tag3, ...]
...
```

#### Step 3: Similarity Calculation

Calculate cosine similarity between user vector and each activity:

```
similarity = (User_Vector · Activity_Vector) / (||User_Vector|| × ||Activity_Vector||)
```

Using `sklearn.metrics.pairwise.cosine_similarity`

#### Step 4: Ranking

Sort activities by similarity score (descending) and return top N results.

### Example Calculation

**User Profile**:
- Interested in: Leadership (weight: 0.8), Development (weight: 0.6)

**Activities**:
1. Leadership Workshop: tags [Leadership, Development] → similarity: 0.95
2. Tech Meetup: tags [Development] → similarity: 0.60
3. Sports Event: tags [Sports] → similarity: 0.00

**Result**: Recommend in order: Leadership Workshop → Tech Meetup

## Database Schema

### tags

```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### activities

```sql
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  categoryId INTEGER,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### activity_tags

```sql
CREATE TABLE activity_tags (
  activityId INTEGER REFERENCES activities(id) ON DELETE CASCADE,
  tagId INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (activityId, tagId)
);
```

### user_interests

```sql
CREATE TABLE user_interests (
  id SERIAL PRIMARY KEY,
  userId UUID NOT NULL,
  tagId INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  weight FLOAT DEFAULT 1.0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Successful request
- **400**: Invalid request parameters
- **404**: Resource not found (user/activity)
- **500**: Server error
- **422**: Validation error

Error Response Format:
```json
{
  "detail": "Error message describing what went wrong"
}
```

## Performance Considerations

### Optimization Strategies

1. **Caching**: For frequently accessed user profiles
2. **Database Indexing**: On `userId`, `tagId`, `activityId`
3. **Batch Processing**: For multiple user recommendations
4. **Connection Pooling**: SQLAlchemy configured with pool_size=10

### Complexity

- **Time Complexity**: O(m × n) where m = user interests, n = activities
- **Space Complexity**: O(m × n) for activity matrix

### Scalability Tips

- Use caching layer (Redis) for popular user recommendations
- Implement recommendation pre-calculation for batch processing
- Add clustering for similar users
- Consider matrix factorization for large datasets

## Integration with NestJS Backend

### Calling the Service from NestJS

```typescript
// Example NestJS HTTP call
const response = await this.httpService.get(
  `http://localhost:8001/api/recommendations/recommend/${userId}`,
  { params: { limit: 10 } }
).toPromise();
```

### Example Response Handling

```typescript
interface RecommendationResponse {
  user_id: string;
  total_count: number;
  recommendations: {
    activity_id: number;
    activity_title: string;
    description: string;
    similarity_score: number;
    tags: { id: number; name: string }[];
  }[];
}
```

## Testing

### Manual Testing with cURL

```bash
# Get recommendations
curl -X GET "http://localhost:8001/api/recommendations/recommend/550e8400-e29b-41d4-a716-446655440000?limit=10"

# Get user profile
curl -X GET "http://localhost:8001/api/recommendations/user-profile/550e8400-e29b-41d4-a716-446655440000"

# Get activity details
curl -X GET "http://localhost:8001/api/recommendations/activity/1"

# Health check
curl -X GET "http://localhost:8001/health"
```

### Using Swagger UI

1. Open http://localhost:8001/docs
2. Try out endpoints directly from the interface
3. View request/response examples

## Troubleshooting

### Database Connection Error

```
psycopg2.OperationalError: could not connect to server
```

**Solution**: 
- Check DATABASE_URL in `.env`
- Verify PostgreSQL is running
- Confirm database exists

### No Recommendations Returned

**Possible Causes**:
1. User has no interests (user_interests table is empty)
2. No activities exist for user's interests
3. MIN_SIMILARITY_SCORE is too high

**Solution**:
- Check user interests in database: `SELECT * FROM user_interests WHERE userId = ?`
- Add test data if needed
- Lower MIN_SIMILARITY_SCORE in `.env`

### Slow Recommendations

**Optimization**:
- Add indexes on userId, tagId: `CREATE INDEX idx_user_interests_userId ON user_interests(userId);`
- Increase connection pool in database.py
- Consider pre-calculation of recommendations

## Development Guide

### Adding New Features

1. **New Endpoint**: Add to `app/api/routes/recommendations.py`
2. **New Schema**: Add to `app/schemas/schemas.py`
3. **New Logic**: Extend `RecommendationService` in `app/services/recommendation_service.py`

### Code Style

- Use type hints for all functions
- Add docstrings for classes and functions
- Follow PEP 8 style guide
- Run linting: `pylint app/`

## Future Enhancements

- [ ] Hybrid recommendation (content + collaborative)
- [ ] User similarity clustering
- [ ] Matrix factorization (SVD)
- [ ] Real-time model updates
- [ ] GraphQL API option
- [ ] Recommendation explanation
- [ ] A/B testing framework
- [ ] Feedback loop for model improvement

## License

MIT License - See LICENSE file for details

## Support & Contact

For issues or questions about this service:
- Check troubleshooting section above
- Review error logs
- Check database connectivity
- Verify environment configuration

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [scikit-learn Cosine Similarity](https://scikit-learn.org/stable/modules/metrics.html#cosine-similarity)
- [Content-Based Filtering](https://en.wikipedia.org/wiki/Recommender_system#Content-based_filtering)
