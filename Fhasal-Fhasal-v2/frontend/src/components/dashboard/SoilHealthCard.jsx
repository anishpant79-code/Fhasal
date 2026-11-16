import React from 'react'
import { Layers, Droplet } from 'lucide-react'

export const SoilHealthCard = ({
    soilType = 'Loamy Soil',
    moisturePercent = 42,
    status = 'Optimal',
    className = '',
}) => {
    const statusColor = {
        Dry: 'text-amber-600 bg-amber-50',
        Optimal: 'text-emerald-700 bg-emerald-50',
        Wet: 'text-blue-700 bg-blue-50',
    }[status] || 'text-emerald-700 bg-emerald-50'

    return (
        <div className={`bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Layers size={22} />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-[#344334]">{soilType}</h4>
                        <p className="text-xs text-[#7A8475]">Soil Condition</p>
                    </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                    {status}
                </span>
            </div>

            <div className="pt-3 border-t border-[#E4E9DE]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#7A8475] flex items-center gap-1">
                        <Droplet size={13} className="text-blue-500" />
                        Root Zone Moisture
                    </span>
                    <strong className="text-[#344334]">{moisturePercent}%</strong>
                </div>
                <div className="w-full bg-[#EAF0E8] h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-[#174B35] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, moisturePercent))}%` }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SoilHealthCard
