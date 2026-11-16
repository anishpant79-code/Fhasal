import React from 'react'
import { Activity, AlertTriangle, Droplets, Flame, Sun, CheckCircle } from 'lucide-react'

export const SimulationDetails = ({
    field,
    weather,
    cropHealthIndex = 88,
    waterStressIndex = 22,
    nitrogenIndex = 74,
}) => {
    return (
        <div className="bg-white rounded-2xl border border-[#E4E9DE] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E4E9DE] pb-4">
                <div className="flex items-center gap-2">
                    <Activity size={22} className="text-[#174B35]" />
                    <h3 className="text-lg font-bold text-[#344334]">
                        Digital Twin Simulation Telemetry
                    </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    Simulation Active
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#7A8475]">Crop Health Index</span>
                        <CheckCircle size={15} className="text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-700">{cropHealthIndex}/100</p>
                    <p className="text-xs text-[#7A8475] mt-1">Normal vegetative vitality</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#7A8475]">Crop Water Stress (CWSI)</span>
                        <Droplets size={15} className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-[#344334]">{waterStressIndex}%</p>
                    <p className="text-xs text-[#7A8475] mt-1">Moisture within safe bounds</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#7A8475]">Canopy Nitrogen Index</span>
                        <Sun size={15} className="text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-[#344334]">{nitrogenIndex}%</p>
                    <p className="text-xs text-[#7A8475] mt-1">Adequate leaf chlorophyll</p>
                </div>
            </div>

            <div className="p-4 bg-[#EAF4EE] rounded-xl text-xs text-[#344334] space-y-1">
                <p className="font-semibold text-[#174B35]">Digital Twin Status:</p>
                <p>
                    Synchronized with live Open-Meteo microclimate and regional soil profiles.
                    No critical drought or pest warnings detected for this plot.
                </p>
            </div>
        </div>
    )
}

export default SimulationDetails
