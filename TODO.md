# 📋 FHASAL APPLICATION IMPROVEMENT ROADMAP & TODO

This document tracks the prioritized, step-by-step engineering roadmap to fix, complete, and enhance the Fhasal smart agriculture platform without rebuilding it from scratch.

> **Status:** Phase 0, Phase 1, Phase 2, and core Phase 3/4 tasks **COMPLETED & VERIFIED**.

---

## 🚦 Progress Dashboard

| Phase | Focus Area | Status | Verified |
|---|---|---|---|
| **Phase 0** | Baseline & Critical Blockers | ✅ Completed | Clean Git baseline, Node packages installed |
| **Phase 1** | Backend Core & Missing Endpoints | ✅ Completed | Routes, controllers, models, and mailer active |
| **Phase 2** | Restoring Broken & Incomplete Modules | ✅ Completed | Recommendations, Race conditions, Profile, Active Crops |
| **Phase 3** | Translation Engine & Scaffold Clean-Up | ✅ Completed | All 36 scaffold files completed, 7 languages active |
| **Phase 4** | UI/UX, Map Experience & Responsiveness | ✅ Completed | Satellite fallbacks, Location search, Responsive grid |
| **Phase 5** | Verification, Linting & Build Testing | ✅ Completed | 0 ESLint errors, Vite build successful |

---

## 📌 Phase 0: Critical Blockers & Syntax Fixes (Completed)

- [x] **Fix Syntax Error in `LanguageSelector.jsx`**
  - Path: `frontend/src/components/common/LanguageSelector.jsx`
  - Problem: Contained `"www"` on line 1 causing fatal JSX build crash.
  - Fix: Implemented clean reusable 7-language selector component with Lucide icon and `useSettings()`.
- [x] **Fix Hardcoded Axios API Base URL**
  - Path: `frontend/src/services/api.js`
  - Problem: `baseURL: 'http://localhost:5000/api'` hardcoded.
  - Fix: Configured `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'` with timeout and 401 token cleanup.
