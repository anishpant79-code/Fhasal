import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Save, X } from 'lucide-react'

export const EditProfile = ({ user, onSave, onCancel, isSaving = false }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        location: user?.location || '',
        district: user?.district || '',
        state: user?.state || '',
        bio: user?.bio || '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-[#344334] mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-[#344334] mb-1">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-[#344334] mb-1">
                        Village / Town
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-[#344334] mb-1">
                        District
                    </label>
                    <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-[#344334] mb-1">
                        State
                    </label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-[#344334] mb-1">
                    Bio / Farm Notes
                </label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                />
            </div>

            <div className="flex justify-end gap-3 pt-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm text-[#7A8475] hover:text-[#344334]"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-[#174B35] text-white text-sm font-medium hover:bg-[#0f3424] transition-colors disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </form>
    )
}

export default EditProfile
