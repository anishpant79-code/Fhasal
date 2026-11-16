import React from 'react'
import { Map, Ruler, Sprout } from 'lucide-react'

export const FarmOverview = ({
    fieldCount = 0,
    totalArea = '0.00',
    areaUnit = 'Acres',
    activeCrops = 0,
    className = '',
}) => {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
            <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-[#7A8475] uppercase tracking-wider">Registered Fields</p>
                        <h3 className="text-2xl font-bold text-[#344334] mt-1">{fieldCount}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#EAF4EE] text-[#174B35] flex items-center justify-center">
                        <Map size={22} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-[#7A8475] uppercase tracking-wider">Total Farming Area</p>
                        <h3 className="text-2xl font-bold text-[#344334] mt-1">
                            {totalArea} <span className="text-sm font-normal text-[#7A8475]">{areaUnit}</span>
                        </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                        <Ruler size={22} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-[#7A8475] uppercase tracking-wider">Active Crops</p>
                        <h3 className="text-2xl font-bold text-[#344334] mt-1">{activeCrops}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Sprout size={22} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FarmOverview
