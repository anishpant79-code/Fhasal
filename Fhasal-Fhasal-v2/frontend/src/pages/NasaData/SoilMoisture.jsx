import React from 'react'
import { Layers, Droplet, AlertCircle, CheckCircle } from 'lucide-react'

export const SoilMoisture = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="p-8 text-center text-[#718071] animate-pulse">
                Analyzing NASA POWER soil moisture levels...
            </div>
        )
    }

    if (!data) return null

    // Wetness index ranges 0 to 1
    const rootMoisture = data.rootZoneMoisture ?? 0.45
    const topMoisture = data.surfaceMoisture ?? 0.40

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#344334]">
                Soil Moisture & Wetness Index
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Layers size={20} className="text-[#174B35]" />
                            <h4 className="font-semibold text-sm text-[#344334]">Root Zone Wetness</h4>
                        </div>
                        <span className="text-sm font-bold text-[#174B35]">
                            {(rootMoisture * 100).toFixed(0)}%
                        </span>
                    </div>
                    <div className="w-full bg-[#EAF0E8] h-3 rounded-full overflow-hidden">
                        <div
                            className="bg-[#174B35] h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(0, rootMoisture * 100))}%` }}
                        />
                    </div>
                    <p className="text-xs text-[#7A8475] mt-2">
                        Moisture available to crop roots up to 100cm depth.
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Droplet size={20} className="text-blue-600" />
                            <h4 className="font-semibold text-sm text-[#344334]">Surface Soil Moisture</h4>
                        </div>
                        <span className="text-sm font-bold text-blue-600">
                            {(topMoisture * 100).toFixed(0)}%
                        </span>
                    </div>
                    <div className="w-full bg-[#EAF0E8] h-3 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(0, topMoisture * 100))}%` }}
                        />
                    </div>
                    <p className="text-xs text-[#7A8475] mt-2">
                        Top 5cm surface soil moisture relevant for seed germination.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SoilMoisture