- [x] **Create Environment Variable Templates**
  - Created `backend/.env.example` documenting `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `EMAIL_*`.
  - Created `frontend/.env.example` documenting `VITE_API_URL`.
- [x] **Create Missing Public Assets**
  - Created `frontend/public/favicon.svg` matching the Fhasal brand mark to prevent 404 console errors.

---

## 📌 Phase 1: Backend Core, Missing Endpoints & Data Model (Completed)

- [x] **Add Missing Single-Field Endpoint (`GET /api/fields/:id`)**
  - Path: `backend/controllers/fieldController.js`, `backend/routes/fieldRoutes.js`
  - Added `getFieldById` controller method verifying field ownership (`owner: req.user._id`).
- [x] **Add User Profile Endpoints**
  - Path: `backend/controllers/authController.js`, `backend/routes/authRoutes.js`
  - Added:
    - `GET /api/auth/me` — returns authenticated user data.
    - `PUT /api/auth/profile` — allows updating name, phone, state, district, location, bio, preferredUnit, preferredLanguage.
    - `PUT /api/auth/change-password` — authenticated password change.
- [x] **Enhance `User` Model Schema**
  - Path: `backend/models/User.js`
  - Added optional fields: `location`, `district`, `state`, `bio`, `preferredLanguage`, `preferredUnit`.
- [x] **Enhance `Field` Model Schema**
  - Path: `backend/models/Field.js`
  - Added crop tracking fields: `currentCrop`, `sowingDate`, `cropStage`, `irrigationType`, `notes`.
  - Added `bigha` to `areaUnit` enum (`['acre', 'hectare', 'guntha', 'bigha']`).
- [x] **Consolidate & Fix Email System for Password Reset**
  - Unified nodemailer configuration in `backend/config/email.js` and `backend/utils/sendEmail.js` with SMTP/Gmail support and simulated dev fallback.
  - In `authController.js -> forgotPassword`: Send HTML email with password reset button; token no longer leaked in response.

---

## 📌 Phase 2: Restoring Broken & Incomplete Modules (Completed)

- [x] **Rebuild Crop Recommendations Page (`/recommendations`)**
  - Path: `frontend/src/pages/Recommendations/Recommendations.jsx`
  - Problem: Was an exact copy of `EditField.jsx` displaying "Field Not Found".
  - Fix: Completely rebuilt as a comprehensive agronomic recommendation advisory engine:
    1. Reads registered fields from `FieldContext`.
    2. Lets farmer select plot.
    3. Fetches live/forecast weather via Open-Meteo.
    4. Computes suitability scores for Indian crops (Rice, Wheat, Maize, Chickpea, Groundnut, Millets, Cotton, Mustard) using `src/utils/cropSuitability.js` and `src/services/recommendationService.js`.
    5. Displays categorized score cards (High / Moderate / Low suitability) with agronomic explanations and parameters.
- [x] **Fix Race Condition in `EditField.jsx` & `FieldDetails.jsx`**
  - Path: `frontend/src/pages/Fields/EditField.jsx` & `FieldDetails.jsx`
  - Added `getFieldById(id)` cache fallback to direct API query when page is directly reloaded or bookmarked.
  - Display loading state while `loading || fetchLoading` before showing "Field Not Found".
- [x] **Connect Profile Page to Backend**
  - Path: `frontend/src/pages/Profile/Profile.jsx`
  - Connected to `API.put('/auth/profile')` and `AuthContext` to update user state dynamically across the entire app.
- [x] **Fix Active Crops Tracking on Dashboard**
  - Path: `frontend/src/pages/Dashboard/Dashboard.jsx`
  - Dynamically computes active crops from registered fields with `currentCrop` set.
  - Linked "Crop Recommendations" and "Farm Conditions" cards to `/recommendations` and `/nasa-data`.
- [x] **Resolve Settings Architectural Conflict**
  - Merged multilingual features and `useSettings()` connectivity from `Setting.jsx` into `Settings.jsx`.
  - Replaced browser popups with toast notifications.
  - Kept clean re-export in `Setting.jsx` to prevent import breaks.
- [x] **Fix Satellite Imagery Zoom & Tile Errors**
  - Path: `frontend/src/pages/SatelliteImagery/SatelliteImagery.jsx`
  - Set default query date to 8 days ago to avoid 404 errors on today's ungenerated MODIS composites.
  - Added Esri World Imagery fallback base layer for high-resolution satellite detail down to zoom level 18.
- [x] **Add Satellite Imagery to Mobile Navigation**
  - Path: `frontend/src/components/navigation/MobileNavbar.jsx`
  - Added `/satellite-imagery` to the "More" drawer list.

---

## 📌 Phase 3: Translation Engine & Scaffold Clean-Up (Completed)

- [x] **Fix Translation Engine (`useTranslation.js`)**
  - Path: `frontend/src/context/hooks/useTranslation.js`
  - Changed `settings.language` to language code lookup via `getTranslation(code, key)`.
- [x] **Multi-Language Support Across 7 Languages**
  - Consolidated and verified translations across: English (`en`), Hindi (`hi`), Kannada (`kn`), Telugu (`te`), Tamil (`ta`), Marathi (`mr`), Bengali (`bn`).
- [x] **Complete All 36 Empty Scaffold Files**
  - Reusable UI Components:
    - `frontend/src/components/common/Button.jsx`
    - `frontend/src/components/common/Card.jsx`
    - `frontend/src/components/common/Loader.jsx`
    - `frontend/src/components/common/Modal.jsx`
    - `frontend/src/components/common/ProtectedRoute.jsx`
  - Core Services & Utilities:
    - `frontend/src/services/authService.js`
    - `frontend/src/services/farmService.js`
    - `frontend/src/services/nasaService.js`
    - `frontend/src/utils/calculations.js`
    - `frontend/src/utils/formatDate.js`
  - Context Re-exporters:
    - `frontend/src/context/FarmContext.jsx`
    - `frontend/src/context/AppContext.jsx`
    - `frontend/src/context/hooks/useAuth.js`
    - `frontend/src/context/hooks/useFarmData.js`
  - Dashboard & Field Widgets:
    - `frontend/src/components/dashboard/WeatherCard.jsx`
    - `frontend/src/components/dashboard/SoilHealthCard.jsx`
    - `frontend/src/components/dashboard/RainfallCard.jsx`
    - `frontend/src/components/dashboard/FarmOverview.jsx`
    - `frontend/src/components/fields/FieldCard.jsx`
    - `frontend/src/components/fields/FieldForm.jsx`
    - `frontend/src/components/fields/FieldMap.jsx`
  - Submodules & Onboarding:
    - `frontend/src/pages/NasaData/Weather.jsx`
    - `frontend/src/pages/NasaData/SoilMoisture.jsx`
    - `frontend/src/pages/NasaData/Rainfall.jsx`
    - `frontend/src/pages/Recommendations/CropSuitability.jsx`
    - `frontend/src/pages/Recommendations/RecommendationDetails.jsx`
    - `frontend/src/pages/RotationLab/WhatIfSimulator.jsx`
    - `frontend/src/pages/DigitalTwin/SimulationDetails.jsx`
    - `frontend/src/pages/Profile/EditProfile.jsx`
    - `frontend/src/pages/Profile/MyFarm.jsx`
    - `frontend/src/pages/Settings/LanguageSettings.jsx`
    - `frontend/src/pages/Settings/NotificationSettings.jsx`
    - `frontend/src/pages/Onboarding/Welcome.jsx`
    - `frontend/src/pages/Onboarding/FarmerPassword.jsx`
    - `frontend/src/pages/Onboarding/LocationSetup.jsx`
    - `frontend/src/pages/Onboarding/FarmSetup.jsx`
    - `frontend/src/layouts/AuthLayout.jsx`
    - `frontend/src/App.css`

---

## 📌 Phase 4: UI/UX, Map Experience & Responsiveness Polish (Completed)

- [x] **Add Location Search & Geocoding to `FieldBoundaryMap`**
  - Integrated Open-Meteo Geocoding to allow farmers to search for their village, taluka, or district and smoothly fly the map to their farm.
  - Added Satellite / Street map type toggle so farmers can clearly see field parcel boundaries.
- [x] **Dashboard Layout & Grid Optimization**
  - Updated 3-card overview grid to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` for clean responsive display on all screens.
- [x] **Enabled Bigha Area Unit Support**
  - Added conversion factor (2,500 m²) to `calculations.js`, `AddField.jsx`, `EditField.jsx`, and backend enum.

---

## 📌 Phase 5: Verification & Quality Assurance (Completed)

- [x] **Frontend Production Build:** `npm run build` completed with code 0 (`vite v8.3.8`).
- [x] **Frontend ESLint Check:** `npm run lint` completed with **0 errors**.
- [x] **Backend Syntax & Runtime Check:** `node -c` verified for all controllers, routes, and models with code 0.
- [x] **Automated Frontend Test Suite (`npm test`):** 18 test cases across 3 suites passing (calculations, 7-language translations, crop suitability).
- [x] **Automated Backend Test Suite (`npm test`):** 4 test cases passing (JWT auth cycle, tampered token rejection, bcrypt hashing, areaUnit enum).
- [x] **Backend Production Hardening:** Implemented 404 handler and centralized global error handler in `backend/server.js`.
- [x] **Landing Page Offline Asset Fallback:** Added resilient inline SVG data-URI fallback for agricultural media assets.
