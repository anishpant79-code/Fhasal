import React from 'react'
import { Thermometer, Droplets, Wind, Sun } from 'lucide-react'

export const Weather = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="p-8 text-center text-[#718071] animate-pulse">
                Loading meteorological observations...
            </div>
        )
    }

    if (!data) return null

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#344334]">
                Atmospheric Conditions (30-day NASA Average)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Thermometer size={20} className="text-amber-600" />
                        <span className="text-xs text-[#7A8475]">Avg Temperature</span>
                    </div>
                    <p className="text-2xl font-bold text-[#344334]">
                        {data.temperature ? `${data.temperature.toFixed(1)} °C` : 'N/A'}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Droplets size={20} className="text-blue-500" />
                        <span className="text-xs text-[#7A8475]">Relative Humidity</span>
                    </div>
                    <p className="text-2xl font-bold text-[#344334]">
                        {data.humidity ? `${data.humidity.toFixed(1)} %` : 'N/A'}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Wind size={20} className="text-teal-600" />
                        <span className="text-xs text-[#7A8475]">Wind Speed (2m)</span>
                    </div>
                    <p className="text-2xl font-bold text-[#344334]">
                        {data.windSpeed ? `${data.windSpeed.toFixed(1)} m/s` : 'N/A'}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Sun size={20} className="text-yellow-500" />
                        <span className="text-xs text-[#7A8475]">Solar Radiation</span>
                    </div>
                    <p className="text-2xl font-bold text-[#344334]">
                        {data.solarRadiation ? `${data.solarRadiation.toFixed(1)} MJ/m²` : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Weather
