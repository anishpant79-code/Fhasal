# 📋 FHASAL APPLICATION IMPROVEMENT ROADMAP & TODO

This document outlines the prioritized, step-by-step engineering roadmap to fix, complete, and enhance the Fhasal agriculture platform without rebuilding it from scratch.

> **Status:** Pending User Approval. No code modifications will be executed until approved.

---

## 🚦 Priority Overview

| Phase | Focus Area | Impact | Complexity |
|---|---|---|---|
| **Phase 0** | Critical Blockers & Syntax Errors | 🔴 Highest (System Failure Prevention) | Low |
| **Phase 1** | Backend Core & Missing Endpoints | 🔴 High (Data Integrity & Auth) | Medium |
| **Phase 2** | Restoring Broken & Incomplete Modules | 🔴 High (Core User Value) | High |
| **Phase 3** | Translation Engine & Architectural Unification | 🟡 Medium (User Experience & Maintainability) | Medium |
| **Phase 4** | UI/UX, Map Enhancements & Mobile Optimization | 🟡 Medium (Polish & Accessibility) | Medium |
| **Phase 5** | Security, Caching, Resilience & Performance | 🟢 Low-Medium (Scalability & Production Hardening) | Medium |

---

## 📌 Phase 0: Critical Blockers & Syntax Fixes (Immediate)

- [ ] **Fix Syntax Error in `LanguageSelector.jsx`**
  - Path: `frontend/src/components/common/LanguageSelector.jsx`
  - Problem: Contains `"www"`.
  - Fix: Implement clean reusable language dropdown component or replace with proper export.
- [ ] **Fix Hardcoded Axios API Base URL**
  - Path: `frontend/src/services/api.js`
  - Problem: `baseURL: 'http://localhost:5000/api'` is hardcoded.
  - Fix: Use `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`.
- [ ] **Create Environment Variable Templates**
  - Create `backend/.env.example` documenting `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`.
  - Create `frontend/.env.example` documenting `VITE_API_URL`.
- [ ] **Create Missing Public Assets**
  - Create `frontend/public/favicon.svg` matching the Fhasal brand mark to prevent 404 console errors.

---

## 📌 Phase 1: Backend Core, Missing Endpoints & Data Model

- [ ] **Add Missing Single-Field Endpoint (`GET /api/fields/:id`)**
  - Path: `backend/controllers/fieldController.js`, `backend/routes/fieldRoutes.js`
  - Problem: Fetching or editing a field directly requires loading all fields.
  - Fix: Add `getFieldById` controller method verifying field ownership (`owner: req.user._id`).
- [ ] **Add User Profile Endpoints**
  - Path: `backend/controllers/authController.js`, `backend/routes/authRoutes.js`
  - Fix: Add:
    - `GET /api/auth/me` — returns authenticated user data.
    - `PUT /api/auth/profile` — allows updating name, phone, state, district, location, bio, preferredUnit, preferredLanguage.
    - `PUT /api/auth/change-password` — authenticated password change.
- [ ] **Enhance `User` Model Schema**
  - Path: `backend/models/User.js`
  - Add optional fields: `location`, `district`, `state`, `bio`, `preferredLanguage`, `preferredUnit`.
- [ ] **Enhance `Field` Model Schema**
  - Path: `backend/models/Field.js`
  - Add crop tracking fields:
    - `currentCrop`: String (e.g., Rice, Wheat, Chickpea)
    - `sowingDate`: Date
    - `cropStage`: String (e.g., Sowing, Vegetative, Flowering, Harvesting)
    - `irrigationType`: String (e.g., Drip, Sprinkler, Flood, Rainfed)
  - Align `areaUnit` enum with frontend inputs (`['acre', 'hectare', 'guntha', 'bigha']`).
- [ ] **Consolidate & Fix Email System for Password Reset**
  - Unify `backend/config/email.js` and `backend/utils/sendEmail.js` into one robust utility.
  - In `authController.js -> forgotPassword`: Send the actual reset email with styled HTML template.
  - Stop returning the reset token in JSON responses in development.

---

## 📌 Phase 2: Restoring Broken & Incomplete Modules

- [ ] **Rebuild Crop Recommendations Page (`/recommendations`)**
  - Path: `frontend/src/pages/Recommendations/Recommendations.jsx`
  - Problem: Currently a broken copy of `EditField.jsx`.
  - Fix: Re-implement as a proper Recommendations dashboard that:
    1. Reads registered fields from `FieldContext`.
    2. Lets farmer select a field.
    3. Fetches live/forecast weather via `fieldWeather.js`.
    4. Computes suitability scores for Indian crops (Rice, Wheat, Maize, Chickpea, Groundnut, Millets, Cotton, Mustard) using the existing engine in `src/utils/cropSuitability.js`.
    5. Displays categorized score cards (High / Moderate / Low suitability) with agronomic explanations.
- [ ] **Fix Race Condition in `EditField.jsx` & `FieldDetails.jsx`**
  - Problem: Direct navigation or page refresh causes "Field Not Found" error because context fields are empty while loading.
  - Fix: Respect `loading` state from `useFields()`; if field is not in context, fetch directly from backend (`GET /api/fields/:id`).
