import React from 'react'
import { Link } from 'react-router-dom'
import { Map, MapPin, ArrowRight, Sprout } from 'lucide-react'

export const FieldCard = ({
    field,
    areaUnit = 'Acre',
}) => {
    if (!field) return null

    const fieldId = field.id || field._id
    const fieldName = field.fieldName || field.name || 'Unnamed Field'
    const fieldLocation = field.fieldLocation || field.location || 'Location not specified'
    const fieldArea = field.fieldArea ?? field.area ?? 0
    const currentCrop = field.currentCrop || null

    return (
        <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#EAF4EE] text-[#174B35] flex items-center justify-center shrink-0">
                        <Map size={22} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-[#344334] text-base truncate group-hover:text-[#174B35] transition-colors">
                            {fieldName}
                        </h3>
                        <p className="text-xs text-[#7A8475] flex items-center gap-1 mt-0.5 truncate">
                            <MapPin size={12} className="shrink-0" />
                            {fieldLocation}
                        </p>
                    </div>
                </div>

                <Link
                    to={`/fields/${fieldId}`}
                    className="p-2 rounded-xl text-[#829187] hover:text-[#174B35] hover:bg-gray-50 transition-colors"
                    aria-label={`View ${fieldName}`}
                >
                    <ArrowRight size={18} />
                </Link>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E4E9DE] flex items-center justify-between">
                <div>
                    <span className="text-xs text-[#7A8475] block">Area</span>
                    <strong className="text-base font-semibold text-[#344334]">
                        {Number(fieldArea).toFixed(2)}{' '}
                        <span className="text-xs font-normal text-[#7A8475]">
                            {field.areaUnit || areaUnit}
                        </span>
                    </strong>
                </div>

                {currentCrop && (
                    <div className="text-right">
                        <span className="text-xs text-[#7A8475] block">Current Crop</span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#174B35] bg-[#EAF4EE] px-2 py-0.5 rounded-full">
                            <Sprout size={12} />
                            {currentCrop}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FieldCard
