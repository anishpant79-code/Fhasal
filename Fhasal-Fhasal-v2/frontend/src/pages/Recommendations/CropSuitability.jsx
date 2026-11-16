import React from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Droplets, Thermometer, Layers } from 'lucide-react'

export const CropSuitability = ({
    crop,
    soilType = 'Black Soil',
    weather = null,
}) => {
    if (!crop) return null

    const score = crop.score ?? 75
    const scoreColor =
        score >= 80 ? 'text-emerald-700 bg-emerald-50' : score >= 60 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'

    return (
        <div className="bg-white rounded-2xl border border-[#E4E9DE] p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-[#344334]">{crop.cropName}</h3>
                    <p className="text-sm text-[#7A8475]">{crop.scientificName || crop.family || 'Agri Crop'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${scoreColor}`}>
                    {score}% Suitable
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs text-[#7A8475] mb-1">
                        <Layers size={14} className="text-[#174B35]" />
                        <span>Soil Compatibility</span>
                    </div>
                    <span className="text-sm font-semibold text-[#344334]">
                        {crop.soilMatch ? 'High Match' : 'Moderate'}
                    </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs text-[#7A8475] mb-1">
                        <Thermometer size={14} className="text-amber-600" />
                        <span>Optimal Temp</span>
                    </div>
                    <span className="text-sm font-semibold text-[#344334]">
                        {crop.tempMin ?? 18}° - {crop.tempMax ?? 32}°C
                    </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs text-[#7A8475] mb-1">
                        <Droplets size={14} className="text-blue-600" />
                        <span>Water Requirement</span>
                    </div>
                    <span className="text-sm font-semibold text-[#344334]">
                        {crop.waterRequirement || 'Medium'}
                    </span>
                </div>
            </div>

            {crop.reasons && crop.reasons.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#E4E9DE]">
                    <h5 className="text-xs font-semibold text-[#344334] mb-2 uppercase tracking-wider">
                        Suitability Factors
                    </h5>
                    <ul className="space-y-1.5">
                        {crop.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-[#7A8475]">
                                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                                <span>{reason}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default CropSuitability