- [ ] **Connect Profile Page to Backend**
  - Path: `frontend/src/pages/Profile/Profile.jsx`
  - Problem: Disconnected; writes only to `localStorage`.
  - Fix: Load user from `AuthContext` / `GET /api/auth/me`, save changes to `PUT /api/auth/profile`, and sync `AuthContext`.
- [ ] **Fix Active Crops Tracking on Dashboard**
  - Path: `frontend/src/pages/Dashboard/Dashboard.jsx`
  - Problem: Permanently shows "0 - Crop tracking coming soon".
  - Fix: Compute active crops dynamically from registered fields that have a `currentCrop` set.
- [ ] **Resolve Settings Architectural Conflict**
  - Merge the superior multilingual features of `frontend/src/pages/Settings/Setting.jsx` into `Settings.jsx`.
  - Ensure language changes call `updateLanguage` and immediately update the UI.
  - Delete or reconcile the duplicate orphan file.
- [ ] **Fix Satellite Imagery Zoom & Tile Errors**
  - Path: `frontend/src/pages/SatelliteImagery/SatelliteImagery.jsx`
  - Problem: Level9 zoom limitation throws 404 on farm zoom; `today` date throws 404 for MODIS 8-day composite.
  - Fix: Set `maxZoom` appropriately, add fallback satellite basemap layer (e.g. Esri World Imagery or Sentinel-2 WMS), and offset MODIS query date by default by 8-10 days.
- [ ] **Add Satellite Imagery to Mobile Navigation**
  - Path: `frontend/src/components/navigation/MobileNavbar.jsx`
  - Add `/satellite-imagery` to the "More" drawer list.

---

## 📌 Phase 3: Translation Engine & Architecture Clean-Up

- [ ] **Fix Translation Engine (`useTranslation.js`)**
  - Path: `frontend/src/context/hooks/useTranslation.js`
  - Problem: Uses language name (`English`) instead of language code (`en`), breaking all lookups.
  - Fix: Use `settings.languageCode || 'en'` and query `translations[code]`.
- [ ] **Eliminate Redundant Inline Translations**
  - Consolidate translation strings from `Login.jsx`, `Signup.jsx`, `ResetPassword.jsx`, `Navbar.jsx`, `Sidebar.jsx`, and `MobileNavbar.jsx` into `src/utils/translations.js`.
  - Reduce duplicate code by over 1,500 lines across auth and navigation files.
- [ ] **Clean Up or Implement 39 Zero-Byte Files**
  - Remove truly obsolete scaffold stubs (`src/layouts/AuthLayout.jsx`, duplicate `src/components/common/ProtectedRoute.jsx`, unused Onboarding stubs).
  - Implement essential reusable common components:
    - `src/components/common/Loader.jsx` (accessible spinner & skeleton)
    - `src/components/common/Modal.jsx` (reusable accessible modal dialog)
    - `src/components/common/Card.jsx`
    - `src/components/common/Button.jsx`

---

## 📌 Phase 4: UI/UX, Map Experience & Responsiveness Polish

- [ ] **Add Location Search / Geocoding to `FieldBoundaryMap`**
  - Allow farmers to search for their village/district and auto-pan the map instead of manually panning across the India map.
- [ ] **Dashboard Layout Fix**
  - Fix 3-card overview grid on tablet breakpoint (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).
  - Link "Crop Recommendations" dashboard card directly to `/recommendations`.
  - Display actual weather conditions in "Farm Conditions" card if fields exist.
- [ ] **Landing Page Modernization**
  - Replace broken/external stock photo URLs with self-hosted SVGs or reliable assets.
  - Replace dummy contact placeholders (`YOUR_EMAIL@example.com`, `+910000000000`) with clean configured links or contact form.
  - Fix `<main>` semantic HTML hierarchy.
- [ ] **Crop Rotation Lab Enhancement**
  - Dynamically suggest rotations based on the selected field's soil type and current crop.
  - Translate all strings across 7 languages.

---

## 📌 Phase 5: Security, Performance & Production Readiness

- [ ] **Add API Rate Limiting**
  - Install `express-rate-limit` on `/api/auth/*` (prevent brute-force logins and email spamming).
- [ ] **Add Security Headers & Sanitization**
  - Install `helmet` and input validation on express endpoints.
- [ ] **Implement Server-Side Caching for Weather & NASA Data**
  - Cache NASA POWER 30-day aggregations (by rounded latitude/longitude and month) to reduce 8-second delays to <100ms.
- [ ] **Leaflet Bundle Optimization**
  - Code-split Leaflet and heavy pages via `React.lazy()` and `Suspense`.
- [ ] **Centralized Express Error Handler**
  - Add global error-handling middleware returning standardized `{ success: false, message: ... }` responses.

---

## 🚀 Execution Strategy & Next Steps

1. **Review:** User reviews [PROJECT_AUDIT.md](file:///c:/Users/anish/Downloads/Fhasal-Fhasal-v2/PROJECT_AUDIT.md) and this [TODO.md](file:///c:/Users/anish/Downloads/Fhasal-Fhasal-v2/TODO.md).
2. **Approval:** Upon user confirmation, implement changes starting with **Phase 0 & Phase 1**, followed by restoring the broken Recommendations module in **Phase 2**.
3. **Verification:** Test frontend build (`npm run build`), verify all routes, API endpoints, translations, and map interactions.
