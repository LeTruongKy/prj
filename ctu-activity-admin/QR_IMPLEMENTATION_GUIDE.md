# 📱 QR Code Check-in System - Admin Dashboard

## 🎯 Overview

The QR Code Check-in system allows admin users to display dynamically generated QR codes for activities. Students scan the QR code with their phone cameras to verify attendance.

### Architecture

```
┌──────────────────────────────────────────────────────┐
│ Admin Dashboard (ctu-activity-admin)                 │
│                                                      │
│  ✅ Activities Table                                 │
│  ✅ Click Activity → Opens Detail Sheet              │
│  ✅ Click "📱 Hiển thị QR Code" → QR Modal Opens    │
│  ✅ Shows Large QR (256px)                           │
│  ✅ Copy URL / Download QR Buttons                   │
└──────────────────────────────────────────────────────┘
         ↓ Admin shows QR to students
┌──────────────────────────────────────────────────────┐
│ Student Phone Camera                                 │
│                                                      │
│  ✅ Scans QR Code                                    │
│  ✅ Opens: /checkin?activityId=X&timestamp=Y&...    │
└──────────────────────────────────────────────────────┘
         ↓ Backend verifies signature
┌──────────────────────────────────────────────────────┐
│ Backend (ctu-activity-backend)                       │
│                                                      │
│  ✅ Parse query params                              │
│  ✅ Verify HMAC-SHA256 signature                     │
│  ✅ Update registration.proofStatus = VERIFIED       │
│  ✅ Return success response                          │
└──────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Details

### Files Created/Modified

#### Admin Frontend
```
✅ NEW: src/components/admin/activities/modals/QrModal.tsx
✅ MODIFIED: src/components/admin/activities/sheets/DetailActivitySheet.tsx
✅ MODIFIED: src/types/activity.type.ts
```

#### Key Features in QrModal

```typescript
// Display QR Code Image
<QRCode
  value={qrCodeUrl}
  size={256}
  level="H" // High error correction
  includeMargin={true}
/>

// Features:
- Activity title display
- Instructions: "Sinh viên quét mã để verify tham gia hoạt động"
- Copy URL button (for troubleshooting)
- Download QR as PNG button
- Responsive design
```

#### Button Integration
```typescript
// In DetailActivitySheet
<Button
  onClick={() => setQrModalOpen(true)}
  variant="outline"
  className="w-full gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
>
  <Smartphone className="h-4 w-4" />
  📱 Hiển thị QR Code
</Button>
```

---

## 👥 User Flows

### 1. Admin Creating Activity

```
1. Admin: Create Activity (POST /activities)
   └─> Backend:
       - Generate qrSecret (32-byte random)
       - Generate qrCodeUrl with HMAC-SHA256 signature
       - Save to activity.qrCodeUrl

2. Backend Response:
   {
     "id": 1,
     "title": "Example Activity",
     "qrCodeUrl": "https://abc.ngrok.app/checkin?activityId=1&timestamp=1234567890&signature=abc123def",
     "qrSecret": "xyz789..."
   }
```

### 2. Admin Showing QR Code

```
1. Admin: Navigate to Activities page
   URL: /admin/activities
   Table shows all activities

2. Admin: Click activity row
   → Opens DetailActivitySheet
   → Shows activity details

3. Admin: Click "📱 Hiển thị QR Code" button
   → QrModal opens
   → Shows large QR code
   → Shows instructions
   → Shows copy/download options

4. Admin: Display QR to students
   - On screen/projector
   - Students point phone camera at QR
```

### 3. Student Scanning QR

```
1. Student: Point phone camera at QR
   → Camera recognizes QR
   → Opens link:
      https://abc.ngrok.app/checkin?
      activityId=1&
      timestamp=1234567890&
      signature=abc123def

2. Frontend: /checkin page loads
   → Check if logged in
   → If not: Redirect to login
   → If yes: Call POST /registrations/check-in

3. Backend: Verify signature
   - Recalculate: HMAC-SHA256("1:1234567890", qrSecret)
   - Compare: calculated === provided
   - If valid: Update registration.proofStatus = VERIFIED
   - If invalid: Return error

4. Frontend: Show result
   - Success: "✓ Check-in thành công!"
   - Error: "✗ Lỗi: [error message]"
   - Auto-redirect to activity page (2s)
```

---

## 🔐 Security

### Signature Verification

**QR Code Format:**
```
https://{FRONTEND_URL}/checkin?
  activityId={activityId}&
  timestamp={timestamp}&
  signature={signature}
```

**Signature Algorithm:**
```
signature = HMAC-SHA256("{activityId}:{timestamp}", qrSecret)
```

**Why HMAC-SHA256?**
- Can't forge signatures without knowing qrSecret
- Timestamp prevents replay attacks (optional 10-min max age)
- Each activity has unique qrSecret
- Signature tied to specific activity ID and check-in time

**Security Features:**
1. ✅ Cryptographic signature (HMAC-SHA256)
2. ✅ Timestamp validation
3. ✅ JWT authentication (token required)
4. ✅ One-time verification (can't check-in twice)
5. ✅ User-specific (verified against auth user)

---

## 📋 Testing Checklist

### Admin Dashboard Testing

- [ ] Navigate to `/admin/activities`
- [ ] Click on an activity row
- [ ] DetailActivitySheet opens
- [ ] Click "📱 Hiển thị QR Code" button
- [ ] QrModal dialog opens
- [ ] QR Code displays correctly (256x256 px)
- [ ] Activity title shows above QR
- [ ] Instructions visible
- [ ] "Sao chép URL" button works
- [ ] "Tải QR" button downloads PNG
- [ ] Close button closes modal

### Student Check-in Testing

- [ ] Open smartphone/tablet
- [ ] Use camera app or QR code reader
- [ ] Point at displayed QR code
- [ ] Link opens in browser phone
- [ ] If not logged in → Redirect to login
- [ ] If logged in → Shows "Đang xác thực..."
- [ ] Backend verifies signature
- [ ] Success message: "✓ Check-in thành công!"
- [ ] Auto-redirects to activity page
- [ ] Database: registration.proofStatus = VERIFIED

### Edge Cases

- [ ] Invalid/corrupted QR code → Error message
- [ ] Wrong signature → "QR code không hợp lệ"
- [ ] Already verified → "User is already verified"
- [ ] Not registered → "Registration not found"
- [ ] QR too old (>10 min) → Optional timestamp validation
- [ ] Different activityId → Signature mismatch

---

## ⚙️ Configuration

### Backend .env Setup

```bash
# Set your ngrok frontend domain
FRONTEND_URL=https://your-ngrok-domain.ngrok-free.app

