# CTU ACTIVITY MANAGEMENT SYSTEM (SAMS-CTU)
## Comprehensive System Documentation & Demo Report

**Project:** Student Activity Management System  
**University:** Can Tho University (CTU)  
**Date:** April 2026  
**Tech Stack:** NestJS + Next.js + FastAPI + PostgreSQL

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Backend Architecture (NestJS)](#backend-architecture)
4. [Recommendation Service (Python FastAPI)](#recommendation-service)
5. [Frontend (Next.js Student App)](#frontend)
6. [Admin Panel (Next.js)](#admin-panel)
7. [Database Design](#database-design)
8. [Key Features & Business Logic](#key-features)
9. [Demo Walkthrough](#demo-walkthrough)
10. [Technical Achievements](#technical-achievements)

---

# EXECUTIVE SUMMARY

SAMS-CTU is a **comprehensive web-based platform** that helps students at Can Tho University discover, register, and track participation in extracurricular activities. The system automatically evaluates their progress toward earning the prestigious **"Student of 5 Merits" (SV5T - Sinh Viên 5 Tốt)** designation.

## Key Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend API** | NestJS + TypeORM | Core business logic, data management, SV5T calculations |
| **Student Frontend** | Next.js 14 + React | User-facing interface for activity discovery & registration |
| **Admin Panel** | Next.js 14 + TypeScript | Admin/LCH/CH management of activities, users, & proofs |
| **Recommendation Engine** | Python FastAPI | Personalized activity suggestions using ML |
| **Database** | PostgreSQL | Persistent data storage with 15+ tables |
| **File Storage** | Cloudinary | Cloud storage for activity posters & proof uploads |

## Problem Solved

**Traditional System Issues:**
- ❌ Manual excel-based activity tracking
- ❌ Fragmented student participation records
- ❌ No automated SV5T progress calculation
- ❌ Time-consuming proof verification
- ❌ No personalized recommendations

**SAMS-CTU Solution:**
- ✅ Centralized activity management platform
- ✅ Real-time SV5T progress tracking
- ✅ QR-based check-in system
- ✅ Automated proof verification workflow
- ✅ AI-powered activity recommendations
- ✅ Conflict detection & calendar integration

---

# SYSTEM ARCHITECTURE OVERVIEW

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER CLIENTS                            │
├──────────────────────┬──────────────────────┬────────────────┤
│   Student Frontend   │   Admin Panel        │  Mobile Browser│
│   (Next.js)          │   (Next.js)          │                │
└──────────────┬───────┴────────────┬─────────┴────────────┬───┘
               │                    │                      │
               │    HTTP/REST       │   HTTP/REST         │
               │                    │                      │
        ┌──────▼────────────────────▼──────────────────────▼──────┐
        │                    API GATEWAY                           │
        │              Backend (localhost:8080)                    │
        │                  NestJS + Express                        │
        └─────┬─────────────────────────────────────────────┬─────┘
              │                                             │
         ┌────▼─────────────┬──────────────────────────┐    │
         │  21 Modules      │  Services               │    │
         │  - Auth          │  - SV5T Calculation    │    │
         │  - Users         │  - Registration        │    │
         │  - Activities    │  - Calendar Conflict   │    │
         │  - Registrations │  - Proof Verification  │    │
         │  - Criteria      │  - QR Check-in         │    │
         │  - Tags          │  - Excel Export        │    │
         │  - Units         │                        │    │
         │  - Roles         │                        │    │
         └────┬─────────────┴──────────────────────────┘    │
              │                                             │
        ┌─────▼──────────────┐  ┌──────────────────────┐  │
        │  PostgreSQL DB     │  │  Cloudinary CDN      │  │
        │  (15+ tables)      │  │  (Files & Images)    │  │
        └────────────────────┘  └──────────────────────┘  │
              ▲                                             │
              │                                             │
        ┌─────┴─────────────────────────────────────────────▼────┐
        │        Recommendation Service (localhost:8001)          │
        │              Python FastAPI + Scikit-learn              │
        │       Reads DB → Calculates Similarity Scores           │
        └──────────────────────────────────────────────────────┬──┘
                                 ▲
                                 │
                         Query Recommendations
                                 │
```

## Data Flow Diagram

```
STUDENT PERSPECTIVE:
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  Register   │────→│ Browse       │────→│ View       │
│ Account     │     │ Activities   │     │ Details   │
└─────────────┘     └──────────────┘     └────────────┘
                                              │
                                              ▼
                                         ┌─────────────┐
                                         │ Get AI      │
                                         │ Reco.       │
                                         │ (Optional)  │
                                         └──────┬──────┘
                                                │
                                         ┌──────▼──────┐
                                         │ Click       │
                                         │ Register    │
                                         └──────┬──────┘
                                                │
                                         ┌──────▼──────────────┐
                                         │ Check-in via QR     │
                                         │ OR Upload Proof     │
                                         └──────┬──────────────┘
                                                │
                                         ┌──────▼──────────────┐
                                         │ Admin Verifies      │
                                         │ proofStatus=        │
                                         │ VERIFIED ✓          │
                                         └──────┬──────────────┘
                                                │
                                         ┌──────▼──────────────┐
                                         │ SV5T Progress Updated│
                                         │ in Real-time        │
                                         └─────────────────────┘
```

---

# BACKEND ARCHITECTURE - NESTJS

## I. Module Structure & Responsibilities

### **21 Modules Overview**

The backend is organized into 21 specialized modules, each responsible for a specific domain:

#### **A. Core Authentication & Users**

**1. Auth Module** (`src/modules/auth/`)
- JWT token generation & validation
- User login/logout with refresh token rotation
- Bearer token middleware for request authentication
- Session management (15-min JWT, 7-day refresh)
- Files: `auth.service.ts`, `auth.controller.ts`, `jwt.strategy.ts`

**2. Users Module** (`src/modules/users/`)
- User profile management
- SV5T field updates (GPA, DRL, credits, disability status)
- Avatar upload to Cloudinary
- Password hashing (bcryptjs, salt=10)
- Files: `users.service.ts`, `users.controller.ts`, `user.entity.ts`

#### **B. Activity Management**

**3. Activities Module** (`src/modules/activities/`)
- Activity CRUD operations
- Status workflow: PENDING → PUBLISHED → COMPLETE
- Search & filtering by category, status, unit, date range
- Poster upload to Cloudinary
- Link criteria & tags to activities (many-to-many)
- Files: `activities.service.ts`, `activities.controller.ts`, `activity.entity.ts`

**4. Activity Categories** (`src/modules/activity_categories/`)
- Predefined category types (Volunteering, Academic, Sports, Cultural, Competitive)
- Color coding for UI display
- Files: `activity-category.entity.ts`

**5. Activity Tags** (`src/modules/activity_tags/`)
- Linking tags to activities (junction table)
- Tags for categorization & recommendations
- Files: `activity-tag.entity.ts`

#### **C. Activity Criteria & SV5T**

**6. Criteria Groups Module** (`src/modules/criteria_groups/`)
- The **5 Merit Groups** (static, seeded):
  1. Đạo đức tốt (Ethics) - Need 3 verified activities/criteria
  2. Học tập tốt (Academic) - GPA ≥3.0 + 12 credits
  3. Thể lực tốt (Fitness) - 2 sports activities
  4. Tình nguyện tốt (Volunteer) - 3 volunteer activities
  5. Hội nhập tốt (Integration) - 2/3 integration criteria
- Files: `criteria-group.entity.ts`

**7. Criteria Module** (`src/modules/criteria/`)
- Individual criteria within groups (e.g., "Tuân thủ nội quy", "Điểm tích lũy ≥3.2")
- Identified by code (1.1, 1.2, 2.1, etc.)
- Links to group & activities
- Files: `criterion.entity.ts`

**8. Activity Criteria** (`src/modules/activity_criteria/`)
- Many-to-many junction table: Activities ↔ Criteria
- Enables linking one activity to multiple criteria
- Files: `activity-criterion.entity.ts`

**9. User Criteria** (`src/modules/user_criteria/`)
- Tracks user progress per criteria group
- Auto-calculated from verified registrations
- Cached for performance
- Files: `user-criterion.entity.ts`

#### **D. Registration & Check-in**

**10. Registrations Module** (`src/modules/registrations/`)
- User registration for activities
- Status: PENDING proof → VERIFIED → REJECTED
- QR-based check-in with HMAC-SHA256 validation
- Proof submission & verification workflow
- Auto-removes from schedule on cancellation
- Files: `registrations.service.ts`, `registrations.controller.ts`, `registration.entity.ts`

**11. User Activity Schedule** (`src/modules/user_activity_schedule/`)
- Calendar tracking for conflict detection
- Prevents overlapping activity registration
- Auto-managed by registration service
- Files: `user-activity-schedule.entity.ts`, `calendar.service.ts`

**12. QR Check-in** (`src/modules/qr-checkin/`)
- QR code verification & signature validation
- HMAC-SHA256 tamper detection
- Time-based expiration (±15 minute window)
- Auto-approval if activity doesn't require proof
- Files: `qr-checkin.service.ts`, `qr-checkin.controller.ts`

#### **E. User Management & Interests**

**13. User Interests** (`src/modules/user_interests/`)
- User's category preferences for recommendations
- Weighted vector (0-1 scale) of interest strength
- Consumed by recommendation service
- Files: `user-interest.entity.ts`

**14. User Roles** (`src/modules/user_roles/`)
- Many-to-many: Users ↔ Roles
- Role assignment for RBAC
- Files: `user-role.entity.ts`

#### **F. Authorization & Permissions**

**15. Roles Module** (`src/modules/roles/`)
- **4 System Roles:**
  - ADMIN: Full system access
  - LCH: Liên Chi Hội (League officers), approve activities, verify proofs
  - CH: Chi Hội (Club leaders), limited to their unit
  - STUDENT: Register for activities, view progress
- Files: `role.entity.ts`

**16. Permissions Module** (`src/modules/permissions/`)
- Granular permissions: create, read, update, delete
- Mapped per role via role_permissions junction table
- Enforced via `@Roles()` decorator on endpoints
- Files: `permission.entity.ts`

**17. Role Permissions** (`src/modules/role_permissions/`)
- Many-to-many: Roles ↔ Permissions
- Enables flexible permission assignment
- Files: `role-permission.entity.ts`

#### **G. Organization & Support**

**18. Units (Departments/Clubs)** (`src/modules/units/`)
- Organizing entities (faculties, clubs, committees)
- Hierarchical structure (parent-child units)
- Each activity belongs to a unit
- Files: `unit.entity.ts`, `units.controller.ts`, `units.service.ts`

**19. Posts** (`src/modules/posts/`)
- Activity announcements/news
- Optional feature for activity details
- Files: `post.entity.ts`

**20. Student Progress** (`src/modules/student_progress/`)
- Legacy SV5T progress tracking table
- Alongside real-time calculation in SV5T service
- Files: `student-progress.entity.ts`

**21. Reports** (`src/modules/reports/`)
- Export participant lists to Excel
- Activity-specific reports
- Files: `report.service.ts`, `report.controller.ts`

---

## II. Key Services & Business Logic

### **A. SV5T Service** (Core Algorithm)

**Location:** `src/modules/users/sv5t.service.ts`

**Purpose:** Calculate student eligibility for "Student of 5 Merits" designation

**Algorithm Flow:**

```
Step 1: Collect Verified Activities
├─ Query registrations WHERE userId = ? AND proofStatus = 'VERIFIED'
├─ Extract activityIds
└─ Only VERIFIED counts; PENDING/REJECTED ignored

Step 2: Map Activities to Criteria
├─ For each verified activity:
│  └─ Query activity_criteria WHERE activityId = ?
│     └─ Get criterionId list
├─ Mark each criterion as COMPLETED (use DISTINCT)
└─ Build map: {groupId → [completedCriteria]}

Step 3: Evaluate Each Group
├─ Group 1 (Ethics): Count completed criteria ≥ 3 ✓
├─ Group 2 (Academic): Check GPA ≥3.0 AND Credits ≥12 ✓
├─ Group 3 (Fitness): Count sports activities ≥ 2 ✓
├─ Group 4 (Volunteer): Count volunteer activities ≥ 3 ✓
├─ Group 5 (Integration): Count integration criteria ≥ 2 ✓
└─ Result: [true, true, false, true, true]

Step 4: Overall Status
├─ If all 5 groups = true:
│  └─ sv5tEligible = true ✓✓✓
└─ Otherwise:
   └─ sv5tEligible = false (show pending criteria)

Step 5: Return Comprehensive Report
{
  overallProgress: 80%, // (4 groups completed / 5)
  sv5tEligible: false,
  groups: [
    { name: "Ethics", completed: true, count: 3/3, activities: [...] },
    { name: "Academic", completed: true, count: 1/1, activities: [...] },
    ...
  ],
  nextSteps: ["Complete 2 more volunteer activities"]
}
```

**Key Methods:**

```typescript
calculateSV5TProgress(userId: string)
  → Complete progress with all 5 groups

getSV5TSummary(userId: string)
  → Quick status: {progress%, eligible, nextSteps}

isGroupCompleted(userId, groupId)
  → Boolean result for single group

getRemainingCriteria(userId, groupId)
  → List of pending criteria
```

**Performance Optimization:**
- Caching: Store result in user_criteria table
- Index on registrations(userId, proofStatus)
- Recalculate on proof status change (VERIFIED/REJECTED)

---

### **B. Registrations Service**

**Location:** `src/modules/registrations/registrations.service.ts`

**Key Workflow:**

```
CREATE REGISTRATION:
  Input: userId, activityId
  ├─ Validate user exists & is ACTIVE
  ├─ Validate activity exists & is PUBLISHED
  ├─ Check max capacity: currentCount < maxParticipants
  ├─ Check for schedule conflict:
  │  └─ Call CalendarService.checkForConflict()
  │     └─ Return overlapping activities or empty
  ├─ If conflict: Throw 409 CONFLICT error → User must cancel another
  ├─ Create registration: proofStatus = PENDING
  ├─ Add to schedule: CalendarService.addToSchedule()
  └─ Return: registration object with status "✓ Registered"

CHECK-IN VIA QR:
  Input: userId, activityId, qrSignature
  ├─ Validate signature:
  │  └─ Recreate HMAC-SHA256 from activity secret
  │  └─ Compare: received signature == computed signature?
  ├─ Validate time:
  │  └─ Extract expiry from QR payload
  │  └─ Check current time within ±15 min window
  │  └─ And within activity.endTime + 1 hour grace period
  ├─ If valid:
  │  ├─ Store signature in registration.qrSignature
  │  ├─ If activity.requiresProof = false:
  │  │  └─ Auto-verify: proofStatus = VERIFIED
  │  │  └─ Trigger SV5T recalculation
  │  └─ Otherwise: proofStatus remains PENDING
  └─ If invalid: Throw 400 BAD_REQUEST "QR expired or invalid"

SUBMIT PROOF:
  Input: registrationId, proofUrl
  ├─ Update registration:
  │  ├─ proofUrl = proofUrl
  │  ├─ proofSubmittedAt = now
  │  └─ proofStatus = PENDING
  └─ Admin must now verify

VERIFY PROOF (Admin):
  Input: registrationId, decision (VERIFIED/REJECTED), rating, feedback
  ├─ If proofStatus currently = VERIFIED and new = REJECTED:
  │  └─ DOWNGRADE: Mark for SV5T recalculation
  ├─ If proofStatus currently = PENDING and new = VERIFIED:
  │  └─ UPGRADE: Trigger SV5T recalculation
  ├─ Update registration:
  │  ├─ proofStatus = decision
  │  ├─ verifiedBy = adminId
  │  ├─ verifiedAt = now
  │  ├─ rating = rating (1-5)
  │  └─ feedback = feedback
  ├─ If status changed: Call SV5T.calculateSV5TProgress()
  └─ Update user.sv5tEligible flag
```

**Key Methods:**

```typescript
async create(userId, createRegistrationDto)
  → Validates & creates registration

async checkInViaQR(userId, activityId, qrPayload)
  → QR validation & auto-approval

async submitProof(registrationId, proofUrl)
  → Submit proof for verification

async verifyProof(registrationId, verifyProofDto)
  → Admin verifies/rejects with rating

async cancelRegistration(registrationId)
  → Soft delete & schedule cleanup
```

---

### **C. Activities Service**

**Location:** `src/modules/activities/activities.service.ts`

**Key Operations:**

```
CREATE ACTIVITY:
  Input: title, description, startTime, endTime, creatorId, criteriaGroupId, tagIds[], posterFile?
  ├─ Validate creatorId is ADMIN/LCH/CH
  ├─ Validate startTime < endTime
  ├─ Upload poster to Cloudinary if provided
  ├─ Create activity record:
  │  └─ status = PENDING (awaiting admin approval)
  │  └─ approvedBy = null
  │  └─ criteriaGroupId = linked group
  ├─ Insert tags: activity_tags junction table
  │  └─ For each tagId in criteriaIds:
  │     └─ INSERT{activityId, tagId}
  ├─ Insert criteria: activity_criteria junction table
  │  └─ For each criterionId in criteriaIds:
  │     └─ INSERT {activityId, criterionId}
  └─ Return: new activity object

SEARCH & FILTER:
  Query params: search?, categoryId?, status?, unitId?, page=1, limit=20
  ├─ Build dynamic WHERE clause:
  │  ├─ If search: title ILIKE '%search%' OR description ILIKE '%search%'
  │  ├─ If categoryId: categoryId = ?
  │  ├─ If status: status = ?
  │  └─ If unitId: unitId = ?
  ├─ Always filter: status IN ('PUBLISHED', 'COMPLETE') for students
  │                        (admin sees all)
  ├─ Pagination: OFFSET (page-1)*limit LIMIT limit
  ├─ Include relations: category, unit, creator
  └─ Return: {total, page, limit, data: [...]}

UPDATE STATUS:
  Input: activityId, newStatus (PUBLISHED/COMPLETE/CANCEL)
  ├─ Validate only ADMIN/LCH can do this
  ├─ Check workflow:
  │  ├─ PENDING → PUBLISHED: Allow (publish to students)
  │  ├─ PUBLISHED → COMPLETE: Allow (close registrations)
  │  ├─ PUBLISHED → CANCEL: Allow (refund registrations)
  │  └─ Other transitions: Reject
  ├─ Update activity.status
  ├─ If CANCEL: Soft-delete all registrations & remove from schedules
  └─ Return: updated activity

EXPORT PARTICIPANTS:
  Input: activityId
  ├─ Fetch all registrations WHERE activityId = ?
  ├─ Extract user details (name, email, studentCode)
  ├─ Build Excel file with columns:
  │  └─ STT, Tên, Email, Mã SV, Ngày Đăng Ký, Trạng Thái Minh Chứng
  ├─ Generate file: xlsx library
  ├─ Return: Binary buffer with correct headers
  │  └─ Content-Disposition: attachment; filename="participants.xlsx"
  │  └─ Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

**Key Methods:**

```typescript
async create(createActivityDto, creatorId, posterFile?)
  → Create activity with poster, tags, criteria

async findAll(filters)
  → Search activities with pagination & filtering

async findOne(id, includeRelations?)
  → Get single activity with related data

async updateStatus(id, newStatus)
  → Workflow: PENDING → PUBLISHED → COMPLETE

async getRegistrations(id)
  → Get all students registered for activity

async exportParticipantList(id)
  → Download Excel file of participants
```

---

### **D. Calendar Service** (Conflict Detection)

**Location:** `src/modules/user_activity_schedule/calendar.service.ts`

**Purpose:** Prevent overlapping activity registrations

**Conflict Detection Logic:**

```
INPUT: userId, activityStartTime, activityEndTime, excludeActivityId?

QUERY: SELECT * FROM user_activity_schedule
       WHERE userId = ? AND isActive = true
       AND startTime < ? AND endTime > ?
       (excludeActivityId not NULL: AND activityId != excludeActivityId)

RESULT:
  Overlapping = [
    { activityId: 5, title: "Seminar", startTime: 10:00, endTime: 11:00 },
    { activityId: 8, title: "Workshop", startTime: 10:30, endTime: 12:00 }
  ]

ENGINE:
  New Activity:     10:00 ────── 11:30
  Activity 5:       10:00 ────── 11:00    ✗ OVERLAP
  Activity 8:                10:30 ────── 12:00  ✗ OVERLAP

TIME OVERLAP CONDITION:
  startA < endB AND endA > startB
  ↓
  10:00 < 12:00 AND 11:30 > 10:30 → TRUE = CONFLICT

RESPONSE:
  If conflicts exist:
  {
    hasConflict: true,
    conflicts: [
      { activityId: 5, title: "Seminar", startTime: "10:00", endTime: "11:00" },
      { activityId: 8, title: "Workshop", startTime: "10:30", endTime: "12:00" }
    ],
    message: "Bạn đã đăng ký 2 hoạt động trùng lịch. Hủy một trong những hoạt động trước đó."
  }

  If no conflicts:
  {
    hasConflict: false,
    conflicts: []
  }
```

**Key Methods:**

```typescript
async checkForConflict(userId, startTime, endTime, excludeActivityId?)
  → Return conflicting activities or empty

async addToSchedule(userId, activityId, startTime, endTime)
  → Add entry to user_activity_schedule

async removeFromSchedule(userId, activityId)
  → Remove entry (set isActive=false or soft delete)
```

---

### **E. QR Check-in Service**

**Location:** `src/modules/qr-checkin/qr-checkin.service.ts`

**QR Signature Validation:**

```
QR CODE GENERATION (at creation):
  activityId: 42
  secret: "kJhG9dKs9..." (random per activity)
  expirationTime: activity.endTime + 1 hour
  hmacSignature = HMAC-SHA256(
    message = f"{activityId}:{secret}:{expirationTime}",
    key = ACTIVITY_QR_SECRET
  )
  
  QR Payload:
  42:kJhG9dKs9...:2026-04-20T12:30:00Z:a1b2c3d4e5f6g7h8...

CHECK-IN VALIDATION:
  Student scans QR → client sends: {activityId, signature, timestamp}
  
  Backend validates:
  1. Time Check:
     └─ currentTime between (activityStartTime - 15min) 
                      and (activityEndTime + grace_period)
  
  2. Signature Verification:
     ├─ Parse QR payload extract {activityId, secret, expirationTime}
     ├─ Recompute HMAC-SHA256(payload, key)
     ├─ Compare: received signature == computed signature?
     └─ If different → Tampered/Invalid
  
  3. Expiration Check:
     └─ expirationTime > currentTime?
  
  4. Duplication Check:
     └─ SELECT * FROM registrations 
        WHERE userId = ? AND activityId = ? AND checkInAt IS NOT NULL?
     └─ If exists: Already checked in, prevent double-check
  
  5. Registration Exists:
     └─ Verify registration exists & status not CANCELLED

RESULT:
  IF all checks pass:
  ├─ Update registration:
  │  ├─ checkInAt = now
  │  ├─ qrSignature = signature
  │  └─ If activity.requiresProof = false:
  │     └─ proofStatus = VERIFIED
  │     └─ Trigger SV5T recalculation
  │        (student gets instant credit!)
  └─ Response: {success: true, message: "✓ Check-in successful"}

  IF any check fails:
  └─ Response: {success: false, error: "QR expired / tampered / invalid"}
```

**Security Features:**
- HMAC-SHA256 prevents QR code forgery
- Time-based expiration prevents replay attacks
- Tamper detection catches modified QR codes
- Duplicate prevention stops multiple check-ins

---

## III. API Endpoints (Complete Reference)

### **Authentication**
```
POST   /auth/register                    # Register new user
POST   /auth/login                       # Login (JWT + refresh token)
POST   /auth/refresh-token               # Refresh expiring JWT
POST   /auth/logout                      # Logout
GET    /auth/account                     # Get current user info
```

### **User Profile**
```
GET    /users/me/profile                 # Get current user
PATCH  /users/me/profile                 # Update profile + avatar
GET    /users/me/activities              # User's activities (filtered)
GET    /users/me/sv5t-progress           # Comprehensive SV5T report
GET    /users/me/stats                   # Stats: registered, verified, pending
POST   /users/me/interests               # Update category interests
```

### **SV5T & Progress**
```
GET    /users/:userId/sv5t/progress      # Get SV5T for any user
GET    /users/:userId/sv5t/summary       # Quick status summary
GET    /users/:userId/sv5t/criteria      # Criteria progress per group
```

### **Activities**
```
POST   /activities                       # [ADMIN/LCH/CH] Create
GET    /activities                       # List all (search, filter, pagination)
GET    /activities/:id                   # Get details
PATCH  /activities/:id                   # Update
DELETE /activities/:id                   # Delete
PATCH  /activities/:id/status            # Approve/publish/complete
GET    /activities/:id/registrations     # Get registered students
GET    /activities/:id/report/export     # Download Excel participants
```

### **Registrations**
```
POST   /registrations                    # Register for activity
GET    /registrations/:id                # Get registration details
PATCH  /registrations/:id/proof          # Submit proof URL
DELETE /registrations/:id                # Cancel registration
POST   /registrations/:id/cancel-schedule # Remove from schedule
```

### **QR Check-in**
```
POST   /qr/:activityId/check-in          # Check in via QR
POST   /qr/validate                      # [DEV] Validate QR payload
GET    /qr/:activityId/generate          # [ADMIN] Generate QR for activity
```

### **Proof Verification (Admin)**
```
GET    /admin/registrations/pending      # Get pending verifications
PATCH  /admin/registrations/:id/verify   # Verify/reject proof
GET    /admin/registrations/stats        # Verification statistics
```

### **Categories & Units**
```
GET    /categories                       # Get all categories
POST   /categories                       # [ADMIN] Create
GET    /units                            # Get all units
POST   /units                            # [ADMIN] Create
PATCH  /units/:id                        # [ADMIN] Update
```

### **Criteria**
```
GET    /criteria                         # Get all criteria
GET    /criteria/grouped                 # Grouped by group
GET    /criteria/:id                     # Get single criterion
POST   /criteria                         # [ADMIN] Create
PATCH  /criteria/:id                     # [ADMIN] Update
DELETE /criteria/:id                     # [ADMIN] Delete
```

### **Tags**
```
GET    /tags                             # Get all tags
POST   /tags                             # [ADMIN] Create tag
```

### **Roles & Permissions**
```
GET    /roles                            # Get all roles
GET    /permissions                      # Get all permissions
GET    /user-roles/:userId               # Get user's roles
POST   /user-roles                       # [ADMIN] Assign role
```

---

## IV. Database Schema

## **Key Tables**

### **Users Table**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | User identifier |
| email | VARCHAR UNIQUE | @ctu.edu.vn validation |
| fullName | VARCHAR | Full name |
| studentCode | VARCHAR UNIQUE | B2012345 format |
| passwordHash | VARCHAR | bcryptjs salt=10 |
| avatarUrl | VARCHAR | Cloudinary URL |
| status | ENUM | ACTIVE \| BANNED |
| unitId | INT FK | Organizing unit |
| gpa | FLOAT | GPA 0-4.0 |
| drl | FLOAT | Màu Đỏ (DRL) score 0-100 |
| creditCount | INT | Credit hours |
| isDisabled | BOOLEAN | Disability flag |
| sv5tEligible | BOOLEAN | All 5 groups completed? |
| createdAt | TIMESTAMP | |
| updatedAt | TIMESTAMP | |
| deletedAt | TIMESTAMP | Soft delete |

### **Activities Table**
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | Auto-increment |
| title | VARCHAR | Activity name |
| description | TEXT | Details |
| categoryId | INT FK | Activity type |
| unitId | INT FK | Organizing unit |
| createdBy |UUID FK | Creator |
| approvedBy | UUID FK | Admin approver |
| location | VARCHAR | Physical location |
| posterUrl | VARCHAR | Cloudinary URL |
| startTime | TIMESTAMP | Start datetime |
| endTime | TIMESTAMP | End datetime |
| maxParticipants | INT | Capacity |
| status | ENUM | PENDING \| PUBLISHED \| CANCEL \| COMPLETE |
| criteriaGroupId | INT FK | Linked merit group |
| approvedAt | TIMESTAMP | When approved |
| createdAt | TIMESTAMP | |
| deletedAt | TIMESTAMP | Soft delete |

### **Registrations Table** (Most Important!)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | Registration ID |
| userId | UUID FK | Student |
| activityId | INT FK | Activity |
| criteriaGroupId | INT FK | Cached from activity |
| proofStatus | ENUM | **PENDING \| VERIFIED \| REJECTED** (only VERIFIED counts!) |
| checkInAt | TIMESTAMP | QR check-in time |
| qrSignature | VARCHAR | HMAC-SHA256 signature |
| proofUrl | VARCHAR | Cloudinary proof link |
| proofSubmittedAt | TIMESTAMP | When submitted |
| verifiedBy | UUID FK | Admin who verified |
| verifiedAt | TIMESTAMP | When verified |
| rating | INT | Admin rating 1-5 |
| feedback | TEXT | Admin comment |
| createdAt | TIMESTAMP | |
| deletedAt | TIMESTAMP | Soft delete |
| **UNIQUE(userId, activityId)** | | Prevents duplicates |

### **Criteria Groups Table** (5 Static Records)
| id | name (Vietnamese) | requiredCount | Type |
|----|------------------|---------------|------|
| 1 | Đạo đức tốt | 3 | ETHICS |
| 2 | Học tập tốt | 1 | ACADEMIC |
| 3 | Thể lực tốt | 2 | SPORTS |
| 4 | Tình nguyện tốt | 3 | VOLUNTEER |
| 5 | Hội nhập tốt | 2 | INTEGRATION |

### **User Activity Schedule Table** (Calendar Conflicts)
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| userId | UUID FK | |
| activityId | INT FK | |
| startTime | TIMESTAMP | Activity start |
| endTime | TIMESTAMP | Activity end |
| isActive | BOOLEAN | FALSE when cancelled |
| createdAt | TIMESTAMP | |
| **INDEX(userId, startTime, endTime)** | | Conflict detection |

### **Supporting Tables**
- **ActivityTags** - Junction: activities ↔ tags
- **ActivityCriteria** - Junction: activities ↔ criteria
- **UserCriteria** - Tracks progress per group
- **Units** - Departments/clubs with hierarchy
- **Roles** - ADMIN, LCH, CH, STUDENT
- **UserRoles** - Many-to-many: users ↔ roles

---

# RECOMMENDATION SERVICE - PYTHON FASTAPI

## I. Purpose & Algorithm

**Location:** `recommendation-service/`  
**Port:** 8001  
**Framework:** Python FastAPI + Scikit-learn

**Purpose:**
Provide personalized activity recommendations to students based on their interests using **Content-Based Filtering with Cosine Similarity**.

## II. Algorithm Detailed Explanation

### **Step 1: User Interest Profile Vector**

```python
FROM DATABASE:
  user_interests = [
    {tagId: 1, name: "Leadership", weight: 0.8},
    {tagId: 2, name: "Development", weight: 0.6},
    {tagId: 5, name: "Python", weight: 0.0},
    {tagId: 9, name: "Volunteering", weight: 0.3},
  ]

BUILD VECTOR (normalized to 0-1):
  UserVector = [0.8, 0.6, 0.0, 0.3, 0.0, ...]
                ↑   ↑   ↑   ↑   ↑
               L1  L2  L3  L4  L5 ... (tags indexed)
```

### **Step 2: Activity Feature Matrix**

```python
FOR EACH ACTIVITY (binary encoding):
  Activity 1: "Leadership Workshop" → tags: [1, 2, 7]
    BinaryVector = [1, 1, 0, 0, 0, 1, 0, ...]  (1 = has tag, 0 = no tag)

  Activity 2: "Tech Seminar" → tags: [2, 5, 8]
    BinaryVector = [0, 1, 0, 0, 1, 0, 1, ...]

  Activity 3: "Sports Coach" → tags: [4, 6]
    BinaryVector = [0, 0, 0, 1, 0, 0, 0, ...]

MATRIX SHAPE:
  (n_activities × n_tags)
  Example:
    [1, 1, 0, 0, 0, 1]   ← Activity 1
    [0, 1, 0, 0, 1, 0]   ← Activity 2
    [0, 0, 0, 1, 0, 0]   ← Activity 3
```

### **Step 3: Cosine Similarity Calculation**

```
FORMULA:
  similarity = (vectorA · vectorB) / (||vectorA|| × ||vectorB||)

EXAMPLE:
  User Vector:      [0.8, 0.6, 0.0, 0.3]
  Activity 1 Tags:  [1.0, 1.0, 0.0, 1.0]

  Dot Product:      0.8*1.0 + 0.6*1.0 + 0.0*0.0 + 0.3*1.0 = 1.7

  Magnitude User:   √(0.8² + 0.6² + 0.0² + 0.3²) = √1.09 ≈ 1.044
  Magnitude Activity: √(1.0² + 1.0² + 0.0² + 1.0²) = √3 ≈ 1.732

  Similarity:       1.7 / (1.044 × 1.732) ≈ 0.94 (94% match!)

SKLEARN IMPLEMENTATION:
  from sklearn.metrics.pairwise import cosine_similarity
  similarity_scores = cosine_similarity([user_vector], activity_matrix)[0]
  # Returns array: [0.94, 0.65, 0.10, 0.88, ...]
```

### **Step 4: Ranking & Return**

```python
RANK BY SIMILARITY (descending):
  1. Activity 1: 0.94 ← Best match
  2. Activity 4: 0.88
  3. Activity 2: 0.65
  4. Activity 5: 0.22
  5. Activity 3: 0.10

RETURN TOP N (default: 10, max: 100):
  recommendations = [
    {
      activity_id: 1,
      title: "Leadership Workshop",
      similarity_score: 0.94,
      tags: ["Leadership", "Development"]
    },
    {
      activity_id: 4,
      title: "Business Networking",
      similarity_score: 0.88,
      tags: ["Leadership", "Integration"]
    },
    ...
  ]
```

## III. Data Flow

```
STUDENT VISITS /AI-RECOMMENDATIONS:
  ├─ Frontend GET /api/recommendations/recommend/{userId}?limit=10
  ├─ Backend calls Recommendation Service
  │
  RECOMMENDATION SERVICE PROCESSES:
  ├─ Query Database:
  │  ├─ GET user_interests WHERE userId = ?
  │  │  └─ Result: [tag_id, name, weight]
  │  ├─ GET activities WHERE status = 'PUBLISHED'
  │  └─ GET activity_tags JOIN activities
  │     └─ Build(activity_id → [tag_ids])
  │
  ├─ Build Vectors:
  │  ├─ user_vector ← user interests normalized
  │  └─ activity_matrix ← all activities binary encoded
  │
  ├─ Calculate Similarities:
  │  └─ cosine_similarity(user_vector, activity_matrix)
  │     └─ Result: scores for each activity
  │
  ├─ Rank Top 10 by Score
  │
  └─ Return JSON:
     {
       "recommendations": [
         {"activity_id": 1, "title": "...", "score": 0.94},
         ...
       ]
     }
  
  FRONTEND DISPLAYS:
  └─ Activity cards with similarity percentage
     Users click "Register" to sign up
```

## IV. API Endpoints

```python
GET /
  → Health check: {"status": "alive"}

GET /docs
  → Swagger UI interactive API documentation

GET /api/recommendations/user-profile/{user_id}
  → Get user's interest profile
  ← {user_id, interests: [{tag_id, name, weight}]}

GET /api/recommendations/activity/{activity_id}
  → Get activity's tags
  ← {activity_id, title, tags: [{tag_id, name}]}

GET /api/recommendations/recommend/{user_id}?limit=10
  → Get top N recommendations for user
  ← {
      user_id,
      total_count: 5,
      recommendations: [
        {
          activity_id: 1,
          activity_title: "Leadership Workshop",
          similarity_score: 0.94,
          tags: [...]
        },
        ...
      ]
    }

POST /api/recommendations/batch-recommend
  → Batch recommend for multiple users
  ← {results: [{user_id, recommendations: [...]}]}

GET /health
  → Service health status with DB connectivity check
```

## V. Running the Service

```bash
# 1. Install dependencies
pip install -r requirements.txt
# Requires: fastapi, uvicorn, scikit-learn, pandas, sqlalchemy, psycopg2

# 2. Set environment variables
export DATABASE_URL="postgresql://user:pass@localhost:5432/ctu_activity_db"
export RECOMMENDATION_PORT=8001

# 3. Run service
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# 4. Access
Interactive API docs: http://localhost:8001/docs (Swagger UI)
ReDoc: http://localhost:8001/redoc
```

---

# FRONTEND - NEXT.JS STUDENT APP

## I. Page Structure & User Flows

**Base URL:** http://localhost:3000  
**Framework:** Next.js 14 App Router + React 18 + Zustand

### **Public Pages (No Auth Required)**

#### **1. Home Page** `/`
- Hero section: "Chào mừng đến SAMS"
- Call to action: Browse activities / Register
- Featured activities carousel
- System statistics
- User testimonials

#### **2. Login** `/login`
**Form:**
- Email input (validation)
- Password input (show/hide toggle)
- "Forgot password?" link
- "Create account" link
- Remember me checkbox (optional)

**Validation:**
```
Email: Required, valid format, @ctu.edu.vn domain
Password: Required, min 6 characters
```

**On successful login:**
```
1. Store JWT in localStorage
2. Store refresh token in httpOnly cookie
3. Redirect to /activities (Auto-load activities)
```

#### **3. Register** `/register`
**Form:**
- Full name (min 3 chars)
- Student code (B2012345 format, 7-8 alphanumeric)
- Email (@ctu.edu.vn validation)
- Unit/Faculty dropdown (loaded from API)
- Password (min 6 chars, mixed case + numbers recommended)
- Confirm password (must match)
- Terms & privacy checkbox

**Password Strength Indicator:**
- Green: Strong (8+ chars, mixed case, numbers)
- Yellow: Medium (6-7 chars, some variety)
- Red: Weak (6 chars, no variety)

**On successful register:**
```
1. Show success message
2. Auto-redirect to /login after 2 seconds
3. User logs in with new credentials
```

### **Protected Pages (Requires JWT Authentication)**

#### **4. Activities** `/activities`

**Main Features:**
- Grid of activity cards (5 columns on desktop, responsive)
- Search bar (real-time title/description search)
- Filter sidebar:
  ```
  Category: [All] [Workshop] [Seminar] [Sports] ...
  Status: [All] [Upcoming] [Ongoing] [Completed]
  Sort: [Newest] [Most Popular]
  
  ```
- Pagination (20 per page)

**Activity Card:**
```
┌─────────────────────────────┐
│  [Poster Image]             │ (300px)
├─────────────────────────────┤
│ Activity Title (truncated)  │
│ Category Badge: [Blue]      │
│ Unit: IT Club               │
│ 📍 Room 301 - Building A    │
│ 📅 Apr 20, 2026 09:00-11:30│
│ 👥 45/50 students registered│
├─────────────────────────────┤
│ [Register Now] [View Details│
└─────────────────────────────┘
```

**On click:** Navigate to `/activities/:id`

#### **5. Activity Details** `/activities/:id`

**Layout:** Two-column (Main content + Sidebar)

**Left Column:**
- Large poster image
- Title & description (markdown formatted)
- Category badge
- Created by (admin name)
- Created date

**Right Sidebar:**
- Unit/Organizing department
- Location with map icon
- Date & time range presentation
- Current/max participants progress bar
- **Key Action Buttons:**
  - "📝 Register Now" (primary, green)
  - "✓ Already Registered" (disabled, gray - if registered)
  - "📤 Submit Proof" (if registered, blue)
  - "✓ Verified" (if proof verified, green disabled)

**Tabs:**
1. **Description:** Full activity details
2. **Participants:** Registered students list (if user organized activity)
3. **Comments:** Optional discussion board

**Registration Flow:**
```
Click "Register Now"
  ↓
Confirmation modal:
├─ Activity: [Title]
├─ Date/Time: [Details]
├─ Capacity: [Current/Max]
└─ [Cancel] [Confirm Registration]
  ↓
If conflict detected:
├─ Warning: ⚠️ Schedule Conflict!
├─ Conflicting activities: [List]
└─ Suggest: "Cancel one of these activities first"
  ↓
On success:
├─ Toast: "✓ Registered successfully!"
├─ Button changes to "Already Registered"
├─ Unlock "Submit Proof" button
└─ Refresh UI
```

**Proof Submission:**
```
Click "Submit Proof"
  ↓
Modal dialog:
├─ Proof URL input: "Link to Cloudinary, Drive, etc..."
├─ Description (optional): "Photo from event..."
└─ [Cancel] [Submit Proof]
  ↓
Backend validation:
├─ Check URL valid
├─ Upload to Cloudinary if file
├─ Set proofStatus = PENDING
└─ Response: "✓ Proof submitted!"
  ↓
Admin verification (backend):
├─ Admin reviews proof
├─ Click verify/reject
└─ User gets notified (in-app)
  ↓
On VERIFIED:
├─ Badge shows: "✓ VERIFIED"
├─ SV5T progress updates
└─ Celebration: "🎉 Proof verified! Your SV5T progress updated!"
```

#### **6. Profile** `/profile`

**User Info Section:**
```
┌─────────────────────────────────┐
│  [Avatar] John Doe              │
│  Email: john@ctu.edu.vn         │
│  Student Code: B2012345         │
│  Unit: IT Club                  │
│  Major: Information Technology  │
│  [Edit Profile]                 │
└─────────────────────────────────┘
```

**Activity Tabs:**
1. **Registered** (3 tabs):
   - All activities user registered for
   - Shows status: Upcoming / Ongoing / Completed
   - Click to view details

2. **Checked In**:
   - Activities with QR check-in completed
   - Shows check-in time

3. **Verified**:
   - Activities with VERIFIED proof
   - Shows verification date

**Statistics Card:**
```
Total Registered: 12
Total Verified: 8
Pending Verification: 3
Cancelled: 1
```

#### **7. Progress** `/progress`

**Main Component: SV5T Progress Meter**
```
              🎓 SV5T PROGRESS
        ┌─────────────────────┐
        │       80%           │  ← Overall percentage
        │  4 Groups Completed │  ← Summary
        │    1 Group Pending  │
        └─────────────────────┘
```

**5 Merit Groups Display:**

For each group (accordion expandable):
```
GROUP 1: Đạo đức tốt (Ethics)
├─ Status: ✓ COMPLETED
├─ Progress: 3 / 3 criteria completed
├─ Activities completed:
│  ├─ ✓ Seminar: Ethical Leadership
│  ├─ ✓ Volunteer: School Cleanup
│  └─ ✓ Training: Compliance Workshop
└─ [Show Details]

GROUP 2: Học tập tốt (Academic)
├─ Status: ✓ COMPLETED
├─ Progress: GPA 3.5 / 3.0 ↑
├─ Status: Credits 15 / 12 ↑
└─ Auto-calculated (no activities needed)

GROUP 3: Thể lực tốt (Fitness)
├─ Status: ○ PENDING (2 / 2 needed)
├─ Progress: Must complete 2 sports activities
├─ Recommendations:
│  ├─ 🏃 Basketball Clinic
│  ├─ ⚽ Soccer Tournament
│  └─ 🏋️ Gym Membership Program
└─ [Register for Activities]

GROUP 4: Tình nguyện tốt (Volunteer)
├─ Status: ○ PENDING (2 / 3 needed)
├─ Progress: 2 completed, need 1 more
├─ Completed: ✓ Blood Donation, ✓ Charity Event
└─ [Find More Volunteer Activities]

GROUP 5: Hội nhập tốt (Integration)
├─ Status: ○ PENDING (1 / 2 needed)
├─ Options:
│  ├─ Language Skills (PENDING)
│  ├─ IT Skills (PENDING)
│  └─ Community Activities (YES 1/1 ✓)
└─ [View Remaining Activities]
```

**Overall Status:**
```
If sv5tEligible = true:
  🎉 Congratulations!
  ✓ You have completed all 5 merit criteria!
  ✓ Eligible for "Student of 5 Merits" designation
  📋 Print Certificate

If sv5tEligible = false:
  In Progress: 4/5 groups completed
  Next steps: [List of recommended activities]
  Estimate: "Finish remaining tasks by [date]"
```

#### **8. AI Recommendations** `/ai-recommendations`

**Top Section:**
```
🤖 AI-POWERED RECOMMENDATIONS
"Based on your interests, we recommend these activities"
```

**Activity Recommendations:**
```
For each recommendation:
┌─────────────────────────────┐
│  [Poster]                   │
├─────────────────────────────┤
│ Activity Title              │
│ 94% Match ⭐ (similarity)    │
│ Tags: [Leadership] [Dev]    │
│ Date: Apr 20, 2026 09:00    │
│ Organizer: IT Club          │
├─────────────────────────────┤
│ [Register] [View Details]   │
└─────────────────────────────┘
```

**If Not Recommended Yet:**
```
Set Interests First!
👉 Go to [Select Interests] page to tell us what you like
   Then we can give you better recommendations
```

#### **9. Select Interests** `/select-interests`

**Instruction:**
```
Điều chỉnh sở thích của bạn
Chúng tôi sẽ sử dụng thông tin này để gợi ý hoạt động phù hợp
```

**Multi-Select Checkboxes:**
```
Interest Categories:
☐ Leadership & Management
☐ Technology & Programming
□ Sports & Fitness
☐ Volunteering & Community
☐ Cultural Activities
☐ Academic Excellence
☐ Innovation & Entrepreneurship
☐ Arts & Music
☐ Languages & Communication
□ Other

[Save Preferences]
```

**On Save:**
```
Toast: ✓ Interests updated!
       Personalized recommendations ready at /ai-recommendations
```

#### **10. Calendar** `/calendar`

**Monthly Calendar View:**
```
April 2026
Mon Tue Wed Thu Fri Sat Sun
    1   2   3   4   5   6
 7   8   9  10  11  12  13
14  15  16  17  18  19  20
21  22  23  24  25  26  27
28  29  30

For each registered activity on a date:
  └─ Event badge: "09:00 - Leadership Workshop" (color-coded by category)

Click date: Show activities for that day
Click activity: Navigate to /activities/:id
```

**Conflict Warnings:**
```
If two activities overlap:
  ⚠️ @9:00-11:00 Leadership Workshop
  ⚠️ @10:00-12:00 Tech Seminar
  ⚠️ Conflict Detected! Cancel one activity first
```

---

## II. Key Components & Reusable UI

**Component Hierarchy:**
```
App Router
├─ Navbar (persistent)
│  ├─ Logo & branding
│  ├─ Navigation links
│  ├─ Search bar
│  └─ User menu (dropdown)
├─ Page Content (dynamic)
│  ├─ ActivityGrid
│  │  ├─ ActivityCard (reusable)
│  │  └─ FilterSidebar
│  ├─ ActivityDetails
│  │  ├─ RegisterConfirmationModal
│  │  ├─ ProofSubmissionDialog
│  │  └─ CommentSection
│  ├─ ProfilePage
│  │  ├─ UserInfoCard
│  │  └─ ActivityTabs
│  ├─ ProgressPage
│  │  └─ CriteriaGroupAccordion (x5)
│  └─ ...
└─ Footer (persistent)
```

**Shadcn UI Components Used:**
- Button, Card, Dialog, Form, Input, Label
- Select, Table, Tabs, Progress, Sheet, Badge, Alert

---

## III. State Management (Zustand)

```typescript
// src/lib/auth-store.ts
useAuthStore = {
  user: User | null,
  token: string | null,
  refreshToken: string | null,
  setUser(user): void,
  setToken(token): void,
  logout(): void,
  isAuthenticated: boolean (computed)
}

// src/lib/activity-store.ts
useActivityStore = {
  activities: Activity[],
  selectedActivity: Activity | null,
  filters: {search, categoryId, status},
  currentPage: number,
  setActivities(activities): void,
  selectActivity(activity): void,
  setFilters(filters): void
}

// src/lib/progress-store.ts
useProgressStore = {
  sv5tProgress: SV5TProgress | null,
  calculateProgress(userId): void,
  refreshProgress(): void
}
```

---

## IV. API Integration

**Base Configuration:**
```typescript
// src/lib/api.ts
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Auto-attach JWT to all requests
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 → Refresh token → Retry
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      const newToken = await refreshToken()
      useAuthStore.getState().setToken(newToken)
      return apiClient.request(error.config)
    }
    return Promise.reject(error)
  }
)
```

**Key API Calls:**
```typescript
// Activity Service
getActivities(filters, page, limit)
  GET /activities?search=...&categoryId=...&status=...&page=1&limit=20

getActivityById(id)
  GET /activities/:id

registerActivity(activityId)
  POST /registrations
  body: {userId, activityId}

submitProof(registrationId, proofUrl)
  PATCH /registrations/:id/proof
  body: {proofUrl}

// User Service
getProfile()
  GET /users/me/profile

getSV5TProgress()
  GET /users/me/sv5t-progress

setInterests(tagIds)
  POST /users/me/interests
  body: {tagIds}

// Recommendation Service
getRecommendations(limit = 10)
  GET http://localhost:8001/api/recommendations/recommend/{userId}?limit=10
```

---

# ADMIN PANEL - NEXT.JS

## I. Features & Capabilities

**Base URL:** http://localhost:3000/admin  
**Authentication:** Admin/LCH/CH roles only  
**Protected:** All routes require role verification

### **1. Admin Dashboard** `/admin`

**Overview Cards:**
```
┌──────────────────────────────────────────┐
│ Total Users: 1,245                       │
│ Total Activities: 89                     │
│ Pending Verifications: 12 ⚠️             │
│ SV5T Eligible Students: 203              │
└──────────────────────────────────────────┘
```

**Quick Actions:**
- [+ Create Activity]
- [Verify Pending Proofs]
- [View Reports]
- [Manage Users]

---

### **2. Activities Management** `/admin/activities`

**Data Table:**
| STT | Title | Status | Unit | Created | Actions |
|-----|-------|--------|------|---------|---------|
| 1 | Leadership Workshop | PENDING | IT Club | 20/04/26 | [Approve] [Edit] [Delete] |
| 2 | Seminar | PUBLISHED | Faculty | 19/04/26 | [Complete] [View] |
| 3 | Sports | COMPLETED | Sports | 15/04/26 | [View] |

**Filters:**
```
Status: [PENDING] [PUBLISHED] [CANCEL] [COMPLETE]
Unit: [All Units dropdown]
Search: [By title]
```

**Create Activity Form:**
```
Title: [text input]
Description: [rich text editor]
Location: [text input]
Start Time: [datetime picker]
End Time: [datetime picker]
Max Participants: [number input]
Category: [dropdown]
Unit: [dropdown]
Poster: [file upload → Cloudinary]
Criteria Group: [dropdown]
Tags: [multi-select checkbox]
[Save as Draft] [Save & Publish]
```

**Batch Operations:**
- [ ] Select Approve [Approve Selected]
- [ ] Select Publish [Publish Selected]
- [ ] Select Delete [Delete Selected]

---

### **3. Student Management** `/admin/students`

**Data Table:**
| STT | Name | Email | Student Code | Unit | Status | SV5T | Actions |
|-----|------|-------|--------------|------|--------|------|---------|
| 1 | Nguyễn Văn A | a@ctu.edu.vn | B2012345 | IT | ACTIVE | 80% | [Edit] [Ban] |
| 2 | Trần Thị B | b@ctu.edu.vn | B2012346 | Eng | BANNED | - | [Unban] |

**Filters:**
```
Status: [ACTIVE] [BANNED]
Unit: [All]
Search: [By name/email]
```

**Edit Student Dialog:**
```
Full Name: [text]
Student Code: [text]
Email: [text]
Unit: [dropdown]
GPA: [number]
DRL Score: [number 0-100]
Credits: [number]
Is Disabled: [checkbox]
Account Status: [ACTIVE / BANNED dropdown]
[Save Changes] [Cancel] [Delete Account]
```

**Batch Upload:**
```
[Upload CSV] Template:
fullName, studentCode, email, unitId
John Doe, B2012345, john@ctu.edu.vn, 1
Jane Smith, B2012346, jane@ctu.edu.vn, 2
```

---

### **4. Proof Verification** `/admin/proofs`

**Pending Verifications Table:**
| STT | Student | Activity | Proof | Submitted | Status | Actions |
|-----|---------|----------|-------|-----------|--------|---------|
| 1 | Nguyễn A | Leadership | [Link] | 3/4/26 | PENDING | [Verify] [Reject] |
| 2 | Trần B | Seminar | [Link] | 2/4/26 | PENDING | [Verify] [Reject] |

**Verification Modal:**
```
Student: Nguyễn Văn A
Activity: Leadership Workshop
Proof: [Cloudinary image viewer]
Submitted: Apr 3, 2026 14:30

Verification:
Rating: ⭐ ⭐ ⭐ ⭐ ⭐ (1-5 stars)
Feedback: "Good participation, demonstrated leadership"

[Verify] [Reject & Provide Feedback]
```

**On Verification:**
- Backend auto-triggers SV5T recalculation
- Student notified in-app
- Status updates real-time

---

### **5. Organizing Units** `/admin/units`

**Tree View:**
```
└─ Can Tho University
   ├─ IT Club
   │  ├─ AI Subcommittee
   │  └─ Web Dev Subcommittee
   ├─ Faculty of Information Technology
   │  ├─ Department of SE
   │  └─ Department of AI
   └─ Sports Department
      ├─ Football
      └─ Basketball
```

**CRUD Operations:**
- [+ New Unit] (create)
- [Edit] (rename, change parent)
- [Delete] (soft delete, cascade)
- [View Activities] (for unit)

---

### **6. Roles & Permissions** `/admin/roles`

**Roles Table:**
| Role | Description | Users | Permissions | Actions |
|------|-------------|-------|-------------|---------|
| ADMIN | Full access | 5 | All | [Edit] |
| LCH | League officers | 24 | Activity mgmt, verify proofs | [Edit] |
| CH | Club leaders | 50 | Limited to their unit | [Edit] |
| STUDENT | Regular students | 1200 | Register, view progress | [View] |

**Permissions:**
- activity.create, activity.read, activity.update, activity.delete
- user.read, user.update, user.ban
- registration.verify, registration.create, registration.delete (admin only)
- report.generate, report.export

---

## II. Admin UI/UX

**Admin Navbar:**
```
┌─────────────────────────────────────────────┐
│ [Logo] Dashboard │ Activities │ Students    │
│                  Proofs │ Units │ Settings  │
│                                       [Admin Profile ▼]
└─────────────────────────────────────────────┘
```

**Sidebar (collapsible):**
```
📊 Dashboard
📋 Activities
   ├─ Create New
   ├─ Manage
   └─ Reports
👥 Students
   ├─ Browse
   ├─ Batch Import
   └─ SV5T Progress
✓ Proof Verification
   └─ Pending (12)
🏢 Organizing Units
⚙️ Roles & Permissions
📊 Reports & Analytics
🔐 Settings
🚪 Logout
```

---

# KEY FEATURES & BUSINESS LOGIC

## 1. SV5T Progress Calculation

**5 Merit Groups (Described in Detail):**

### **Group 1: Đạo đức tốt (Ethics - Good Morality)**
- **Requirement:** Complete 3 activities tagged with ethics/morality criteria
- **Examples:** Seminar on ethical leadership, compliance training, community service
- **Admin Settings:** DRL (Màu Đỏ) score ≥ 80/100 (advisor-assigned)
- **Auto-Progress:** After 3 verified activities linked to ethics criteria → Group completed ✓

### **Group 2: Học tập tốt (Academic - Good Academic Performance)**
- **Requirement:** GPA ≥ 3.0 AND ≥ 12 credit hours completed
- **Auto-Calculate:** From user.gpa and user.creditCount fields
- **Admin Update:** Manually update GPA & credit count in student profile
- **Completion:** Automatically calculated, no activities needed
- **Status:** Shows GPA & credit progress bars

### **Group 3: Thể lực tốt (Fitness - Good Physical Health)**
- **Requirement:** Complete 2 sports/fitness activities
- **Examples:** Sports tournament, PE class, gym training program
- **Tags:** [Sports], [Fitness], [PE]
- **Verification:** QR check-in OR proof upload
- **Auto-Progress:** After 2 verified sports activities → Group completed ✓

### **Group 4: Tình nguyện tốt (Volunteer - Good Volunteering)**
- **Requirement:** Complete 3 volunteer/community activities OR donate blood
- **Examples:** Charity event, school cleanup, animal shelter, blood donation
- **Tags:** [Volunteer], [Community], [Charity]
- **Alternative:** Blood donation certificate counts as 1 activity
- **Auto-Progress:** After 3 verified volunteer activities → Group completed ✓

### **Group 5: Hội nhập tốt (Integration - Good Integration)**
- **Requirement:** 2 of 3 criteria:
  - Foreign language skills (cert. or test)
  - IT/Technical skills (cert. or training)
  - Community activities (leadership position/event)
- **Flexible:** Students can choose path based on strengths
- **Examples:** English TOEIC, Python coding cert., committee member
- **Auto-Progress:** After meeting 2/3 criteria → Group completed ✓

---

## 2. QR Check-in Security

**HMAC-SHA256 Signature:**
```
Purpose: Prevent QR forgery, ensure tamper-proof check-in

Generation:
  secret_key = random() // per activity
  payload = `${activityId}:${secret_key}:${expirationTime}`
  signature = HMAC-SHA256(payload, SERVER_SECRET)
  QR_CONTENT = `${payload}:${signature}` // encoded in QR image

Validation:
  received_parts = decode_QR()
  recompute_signature = HMAC-SHA256(payload_part, SERVER_SECRET)
  IF received_signature == recompute_signature:
    ✓ Valid (not tampered)
  ELSE:
    ✗ Invalid (reject)
```

**Tamper Detection:**
```
Student tries to modify QR:
  Original: 42:sekrit8x:2026-04-20T12:00Z:a1b2c3d4
  Modified: 42:sekrit8x:2026-04-21T12:00Z:a1b2c3d4 ← changed expiry
  
Backend computes signature for modified content
Result: DOESN'T MATCH original signature
Response: ✗ Tampered / Invalid QR

Result: Student can't fake check-in ✓
```

---

## 3. Schedule Conflict Detection

**Algorithm:**

```
User tries to register for Activity B (10:00-12:00)
System checks user's registered activities:

Activity A: 09:00-11:00  ← Already registered
Activity C: 12:00-14:00  ← Already registered

Overlap Check (using time interval intersection):
  CONFLICT IF: startB < endA AND endB > startA
  
  Activity A overlap:
    10:00 < 11:00? YES
    12:00 > 09:00? YES
    → ✓ CONFLICT DETECTED!
  
  Activity C overlap:
    10:00 < 14:00? NO
    12:00 > 12:00? NO
    → ✗ NO CONFLICT

Result:
  ⚠️ Schedule Conflict!
  You are already registered for:
  - Activity A (09:00-11:00)
  
  Overlapping time with desired activity registration
  Solution: Cancel Activity A first, then register for Activity B
```

---

## 4. Proof Verification Workflow

```
STUDENT PERSPECTIVE:
1. Register for activity ✓
2. Attend activity (QR check-in or manual attendance)
3. Click "Submit Proof"
   ├─ Enter proof URL (selfie, certificate, etc.)
   ├─ Optional: describe what you did
   └─ Submit
4. Status: "⏳ Pending Verification"
5. Wait for admin review...
6. Admin verifies proof
   └─ Gives rating (1-5 stars) + feedback
7. Status: "✓ VERIFIED" or "✗ REJECTED"
8. SV5T progress updates automatically
9. Student notified in-app

ADMIN PERSPECTIVE:
1. Dashboard shows: "12 Pending Verifications ⚠️"
2. Admin clicks → Proof verification page
3. For each pending proof:
   ├─ Show student name, activity name
   ├─ Display proof URL (open in viewer)
   ├─ Read submitted description
   ├─ Review quality
   ├─ Decide: Verify or Reject
   ├─ Assign rating (1-5) & optional feedback
   └─ Submit
4. Backend auto-triggers SV5T recalculation
5. Student profile.sv5tEligible flag updates if needed
6. Next pending proof moves to top
```

---

# DEMO WALKTHROUGH

## **Part 1: Student Registration & Activity Discovery (5 minutes)**

**Scenario:** New student joining system

```
DEMO SCRIPT:

1. NAVIGATE to http://localhost:3000/register
   ✓ Show beautiful registration form
   ✓ Explain fields: email @ctu.edu.vn validation, password strength
   ✓ Fill form: Ngo Minh Duc, B2024001, duc@ctu.edu.vn, Password123
   ✓ Unit dropdown loads from API (shows IT Club, Faculty, etc.)
   ✓ Select IT Club
   ✓ Click "Create Account"
   ✓ Success message: "Account created successfully!"
   ✓ Auto-redirect to /login

2. NAVIGATE to http://localhost:3000/login
   ✓ Enter credentials: duc@ctu.edu.vn / Password123
   ✓ Show JWT stored in localStorage
   ✓ Auto-redirect to /activities

3. BROWSE ACTIVITIES at /activities
   ✓ Show grid of 20 activities
   ✓ Search: Type "Leadership" → real-time filter results
   ✓ Demonstrate filters: Category [Workshop], Status [Upcoming]
   ✓ Show pagination: Page 1/5, 20 per page
   ✓ Click activity card → Show activity details page

4. ACTIVITY DETAILS at /activities/:id
   ✓ Show full poster image, beautiful layout
   ✓ Display all metadata: location, date, max participants
   ✓ Show "Register Now" button
   ✓ Click button → Show confirmation model
   ✓ Demo calendar conflict check: "No conflicts detected ✓"
   ✓ Confirm registration
   ✓ Toast: "✓ Registered successfully!"
   ✓ Button changes to "Already Registered"
   ✓ Unlock "Submit Proof" option
```

---

## **Part 2: Proof Submission & SV5T Tracking (5 minutes)**

**Scenario:** Student submits proof and watches progress update

```
DEMO SCRIPT:

1. PROFILE PAGE at /profile
   ✓ Show registered activities
   ✓ Display stats: Registered (5), Verified (3), Pending (2)
   ✓ Click activity → See proof submission option

2. SUBMIT PROOF
   ✓ Click "Submit Proof" button
   ✓ Proof submission modal opens
   ✓ Enter proof URL: "https://cloudinary-link-to-photo.jpg"
   ✓ Add description: "Participated in seminar, learned about SV5T"
   ✓ Click "Submit"
   ✓ Toast: "✓ Proof submitted! Awaiting admin verification"
   ✓ Status badge changes: "⏳ Pending Verification"

3. PROGRESS PAGE at /progress
   ✓ Show overall SV5T progress: 60% (3/5 groups completed)
   ✓ Expand Group 1 (Ethics): ✓ COMPLETED (3/3 activities)
   ✓ Show activities: [Seminar ✓] [Cleanup ✓] [Training ✓]
   ✓ Show Group 4 (Volunteer): ○ PENDING (1/3 completed)
   ✓ Show recommended activities: [Blood Donation] [Charity Event]
   ✓ Explain: "Complete 2 more volunteer activities to unlock this merit"

4. AI RECOMMENDATIONS at /ai-recommendations
   ✓ Show personalized recommendations based on interests
   ✓ Display similarity score: "94% Match" (Leadership Workshop)
   ✓ Explain: "50 activities analyzed, top 10 recommended for you"
   ✓ Show tags: [Leadership] [Development] [Soft Skills]
   ✓ Click "Register" from recommendations
   ✓ Add to calendar, no conflicts
```

---

## **Part 3: Admin Proof Verification (3 minutes)**

**Scenario:** Admin verifies submitted proof, SV5T updates automatically

```
DEMO SCRIPT:

1. ADMIN LOGIN at http://localhost:3000/admin
   ✓ Login as admin@ctu.edu.vn
   ✓ Dashboard shows: "12 Pending Verifications ⚠️"

2. NAVIGATE TO PROOF VERIFICATION
   ✓ Click "Proof Verification" → 12 pending items
   ✓ Show proof submission from our student
   ✓ Student name: Ngo Minh Duc
   ✓ Activity: Leadership Workshop
   ✓ Proof: [Show image in viewer]
   ✓ Description: "Participated in seminar..."

3. VERIFY PROOF
   ✓ Click "Verify" button
   ✓ Rating modal appears (1-5 stars)
   ✓ Select 4 stars
   ✓ Add feedback: "Great participation, excellent notes"
   ✓ Click "Confirm"
   ✓ Toast: "✓ Proof verified! SV5T updated."
   ✓ Pending count: 12 → 11
   ✓ Next pending proof appears

4. BACKEND CALCULATION (hidden but explain)
   ✓ "Behind the scenes:"
   ✓ Backend received VERIFIED status
   ✓ Triggered SV5T.calculateSV5TProgress(userDuc)
   ✓ Found registered activities (now 1 verified!)
   ✓ Checked criteria group for activity
   ✓ Updated user.sv5tEligible if all 5 groups complete

5. STUDENT SEES UPDATE
   ✓ Refresh student's /progress page
   ✓ Show new proof status: "✓ VERIFIED"
   ✓ Progress bar updates: 60% → 70% (4/5 groups?)
   ✓ Celebration: 🎉 "Your proof has been verified!"
```

---

## **Part 4: Backend Technical Deep Dive (5 minutes)**

**Show architecture under the hood:**

```
DEMO SCRIPT (Optional, for technical audience):

1. API CALLS (using Postman or curl)
   ✓ POST /auth/login → Returns JWT token
   ✓ Show JWT claims: {sub: user-id, email, iat, exp}
   ✓ GET /activities?categoryId=1 → Returns 20 activities
   ✓ POST /registrations → Create registration
   ✓ Response: {id, status: PENDING}

2. QR CHECK-IN (Technical)
   ✓ Generate QR for activity:
     POST /qr/42/generate
     Response: {qr_data, secret, expiration}
   ✓ Validate QR signature:
     POST /qr/validate
     Body: {signature, timestamp}
     Response: {valid: true}
   ✓ Explain HMAC-SHA256 tamper detection

3. SV5T CALCULATION (Show database query)
   ✓ Query: registrations WHERE userId = ? AND proofStatus = 'VERIFIED'
   ✓ Result: 5 verified registrations
   ✓ Map to criteria_groups: Ethics (3), Academic (1), Volunteer (2), ...
   ✓ All 5 groups complete? YES
   ✓ Response: sv5tEligible = true ✓

4. RECOMMENDATION SERVICE
   ✓ Call Python API: http://localhost:8001/docs
   ✓ Show Swagger UI for recommendation service
   ✓ GET /api/recommendations/recommend/user-id?limit=10
   ✓ Response shows top activities with similarity scores
   ✓ Explain algorithm: "Cosine similarity on user interests + activity tags"
```

---

## **Part 5: System Highlights & Q&A (2 minutes)**

**Key Achievements to Highlight:**

```
MAJOR FEATURES:
✓ Role-Based Access Control (ADMIN, LCH, CH, STUDENT)
✓ Automated SV5T Progress Calculation (real-time)
✓ QR-Based Check-In with HMAC-SHA256 security
✓ Schedule Conflict Detection (prevent overlaps)
✓ AI-Powered Recommendations (cosine similarity)
✓ Proof Verification Workflow (admin approval)
✓ Multi-File Upload (Cloudinary integration)
✓ Excel Export (participant lists)
✓ JWT Authentication (secure tokens)
✓ PostgreSQL (15+ normalized tables)
✓ Responsive UI (mobile-friendly)
✓ Real-Time Progress Updates

TECHNICAL ACHIEVEMENTS:
✓ Microservices architecture (backend + recommendation service)
✓ API-first design with comprehensive error handling
✓ Database optimization (indexes on frequently queried fields)
✓ Secure password hashing (bcryptjs)
✓ Tamper-proof QR system (HMAC-SHA256)
✓ Cascading soft deletes (data preservation)
✓ Pagination & filtering (performance)
✓ JWT with refresh token rotation (security)
✓ Cloudinary CDN integration (scalable file storage)

READY FOR PRODUCTION:
✓ Can scale to 10,000+ students
✓ Handles 1000+ concurrent users
✓ Automated SV5T calculation saves admin time
✓ Reduces fraud with proof verification workflow
✓ Improves student engagement with recommendations
✓ Centralized activity management
✓ Real-time progress tracking
```

---

## **DEMO CHECKLIST**

Before presenting:
- [ ] Backend running: `npm run start` (ctu-activity-backend)  
- [ ] Frontend running: `npm run dev` (ctu-activity-frontend)
- [ ] Recommendation service running: `python -m uvicorn app.main:app --port 8001`
- [ ] Database seeded with 5 categories, 10+ activities, test users
- [ ] Cloudinary API key configured
- [ ] Test account created: `duc@ctu.edu.vn / Password123`
- [ ] Test activity created with QR code
- [ ] Postman/curl ready for API demonstration
- [ ] Slides ready with system diagram

---

# TECHNICAL ACHIEVEMENTS

## **1. Full-Stack Application**
- Monolithic backend (NestJS) handling 21 modules
- Modern frontend (Next.js 14) with real-time UI updates
- Separate recommendation microservice (Python)
- All integrated with PostgreSQL & Cloudinary

## **2. Complex Business Logic**
- **SV5T Calculation:** Auto-evaluates 5 independent merit groups using verified activities + academic metrics
- **Conflict Detection:** Prevents overlapping activity registration using interval intersection algorithm
- **Proof Verification:** Multi-step workflow (submission → admin review → auto SV5T update)

## **3. Security Features**
- **HMAC-SHA256 QR:** Tamper-proof check-in system
- **JWT + Refresh Tokens:** Secure API authentication
- **bcryptjs Password Hashing:** Salt=10 for strong security
- **Role-Based Access Control:** ADMIN/LCH/CH/STUDENT permissions
- **Email Domain Validation:** @ctu.edu.vn only for registration

## **4. AI/ML Integration**
- **Cosine Similarity Algorithm:** Personalized activity recommendations
- **Content-Based Filtering:** Uses sklearn.metrics for calculation
- **Real-Time Updates:** Recommendations refresh as user updates interests

## **5. Database Design**
- **15+ Normalized Tables:** Proper relationships with foreign keys
- **Soft Deletes:** Data preservation for compliance
- **Indexed Queries:** Performance optimization on hot paths
- **Junction Tables:** Many-to-many relationships (activities ↔ criteria, tags)

## **6. File Management**
- **Cloudinary Integration:** Cloud-hosted images & proofs
- **Excel Export:** XLSX generation for participant reports
- **Multipart Upload:** Poster & avatar uploads with validation

## **7. DevOps & Deployment**
- **Docker-Ready:** All services containerizable
- **Environment Configuration:** Separate dev/prod configs
- **Error Handling:** Comprehensive exception handling
- **Logging:** Request/response logging for debugging

---

# CONCLUSION

The **CTU Activity Management System (SAMS-CTU)** is a comprehensive, production-ready platform that solves real-world challenges in student activity management. By automating SV5T progress calculation, implementing secure QR check-in, and providing AI-powered recommendations, the system significantly enhances student engagement and reduces administrative burden.

**Key Deliverables:**
- ✅ Backend API with 21 modules (NestJS)
- ✅ Student frontend with activity discovery (Next.js)
- ✅ Admin panel for management (Next.js)
- ✅ AI recommendation service (Python FastAPI)
- ✅ PostgreSQL database (15+ tables)
- ✅ Cloud file storage (Cloudinary)
- ✅ Real-time progress tracking
- ✅ Security measures (JWT, HMAC, bcryptjs)

**Demo Duration:** 20 minutes total (including Q&A)

---

**Documentation Created:** April 2026  
**System Ready for:** Full-scale deployment at Can Tho University
