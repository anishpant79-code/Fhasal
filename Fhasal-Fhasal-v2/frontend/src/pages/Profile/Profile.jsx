
import React, { useEffect, useState } from 'react'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Pencil,
    Save,
    X,
    Sprout,
    CheckCircle,
} from 'lucide-react'

const STORAGE_KEY = 'fhasal-profile'

const defaultProfile = {
    name: 'Farmer',
    email: '',
    phone: '',
    location: '',
    farmName: '',
    bio: '',
}

const Profile = () => {
    const [profile, setProfile] = useState(defaultProfile)
    const [formData, setFormData] = useState(defaultProfile)
    const [isEditing, setIsEditing] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem(STORAGE_KEY)

            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile)

                const updatedProfile = {
                    ...defaultProfile,
                    ...parsedProfile,
                }

                setProfile(updatedProfile)
                setFormData(updatedProfile)
            }
        } catch (error) {
            console.error('Could not load profile:', error)
        }
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))
    }

    const handleEdit = () => {
        setFormData(profile)
        setMessage('')
        setIsEditing(true)
    }

    const handleCancel = () => {
        setFormData(profile)
        setIsEditing(false)
        setMessage('')
    }

    const handleSave = (event) => {
        event.preventDefault()

        if (!formData.name.trim()) {
            setMessage('Please enter your name.')
            return
        }

        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            setMessage('Please enter a valid email address.')
            return
        }

        try {
            const updatedProfile = {
                ...formData,
                name: formData.name.trim(),
            }

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updatedProfile)
            )

            setProfile(updatedProfile)
            setFormData(updatedProfile)
            setIsEditing(false)
            setMessage('Profile updated successfully!')
        } catch (error) {
            console.error('Could not save profile:', error)
            setMessage('Could not save your profile. Please try again.')
        }
    }

    const initials = profile.name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'F'

    const fields = [
        {
            label: 'Full Name',
            name: 'name',
            icon: User,
            placeholder: 'Enter your full name',
        },
        {
            label: 'Email Address',
            name: 'email',
            icon: Mail,
            placeholder: 'Enter your email address',
            type: 'email',
        },
        {
            label: 'Phone Number',
            name: 'phone',
            icon: Phone,
            placeholder: 'Enter your phone number',
        },
        {
            label: 'Location',
            name: 'location',
            icon: MapPin,
            placeholder: 'Enter your village, district or state',
        },
        {
            label: 'Farm Name',
            name: 'farmName',
            icon: Sprout,
            placeholder: 'Enter your farm name',
        },
    ]

    return (
        <div className="min-h-screen bg-[#F7F9F6] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-7">
                    <h1 className="text-2xl font-bold text-[#174B35] sm:text-3xl">
                        My Profile
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage your personal and farming information.
                    </p>
                </div>

                {/* Profile Header Card */}
                <div className="mb-6 overflow-hidden rounded-2xl border border-[#E5EAE1] bg-white shadow-sm">
                    <div className="h-28 bg-gradient-to-r from-[#174B35] to-[#5C946F]" />

                    <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="-mt-12 flex items-end gap-4">
                            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#E7F0E8] text-3xl font-bold text-[#174B35] shadow-sm">
                                {initials}
                            </div>

                            <div className="pb-1">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {profile.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Fhasal Farmer
                                </p>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                type="button"
                                onClick={handleEdit}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#347052] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#285B41]"
                            >
                                <Pencil size={16} />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Success / Error Message */}
                {message && (
                    <div className={`mb-5 flex items-center gap-2 rounded-lg border p-3 text-sm ${
                        message.includes('successfully')
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}>
                        {message.includes('successfully') && (
                            <CheckCircle size={18} />
                        )}
                        {message}
                    </div>
                )}

                {/* Profile Information */}
                <form onSubmit={handleSave}>
                    <div className="rounded-2xl border border-[#E5EAE1] bg-white p-5 shadow-sm sm:p-7">

                        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Personal Information
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Your account and farming details.
                                </p>
                            </div>

                            <User className="text-[#347052]" size={22} />
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {fields.map((field) => {
                                const Icon = field.icon

                                return (
                                    <div key={field.name}>
                                        <label
                                            htmlFor={field.name}
                                            className="mb-2 block text-sm font-semibold text-gray-700"
                                        >
                                            {field.label}
                                        </label>

                                        <div className="relative">
                                            <Icon
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                id={field.name}
                                                name={field.name}
                                                type={field.type || 'text'}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder={field.placeholder}
                                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#347052] focus:ring-2 focus:ring-green-100 disabled:cursor-default disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Bio */}
                        <div className="mt-5">
                            <label
                                htmlFor="bio"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                About Your Farm
                            </label>

                            <textarea
                                id="bio"
                                name="bio"
                                rows={4}
                                value={formData.bio}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Tell us a little about your farming activities..."
                                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#347052] focus:ring-2 focus:ring-green-100 disabled:cursor-default disabled:bg-gray-50"
                            />
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                                >
                                    <X size={17} />
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#347052] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#285B41]"
                                >
                                    <Save size={17} />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </form>

                <p className="mt-5 text-center text-xs text-gray-400">
                    Profile information is currently saved locally on this device.
                </p>
            </div>
        </div>
    )
}

export default Profile