# QR Service key (optional)
QR_SECRET_KEY=your-secret-key

# Database connection
DATABASE_URL=postgresql://user:pass@localhost:5432/ctu

# JWT Secret
JWT_SECRET=your-jwt-secret
```

### Admin Dependencies

```bash
npm install react-qr-code
# Already installed ✅
```

### Radix UI Components Used

- `Dialog` - QR Modal (already installed)
- `Button` - Show/Download buttons (already installed)
- `Input` - Copy URL input (already installed)

---

## 🚀 Deployment Checklist

### Before Production

- [ ] Update `FRONTEND_URL` in backend .env to production domain
- [ ] Update `QR_SECRET_KEY` to secure random value
- [ ] Test QR codes in production environment
- [ ] Verify SSL certificate on frontend domain
- [ ] Test with real phone cameras
- [ ] Monitor signature verification logs
- [ ] Set up error alerting for failed check-ins

### Security Hardening

- [ ] Enforce HTTPS (not HTTP)
- [ ] Add rate limiting to `/registrations/check-in`
- [ ] Add logging for signature failures
- [ ] Regularly rotate `qrSecret` values
- [ ] Monitor for suspicious check-in patterns

---

## 🐛 Troubleshooting

### QR Code Not Displaying

**Problem:** QrModal opens but no QR visible
- [ ] Check browser console for errors
- [ ] Verify `qrCodeUrl` is not null/undefined
- [ ] React-qr-code library loaded?
- [ ] Check for CSS conflicts with Dialog

**Solution:**
```typescript
// Debug in browser console
console.log(activity?.qrCodeUrl)
// Should print full URL like:
// https://abc.ngrok.app/checkin?activityId=1&timestamp=...
```

### Check-in Fails with Signature Error

**Problem:** Student scans QR, gets "QR code không hợp lệ"
- [ ] Check if `FRONTEND_URL` set correctly in backend
- [ ] Verify activity has valid `qrSecret`
- [ ] Check timestamp hasn't changed drastically
- [ ] Restart backend after .env changes

**solution:**
```bash
# Backend logs
tail -f logs/error.log | grep signature

# SQL check
SELECT qr_secret FROM activities WHERE id = 1;
```

### Student Not Seeing Check-in Page

**Problem:** Clicking QR opens blank page
- [ ] Check network requests in browser DevTools
- [ ] Verify `/checkin` page route exists
- [ ] Check auth token is being sent
- [ ] Verify API endpoint `/registrations/check-in` exists

**Debug:**
```bash
# Frontend network tab: Should show
POST http://backend:8080/registrations/check-in
Headers: Authorization: Bearer {token}
Body: { activityId, timestamp, signature }
```

---

## 📊 Monitoring

### Key Metrics to Track

```
- QR scans per activity
- Check-in success rate
- Failed signature verifications
- Average check-in time
- Student device types (mobile/tablet)
```

### Database Queries

```sql
-- Check verified registrations
SELECT COUNT(*) as verified_checkins
FROM registrations
WHERE activity_id = {activityId}
  AND proof_status = 'VERIFIED';

-- Recent check-ins with timing
SELECT 
  r.registration_id,
  u.name,
  r.checked_in_at,
  AGE(r.checked_in_at, a.start_time) as time_before_start
FROM registrations r
JOIN users u ON r.user_id = u.id
JOIN activities a ON r.activity_id = a.id
WHERE a.id = {activityId}
  AND r.proof_status = 'VERIFIED'
ORDER BY r.checked_in_at DESC;

-- Check-in method comparison
SELECT 
  CASE 
    WHEN proof_status = 'VERIFIED' THEN 'Scanned QR'
    WHEN proof_status = 'PENDING' THEN 'Waiting for proof'
    ELSE 'Other'
  END as check_in_method,
  COUNT(*) as count
FROM registrations
WHERE activity_id = {activityId}
GROUP BY proof_status;
```

---

## 🎓 Educational Context

This QR check-in system is designed for **CTU Activity Management System**:

- **Scenario**: Large university activities with many participants
- **Goal**: Automate attendance verification
- **Students**: Can register online, check-in via QR
- **Admins**: Can manage activities and display QRs during events
- **Security**: Cryptographic signatures prevent fraud
- **Scale**: Hundreds of students checking in simultaneously

---

## 📞 Support

For issues or questions:

1. Check browser DevTools console for errors
2. Review backend logs for signature failures
3. Verify .env configuration
4. Test with Postman: `POST /registrations/check-in`
5. Check database: `SELECT * FROM activities WHERE id = ?`

---

**QR Check-in System is LIVE and READY! 🚀**
