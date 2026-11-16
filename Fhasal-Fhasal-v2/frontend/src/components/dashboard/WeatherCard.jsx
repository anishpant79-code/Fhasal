import React from 'react'
import { CloudSun, Droplets, Wind } from 'lucide-react'

export const WeatherCard = ({
    temperature = 28,
    humidity = 65,
    windSpeed = 12,
    condition = 'Partly Cloudy',
    location = 'Your Farm',
    className = '',
}) => {
    return (
        <div className={`bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <CloudSun size={22} />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-[#344334]">{location}</h4>
                        <p className="text-xs text-[#7A8475]">{condition}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-[#344334]">{temperature}°C</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E4E9DE] text-xs text-[#7A8475]">
                <div className="flex items-center gap-1.5">
                    <Droplets size={14} className="text-blue-500" />
                    <span>Humidity: <strong className="text-[#344334]">{humidity}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Wind size={14} className="text-teal-600" />
                    <span>Wind: <strong className="text-[#344334]">{windSpeed} km/h</strong></span>
                </div>
            </div>
        </div>
    )
}

export default WeatherCard
