
import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { FieldProvider } from './context/FieldContext'
import { ToastProvider } from './context/ToastContext'
import { SettingsProvider } from './context/SettingsContext'
import { NotificationProvider } from './context/NotificationContext'

// Layout and Authentication
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './pages/Auth/ProtectedRoute'

// Main Pages
import Landing from './pages/Landing/Landing'
import Dashboard from './pages/Dashboard/Dashboard'

// Authentication Pages
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'

// Field Management
import Fields from './pages/Fields/Fields'
import AddField from './pages/Fields/AddField'
import FieldDetails from './pages/Fields/FieldDetails'
import EditField from './pages/Fields/EditField'

// Farming Modules
import Recommendations from './pages/Recommendations/Recommendations'
import Rotation from './pages/RotationLab/Rotation'
import NasaData from './pages/NasaData/NasaData'
import DigitalTwin from './pages/DigitalTwin/DigitalTwin'
import Simulation from './pages/Simulation/Simulation'
import SatelliteImagery from './pages/SatelliteImagery/SatelliteImagery'

// Other Pages
import Notifications from './pages/Notifications/Notifications'
import Settings from './pages/Settings/Settings'
import Profile from './pages/Profile/Profile'
import NotFound from './pages/NotFound/NotFound'

const App = () => {
    return (
        <ToastProvider>
            <SettingsProvider>
                <AuthProvider>
                    <FieldProvider>
                        <NotificationProvider>
                            <Routes>

                                {/* Public Pages */}
                                <Route
                                    path="/"
                                    element={<Landing />}
                                />

                                {/* Authentication */}
                                <Route
                                    path="/login"
                                    element={<Login />}
                                />

                                <Route
                                    path="/signup"
                                    element={<Signup />}
                                />

                                <Route
                                    path="/forgot-password"
                                    element={<ForgotPassword />}
                                />

                                <Route
                                    path="/reset-password"
                                    element={<ResetPassword />}
                                />

                                {/* Protected Pages */}
                                <Route element={<ProtectedRoute />}>

                                    <Route
                                        path="/dashboard"
                                        element={
                                            <MainLayout>
                                                <Dashboard />
                                            </MainLayout>
                                        }
                                    />

                                    {/* Field Management */}
                                    <Route
                                        path="/fields"
                                        element={
                                            <MainLayout>
                                                <Fields />
                                            </MainLayout>
                                        }
                                    />

                                    <Route
                                        path="/fields/add"
                                        element={
                                            <MainLayout>
                                                <AddField />
                                            </MainLayout>
                                        }
                                    />

                                    <Route
                                        path="/fields/:id/edit"
                                        element={
                                            <MainLayout>
                                                <EditField />
                                            </MainLayout>
                                        }
                                    />

                                    <Route
                                        path="/fields/:id"
                                        element={
                                            <MainLayout>
                                                <FieldDetails />
                                            </MainLayout>
                                        }
                                    />

                                    {/* Farming Modules */}
                                    <Route
                                        path="/recommendations"
                                        element={
                                            <MainLayout>
                                                <Recommendations />
                                            </MainLayout>
                                        }
                                    />

                                    <Route
                                        path="/rotation-lab"
                                        element={
                                            <MainLayout>
                                                <Rotation />
                                            </MainLayout>
                                        }
                                    />

                                    <Route
                                        path="/nasa-data"
                                        element={
                                            <MainLayout>
                                                <NasaData />
                                            </MainLayout>
                                        }
                                    />

                                    <Route
                                        path="/digital-twin"
                                        element={
                                            <MainLayout>
                                                <DigitalTwin />
                                            </MainLayout>
                                        }
                                    />

                                    <Route
                                        path="/simulation"
                                        element={
                                            <MainLayout>
                                                <Simulation />
                                            </MainLayout>
                                        }
                                    />

                                    <Route
                                        path="/satellite-imagery"
                                        element={
                                            <MainLayout>
                                                <SatelliteImagery />
                                            </MainLayout>
                                        }
                                    />

                                    {/* Other Pages */}
                                    <Route
                                        path="/notifications"
                                        element={
                                            <MainLayout>
                                                <Notifications />
                                            </MainLayout>
                                        }
                                    />

                                    <Route
                                        path="/settings"
                                        element={
                                            <MainLayout>
                                                <Settings />
                                            </MainLayout>
                                        }
                                    />

                                    <Route
                                        path="/profile"
                                        element={
                                            <MainLayout>
                                                <Profile />
                                            </MainLayout>
                                        }
                                    />

                                </Route>

                                {/* 404 */}
                                <Route
                                    path="*"
                                    element={<NotFound />}
                                />

                            </Routes>
                        </NotificationProvider>
                    </FieldProvider>
                </AuthProvider>
            </SettingsProvider>
        </ToastProvider>
    )
}

export default App
