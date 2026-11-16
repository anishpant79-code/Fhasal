import { useEffect, useState } from 'react'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Pencil,
    Save,
    X,
    Sprout,
    Shield,
    Calendar,
    CheckCircle2,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useSettings } from '../../context/SettingsContext'
import { getTranslation } from '../../utils/translations'
import API from '../../services/api'
import BackButton from '../../components/common/BackButton'

const Profile = () => {
    const { user, updateUser, refreshProfile } = useAuth()
    const { showToast } = useToast()
    const { settings } = useSettings()

    const languageCode = settings?.languageCode || 'en'
    const t = (key) => getTranslation(languageCode, key)

    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        district: '',
        state: '',
        bio: '',
    })

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                district: user.district || '',
                state: user.state || '',
                bio: user.bio || '',
            })
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        setError('')
    }

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                district: user.district || '',
                state: user.state || '',
                bio: user.bio || '',
            })
        }
        setIsEditing(false)
        setError('')
    }

    const handleSave = async (e) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            setError('Please enter your full name.')
            return
        }

        try {
            setIsSaving(true)
            setError('')

            const response = await API.put('/auth/profile', {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                location: formData.location.trim(),
                district: formData.district.trim(),
                state: formData.state.trim(),
                bio: formData.bio.trim(),
            })

            const updatedUser = response.data?.user
            if (updatedUser) {
                updateUser(updatedUser)
            } else {
                updateUser(formData)
            }

            showToast('Profile updated successfully!', 'success')
            setIsEditing(false)
            refreshProfile()
        } catch (err) {
            console.error('Failed to update profile:', err)
            setError(
                err.response?.data?.message ||
                'Unable to update profile. Please try again.'
            )
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-fhasal-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <BackButton />
                </div>

                {/* Profile Header */}
                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#E8F4EA] flex items-center justify-center text-[#347052] font-bold text-2xl sm:text-3xl shrink-0 shadow-inner">
                                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={36} />}
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-[#344334]">
                                    {user?.name || 'Farmer'}
                                </h1>
                                <p className="text-sm text-[#7A8475] mt-1 flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F4EA] text-[#347052]">
                                        <Sprout size={13} />
                                        Farmer Account
                                    </span>
                                    {user?.location && <span>• {user.location}</span>}
                                </p>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#347052] text-white text-sm font-medium hover:bg-[#285C42] transition shadow-sm"
                            >
                                <Pencil size={16} />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Profile Details Form */}
                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-6 sm:p-8 shadow-sm">
                    <form onSubmit={handleSave} className="space-y-6">

                        <div className="border-b border-[#E4E9DE] pb-4">
                            <h2 className="text-lg font-semibold text-[#344334]">
                                Personal & Farm Details
                            </h2>
                            <p className="text-xs text-[#7A8475] mt-1">
                                Keep your contact and farm location information current.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-semibold text-[#526252] uppercase tracking-wider mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        disabled={!isEditing || isSaving}
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none transition disabled:bg-gray-50 disabled:text-gray-600 focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10"
                                    />
                                </div>
                            </div>

                            {/* Email (Read-Only) */}
                            <div>
                                <label className="block text-xs font-semibold text-[#526252] uppercase tracking-wider mb-2">
                                    Email Address (Account Identifier)
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        disabled
                                        value={formData.email}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-semibold text-[#526252] uppercase tracking-wider mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        disabled={!isEditing || isSaving}
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none transition disabled:bg-gray-50 disabled:text-gray-600 focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10"
                                    />
                                </div>
                            </div>

                            {/* Village / Town */}
                            <div>
                                <label className="block text-xs font-semibold text-[#526252] uppercase tracking-wider mb-2">
                                    Village / Town
                                </label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="e.g. Shirwal"
                                        disabled={!isEditing || isSaving}
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none transition disabled:bg-gray-50 disabled:text-gray-600 focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10"
                                    />
                                </div>
                            </div>

                            {/* District */}
                            <div>
                                <label className="block text-xs font-semibold text-[#526252] uppercase tracking-wider mb-2">
                                    District
                                </label>
                                <input
                                    type="text"
                                    name="district"
                                    placeholder="e.g. Satara"
                                    disabled={!isEditing || isSaving}
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none transition disabled:bg-gray-50 disabled:text-gray-600 focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-xs font-semibold text-[#526252] uppercase tracking-wider mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="e.g. Maharashtra"
                                    disabled={!isEditing || isSaving}
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none transition disabled:bg-gray-50 disabled:text-gray-600 focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10"
                                />
                            </div>

                        </div>

                        {/* Bio / Farm Notes */}
                        <div>
                            <label className="block text-xs font-semibold text-[#526252] uppercase tracking-wider mb-2">
                                About Your Farm / Bio
                            </label>
                            <textarea
                                name="bio"
                                rows={3}
                                placeholder="Describe your primary crops, farming practices, or irrigation systems..."
                                disabled={!isEditing || isSaving}
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl border border-gray-200 text-sm outline-none transition disabled:bg-gray-50 disabled:text-gray-600 focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10"
                            />
                        </div>

                        {/* Form Action Buttons */}
                        {isEditing && (
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E4E9DE]">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#347052] text-white text-sm font-medium hover:bg-[#285C42] transition shadow-sm disabled:opacity-60"
                                >
                                    <Save size={16} />
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}

                    </form>
                </div>

                {/* Account Security Information Card */}
                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-6 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-[#344334]">
                                Account Security & Password
                            </h3>
                            <p className="text-xs text-[#7A8475] mt-0.5">
                                Your account is secured with encrypted JWT authentication.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Profile
