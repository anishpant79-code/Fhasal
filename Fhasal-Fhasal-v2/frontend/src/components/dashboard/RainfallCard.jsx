import React from 'react'
import { CloudRain, Calendar } from 'lucide-react'

export const RainfallCard = ({
    dailyRainMm = 0,
    monthlyTotalMm = 84.5,
    lastRainDate = 'Recent',
    className = '',
}) => {
    return (
        <div className={`bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <CloudRain size={22} />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-[#344334]">Rainfall</h4>
                        <p className="text-xs text-[#7A8475]">Precipitation</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-[#344334]">{dailyRainMm}</span>
                    <span className="text-xs font-medium text-[#7A8475] ml-1">mm today</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E4E9DE] text-xs text-[#7A8475]">
                <div>
                    <span>30-Day Total:</span>
                    <p className="text-sm font-semibold text-[#344334] mt-0.5">{monthlyTotalMm} mm</p>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                    <Calendar size={13} className="text-[#7A8475]" />
                    <span>{lastRainDate}</span>
                </div>
            </div>
        </div>
    )
}

export default RainfallCard
