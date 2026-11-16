import React from 'react'

export const FieldForm = ({
    formData,
    onChange,
    onSubmit,
    isSubmitting = false,
    error = '',
    onCancel,
    submitLabel = 'Save Field',
}) => {
    const handleChange = (e) => {
        const { name, value } = e.target
        onChange({ ...formData, [name]: value })
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-xs font-semibold text-[#344334] mb-1">
                    Field Name *
                </label>
                <input
                    type="text"
                    name="fieldName"
                    value={formData.fieldName || ''}
                    onChange={handleChange}
                    placeholder="e.g. North Plot / Sugarcane Field"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-[#344334] mb-1">
                    Location / Village *
                </label>
                <input
                    type="text"
                    name="fieldLocation"
                    value={formData.fieldLocation || ''}
                    onChange={handleChange}
                    placeholder="e.g. Nashik, Maharashtra"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-[#344334] mb-1">
                        Soil Type
                    </label>
                    <select
                        name="soilType"
                        value={formData.soilType || ''}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35] bg-white"
                    >
                        <option value="">Select soil type</option>
                        <option value="Black Soil">Black Soil</option>
                        <option value="Red Soil">Red Soil</option>
                        <option value="Alluvial Soil">Alluvial Soil</option>
                        <option value="Sandy Loam">Sandy Loam</option>
                        <option value="Clay Loam">Clay Loam</option>
                        <option value="Laterite Soil">Laterite Soil</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[#344334] mb-1">
                        Current Crop
                    </label>
                    <input
                        type="text"
                        name="currentCrop"
                        value={formData.currentCrop || ''}
                        onChange={handleChange}
                        placeholder="e.g. Wheat, Cotton, Rice"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm text-[#7A8475] hover:text-[#344334]"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[#174B35] text-white text-sm font-medium hover:bg-[#0f3424] transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    )
}

export default FieldForm
