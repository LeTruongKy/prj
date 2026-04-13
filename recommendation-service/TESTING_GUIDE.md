# Recommendation Service Testing Guide

Complete guide for testing the Python Recommendation Service.

## Test Categories

1. [Health & Connectivity](#health--connectivity)
2. [Algorithm Testing](#algorithm-testing)
3. [API Endpoint Testing](#api-endpoint-testing)
4. [Performance Testing](#performance-testing)
5. [Edge Cases](#edge-cases)

## Health & Connectivity

### Test 1: Service Health Check

**Endpoint**: `GET /health`

**cURL**:
```bash
curl -X GET "http://localhost:8001/health"
```

**Expected Response** (Status: 200):
```json
{
  "status": "healthy",
  "service": "recommendation-service"
}
```

### Test 2: Root Endpoint

**Endpoint**: `GET /`

**cURL**:
```bash
curl -X GET "http://localhost:8001/"
```

**Expected Response** (Status: 200):
```json
{
  "message": "CTU Activity Recommendation Service",
  "version": "1.0.0",
  "status": "running"
}
```

### Test 3: Database Connection

**Method**: Check logs or call any endpoint that requires DB access.

**Example**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/user-profile/550e8400-e29b-41d4-a716-446655440000"
```

If connection fails, you'll see database error in response.

## Algorithm Testing

### Test 4: Recommendation Algorithm

**Objective**: Verify cosine similarity calculation works correctly

**Setup**:
```sql
-- Add test tags
INSERT INTO tags (id, name) VALUES 
  (1, 'Leadership'),
  (2, 'Development'),
  (3, 'Sports'),
  (4, 'Art');

-- Add test activities
INSERT INTO activities (id, title, description) VALUES 
  (1, 'Leadership Workshop', 'Learn leadership skills'),
  (2, 'Coding Bootcamp', 'JavaScript and Python'),
  (3, 'Marathon', 'Long distance running'),
  (4, 'Art Exhibition', 'Modern art showcase');

-- Link activities to tags
INSERT INTO activity_tags (activityId, tagId) VALUES 
  (1, 1), (1, 2),
  (2, 2),
  (3, 3),
  (4, 4);

-- Add user interests
INSERT INTO user_interests (userId, tagId, weight) VALUES 
  ('test-user-1', 1, 0.8),
  ('test-user-1', 2, 0.6);
```

**Test**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/recommend/test-user-1?limit=10"
```

**Expected Result**:
- Activity 1 should rank first (has both tags: Leadership, Development)
- Activity 2 should rank second (has one matching tag: Development)
- Activity 3 & 4 should rank last or not appear (no matching tags)
- Similarity scores should be between 0 and 1

**Response Example**:
```json
{
  "user_id": "test-user-1",
  "total_count": 2,
  "recommendations": [
    {
      "activity_id": 1,
      "activity_title": "Leadership Workshop",
      "description": "Learn leadership skills",
      "similarity_score": 0.95,
      "tags": [
        {"id": 1, "name": "Leadership"},
        {"id": 2, "name": "Development"}
      ]
    },
    {
      "activity_id": 2,
      "activity_title": "Coding Bootcamp",
      "description": "JavaScript and Python",
      "similarity_score": 0.6,
      "tags": [{"id": 2, "name": "Development"}]
    }
  ]
}
```

### Test 5: Vector Normalization

**Objective**: Verify weight normalization works

**Setup**:
```sql
INSERT INTO tags (id, name) VALUES (5, 'Networking');

INSERT INTO user_interests (userId, tagId, weight) VALUES 
  ('test-user-2', 5, 100.0);  -- Very high weight

INSERT INTO activities (id, title) VALUES (5, 'Networking Event');

INSERT INTO activity_tags (activityId, tagId) VALUES (5, 5);
```

**Test**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/recommend/test-user-2?limit=10"
```

**Verify**:
- Similarity score should still be ≤ 1.0 (normalized)
- Weight normalization is working correctly

## API Endpoint Testing

### Test 6: Get Recommendations

**Endpoint**: `GET /api/recommendations/recommend/{user_id}`

**Test Cases**:

**a) Valid user with interests**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/recommend/test-user-1?limit=5"
```
✓ Should return recommendations

**b) Valid user without interests**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/recommend/test-user-no-interests?limit=10"
```
- Status: 200
- Should return empty recommendations array

**c) Invalid limit parameter**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/recommend/test-user-1?limit=0"
```
- Status: 422 (Validation Error)

**d) Limit exceeds maximum**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/recommend/test-user-1?limit=101"
```
- Status: 422 (Validation Error)

### Test 7: Get User Profile

**Endpoint**: `GET /api/recommendations/user-profile/{user_id}`

**Test**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/user-profile/test-user-1"
```

**Expected Response** (Status: 200):
```json
{
  "user_id": "test-user-1",
  "interests": [
    {
      "tag_id": 1,
      "tag_name": "Leadership",
      "weight": 0.8
    },
    {
      "tag_id": 2,
      "tag_name": "Development",
      "weight": 0.6
    }
  ],
  "total_interests": 2
}
```

**Test non-existent user**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/user-profile/non-existent-user"
```
- Status: 404
- Message should indicate user not found

### Test 8: Get Activity Details

**Endpoint**: `GET /api/recommendations/activity/{activity_id}`

**Valid request**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/activity/1"
```

**Expected Response** (Status: 200):
```json
{
  "id": 1,
  "title": "Leadership Workshop",
  "description": "Learn leadership skills",
  "tags": [
    {"id": 1, "name": "Leadership"},
    {"id": 2, "name": "Development"}
  ]
}
```

**Non-existent activity**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/activity/9999"
```
- Status: 404

### Test 9: Batch Recommendations

**Endpoint**: `POST /api/recommendations/batch-recommend`

**Request**:
```bash
curl -X POST "http://localhost:8001/api/recommendations/batch-recommend?limit=5" \
  -H "Content-Type: application/json" \
  -d '{
    "user_ids": ["test-user-1", "test-user-2", "non-existent-user"]
  }'
```

**Expected Response** (Status: 200):
```json
{
  "batch_count": 3,
  "results": {
    "test-user-1": {
      "total_count": 2,
      "recommendations": [...]
    },
    "test-user-2": {
      "total_count": 1,
      "recommendations": [...]
    },
    "non-existent-user": {
      "total_count": 0,
      "recommendations": []
    }
  }
}
```

## Performance Testing

### Test 10: Response Time

**Objective**: Measure API response time

**Single recommendation request**:
```bash
time curl -X GET "http://localhost:8001/api/recommendations/recommend/test-user-1?limit=10"
```

**Expected**: < 500ms for typical queries

### Test 11: Load Testing with Multiple Requests

**Using Apache Bench**:
```bash
ab -n 100 -c 10 "http://localhost:8001/api/recommendations/recommend/test-user-1"
```

**Expected Results**:
- No errors in responses
- Average response time < 1 second
- 95th percentile < 2 seconds

### Test 12: Large Dataset

**Setup**: Add many activities and tags
```sql
-- Add 100 tags
INSERT INTO tags (name) VALUES 
  (CONCAT('tag-', GENERATE_SERIES(1, 100)));

-- Add 1000 activities
INSERT INTO activities (title, description) VALUES 
  (CONCAT('activity-', GENERATE_SERIES(1, 1000)), 'Test activity description');

-- Randomly link tags to activities
INSERT INTO activity_tags (activityId, tagId) 
SELECT a.id, t.id FROM activities a, tags t 
WHERE RANDOM() < 0.1  -- 10% linking
LIMIT 5000;
```

**Test**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/recommend/test-user-1"
```

**Monitor**: Response time should remain acceptable (< 2 seconds)

## Edge Cases

### Test 13: Empty Database

**Setup**: Use test database with no data

**Test**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/recommend/any-user"
```

**Expected**: 
- Status: 200
- Empty recommendations array

### Test 14: User with Single Interest

**Setup**:
```sql
DELETE FROM user_interests WHERE userId = 'test-user-3';
INSERT INTO user_interests (userId, tagId, weight) VALUES ('test-user-3', 1, 1.0);
```

**Test**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/recommend/test-user-3"
```

**Expected**: Should work correctly with single interest

### Test 15: Activity with No Tags

**Setup**:
```sql
INSERT INTO activities (title, description) VALUES ('No Tag Activity', 'Activity without tags');
-- Don't add any activity_tags entries
```

**Result**: This activity won't appear in recommendations (correct behavior)

### Test 16: Very High Weight Values

**Setup**:
```sql
INSERT INTO user_interests (userId, tagId, weight) VALUES 
  ('test-user-4', 1, 999999.0);
```

**Test**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/recommend/test-user-4"
```

**Expected**: Still works, weights normalized correctly

### Test 17: UUID Format Validation

**Test with invalid UUID**:
```bash
curl -X GET "http://localhost:8001/api/recommendations/recommend/not-a-uuid"
```

**Expected**: Still processes (userId is string, not strictly validated)

### Test 18: Unicode Characters in Tags

**Setup**:
```sql
INSERT INTO tags (name) VALUES ('Lãnh đạo'), ('Phát triển');
```

**Expected**: Works correctly with Vietnamese characters

## Integration Testing

### Test 19: Call from NestJS Backend

Example code:
```typescript
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// In your service
const response = await firstValueFrom(
  this.httpService.get('http://localhost:8001/api/recommendations/recommend/test-user-1')
);
console.log(response.data);
```

### Test 20: Error Handling in NestJS

```typescript
try {
  const response = await firstValueFrom(
    this.httpService.get('http://localhost:8001/api/recommendations/recommend/invalid-user')
  );
} catch (error) {
  console.error('Error calling recommendation service:', error.message);
}
```

## Automated Testing Script

Save as `test_api.sh`:

```bash
#!/bin/bash

echo "=== CTU Recommendation Service Test Suite ==="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
curl -s -X GET "http://localhost:8001/health" | jq .
echo ""

# Test 2: Recommendations
echo "Test 2: Get Recommendations"
curl -s -X GET "http://localhost:8001/api/recommendations/recommend/test-user-1?limit=5" | jq .
echo ""

# Test 3: User Profile
echo "Test 3: Get User Profile"
curl -s -X GET "http://localhost:8001/api/recommendations/user-profile/test-user-1" | jq .
echo ""

# Test 4: Activity Details
echo "Test 4: Get Activity Details"
curl -s -X GET "http://localhost:8001/api/recommendations/activity/1" | jq .
echo ""

echo "=== Tests Complete ==="
```

Run with:
```bash
chmod +x test_api.sh
./test_api.sh
```

## Checklist

- [ ] Health endpoint responds
- [ ] Recommendations work with test user
- [ ] User profile retrieval works
- [ ] Activity details retrieval works
- [ ] Batch recommendations work
- [ ] Similarity scores are between 0-1
- [ ] Response times acceptable
- [ ] Error cases handled properly
- [ ] NestJS integration tested
- [ ] Database connection stable

## Common Issues

### "No module named 'fastapi'"
- Solution: Run `pip install -r requirements.txt`

### "Cannot connect to database"
- Solution: Check DATABASE_URL in .env, verify PostgreSQL is running

### "Port 8001 already in use"
- Solution: Kill process on port 8001 or change port in .env

### Empty recommendations
- Solution: Check if user has interests and activities exist with matching tags

## Next Steps

1. ✅ All tests passing
2. ✅ Ready for production deployment
3. Next: Monitor service in production
4. Next: Collect user feedback
5. Next: Optimize algorithm based on feedback
