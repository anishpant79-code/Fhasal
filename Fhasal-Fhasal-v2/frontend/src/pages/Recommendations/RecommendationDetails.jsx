import React from 'react'
import { Calendar, DollarSign, Sprout, ShieldAlert, CheckCircle, Info } from 'lucide-react'

export const RecommendationDetails = ({
    crop,
    onClose,
}) => {
    if (!crop) return null

    return (
        <div className="bg-white rounded-2xl border border-[#E4E9DE] p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b border-[#E4E9DE] pb-4">
                <div>
                    <span className="text-xs font-semibold text-[#174B35] uppercase tracking-wider">
                        Crop Guide
                    </span>
                    <h3 className="text-2xl font-bold text-[#344334] mt-1">{crop.cropName}</h3>
                    <p className="text-sm text-[#7A8475]">{crop.season} Season • {crop.durationDays || '120-140'} Days</p>
                </div>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs text-[#7A8475] hover:text-[#344334]"
                    >
                        Close
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#EAF4EE] rounded-xl">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#174B35] mb-2">
                        <Calendar size={16} />
                        Sowing Window
                    </div>
                    <p className="text-xs text-[#344334] leading-relaxed">
                        {crop.sowingWindow || 'Ideal sowing time starts after first monsoon showers or onset of autumn.'}
                    </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-2">
                        <DollarSign size={16} />
                        Estimated Economics
                    </div>
                    <p className="text-xs text-[#344334] leading-relaxed">
                        Yield potential: {crop.expectedYield || '18-25 Quintals/Acre'}. Market demand index: High.
                    </p>
                </div>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-[#344334] mb-3 flex items-center gap-2">
                    <Sprout size={16} className="text-[#174B35]" />
                    Agronomic Management Tips
                </h4>
                <div className="space-y-2 text-xs text-[#7A8475]">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <strong className="text-[#344334] block mb-1">Fertilizer Requirement</strong>
                        Apply balanced NPK as recommended by regional agricultural extension with micronutrient spray at vegetative stage.
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <strong className="text-[#344334] block mb-1">Irrigation Schedule</strong>
                        Critical moisture periods: Flowering and pod/grain filling. Avoid water stagnation.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecommendationDetails
