import React from 'react'
import { CloudRain, Droplets, Calendar } from 'lucide-react'

export const Rainfall = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="p-8 text-center text-[#718071] animate-pulse">
                Loading precipitation data...
            </div>
        )
    }

    if (!data) return null

    const totalRainfall = data.totalPrecipitation ?? 0
    const avgDailyRainfall = data.precipitation ?? (totalRainfall / 30)

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#344334]">
                Rainfall & Precipitation Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <CloudRain size={22} className="text-blue-600" />
                        <div>
                            <span className="text-xs text-[#7A8475]">30-Day Cumulative Rainfall</span>
                            <h4 className="text-2xl font-bold text-[#344334]">
                                {totalRainfall.toFixed(1)} mm
                            </h4>
                        </div>
                    </div>
                    <p className="text-xs text-[#7A8475] pt-2 border-t border-[#E4E9DE]">
                        Aggregated satellite observation from NASA POWER MERRA-2 assimilation.
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Droplets size={22} className="text-teal-600" />
                        <div>
                            <span className="text-xs text-[#7A8475]">Daily Average Precipitation</span>
                            <h4 className="text-2xl font-bold text-[#344334]">
                                {avgDailyRainfall.toFixed(1)} mm/day
                            </h4>
                        </div>
                    </div>
                    <p className="text-xs text-[#7A8475] pt-2 border-t border-[#E4E9DE]">
                        Estimated mean daily moisture replenishment rate.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Rainfall
