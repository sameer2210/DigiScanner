# BarcodeQA: Digital Barcode Scanner & Reward System

## Overview

BarcodeQA is a full-stack application for managing digital barcodes, user/admin/superadmin roles, barcode scanning, reward points, and PDF/CSV export. It consists of a React Native (Expo) frontend (`barcodeapp`) and a Node.js/Express/MongoDB backend (`barcodebackend`).


- Barcode generation (with random suffixes), scanning, and validation
- Reward system: earn and redeem points for rewards
- PDF and CSV export of barcodes
- Notifications for rewards and redemptions
- Admin and superadmin dashboards
- Secure authentication (JWT)

---

## File & Folder Structure

```
BarcodeQA-main/
├── DocBarcodeBlnk.txt                # Documentation or template file
├── README.md                         # Project documentation (this file)
├── barcodeapp/                       # React Native (Expo) frontend
│   ├── app.config.js                 # Expo app config
│   ├── App.js                        # App entry point
│   ├── appfake.js                    # (Possibly test/mock app)
│   ├── eas.json                      # Expo Application Services config
│   ├── index.js                      # Entry for Expo
│   ├── metro.config.js               # Metro bundler config
│   ├── package.json                  # Frontend dependencies/scripts
│   ├── withCleartextTraffic.js       # Android network config
│   ├── assets/                       # App images/icons
│   └── src/
│       ├── AuthContext.js            # Auth context provider
│       ├── ThemeContext.js           # Theme (dark/light) context
│       ├── components/
│       │   ├── CustomPicker.js       # Custom picker component
│       │   └── ThemeToggle.js        # Theme toggle switch
│       └── screens/
│           ├── AdminDashboard.js     # Admin dashboard UI/logic
│           ├── BarcodeGenerator.js   # Barcode PDF generator UI
│           ├── HomeScreen.js         # Landing screen, role selection
│           ├── LoginScreen.js        # Login form
│           ├── RegisterScreen.js     # Registration form
│           ├── superadmin4y10pdf.js  # (Possibly legacy or test)
│           ├── SuperAdminDashboard web pdf genrate.js # (Legacy/test)
│           ├── SuperAdminDashboard.js# Superadmin dashboard UI/logic
│           └── UserDashboard.js      # User dashboard (scan, rewards)
├── barcodebackend/                   # Node.js/Express backend
│   ├── package.json                  # Backend dependencies/scripts
│   ├── server.js                     # Main server file (all routes)
│   ├── middleware/
│   │   ├── auth.js                   # Auth middleware (JWT, allow-all for now)
│   │   └── role.js                   # (Placeholder for role-based middleware)
│   ├── models/
│   │   ├── Barcode.js                # Barcode schema (scanned & pre-generated)
│   │   ├── BarcodeRanges.js          # Barcode range schema
│   │   ├── GeneratedBarcode.js       # Pre-generated barcode schema
│   │   ├── Notification.js           # Notification schema
│   │   ├── Reward.js                 # Reward schema
│   │   └── User.js                   # User schema (roles, points, etc)
│   └── routes/
│       ├── auth.js                   # (Empty, logic in server.js)
│       └── generatedBarcodes.js      # Barcode generation routes
```

---

## Backend API Routes

### Auth & User

- `POST   /register` Register user/admin (admin approval required)
- `POST   /login` Login (returns JWT)
- `GET    /users` List users (admin/superadmin)
- `GET    /users/:id` Get user details
- `PUT    /users/:id/status` Approve/disapprove user
- `PUT    /users/:id` Update user details
- `DELETE /users/:id` Delete user
- `PUT    /users/:id/reset-points` Reset user points

### Admin Management (superadmin only)

- `GET    /admins` List admins
- `GET    /admins/pending` List pending admins
- `PUT    /admins/:id/status` Approve/disapprove admin
- `PUT    /admins/:id/user-limit` Set admin's user limit
- `GET    /admins/:id/password` Get admin's plain password

### Barcode Management

- `POST   /barcodes` User scans barcode
- `GET    /barcodes` List all barcodes (admin/superadmin)
- `GET    /barcodes/user/:userId` Get barcodes for a user
- `DELETE /barcodes/:id` Delete a barcode
- `DELETE /barcodes` Delete all barcodes (admin/superadmin)
- `GET    /export-barcodes` Export barcodes as CSV

### Barcode Ranges & Generation

- `GET    /barcode-ranges` List barcode ranges (admin/superadmin)
- `POST   /barcode-ranges` Create barcode range
- `PUT    /barcode-ranges/:id` Update barcode range
- `DELETE /barcode-ranges/:id` Delete barcode range
- `GET    /pregenerated-barcodes/:rangeId` Get pre-generated barcodes (superadmin)
- `POST   /generate-barcode-pdf` Generate barcode PDF (superadmin)

### Rewards & Redemptions

- `POST   /rewards` Create reward (admin/superadmin)
- `GET    /rewards` List rewards
- `PUT    /rewards/:id` Update reward
- `DELETE /rewards/:id` Delete reward
- `POST   /redemptions` User requests reward redemption
- `PUT    /redemptions/:id` Approve/reject redemption (admin/superadmin)
- `GET    /redemptions` List reward redemptions
- `DELETE /redemptions/:id` Delete redemption (user)

### Notifications

- `GET    /notifications` List notifications
- `PUT    /notifications/:id/read` Mark as read
- `DELETE /notifications/:id` Delete notification

### Settings

- `GET    /settings/points-per-scan` Get points per scan
- `PUT    /settings/points-per-scan` Set points per scan (admin/superadmin)
- `GET    /settings/barcode-range` Get barcode range
- `PUT    /settings/barcode-range` Set barcode range (admin/superadmin)

### PDF Generation

- `POST   /generate-pdf` Generate barcode PDF (user/admin)

---

## Workflow & Data Flow

1. **Registration & Approval**
   - Users and admins register. Admins must be approved by superadmin. Users must be approved by their admin.
2. **Login**
   - All roles log in and receive JWT for API access.
3. **Barcode Generation**
   - Admins/superadmins create barcode ranges. Barcodes are pre-generated with random suffixes and stored.
   - Users scan barcodes via the app. Backend validates, awards points, and notifies for rewards.
4. **Rewards**
   - Admins/superadmins create rewards. Users redeem rewards with points. Redemptions require admin approval.
5. **Notifications**
   - System sends notifications for reward achievements and redemption requests/approvals.
6. **PDF/CSV Export**
   - Barcodes can be exported as PDF (for printing) or CSV (for reporting).

---

## Technologies Used

- **Frontend:** React Native (Expo), React Navigation, Paper UI, AsyncStorage
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, PDFKit, bwip-js, json2csv
- **Other:** Expo Camera/Barcode Scanner, Toast notifications, FileSystem, Sharing

---

## How to Run

1. **Backend:**
   - `cd barcodebackend`
   - `npm install`
   - `node server.js`
2. **Frontend:**
   - `cd barcodeapp`
   - `npm install`
   - `npm start` (or `expo start`)

---

# MONGODB_URI=mongodb://localhost:27017/barcode
JWT_SECRET=your-secret-key
# FRONTEND_URL=http://localhost:8081
PORT=5000

## Notes

- The backend contains all main API logic in `server.js` (routes, models, controllers).
- The `auth.js` and `role.js` middleware are placeholders; main logic is in `server.js`.
- The frontend is modularized by screens and components for each role and feature.
- Environment variables (MongoDB URI, JWT secret) should be set in `.env` for production.

---

## Author & License

- Author: [Your Name/Team]
- License: ISC (see `barcodebackend/package.json`)
