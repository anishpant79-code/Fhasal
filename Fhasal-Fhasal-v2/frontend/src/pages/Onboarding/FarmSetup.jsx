import React, { useState } from 'react'
import { Ruler, Layers, CheckCircle } from 'lucide-react'

export const FarmSetup = ({ onComplete }) => {
    const [farmName, setFarmName] = useState('')
    const [approxArea, setApproxArea] = useState('')
    const [areaUnit, setAreaUnit] = useState('Acre')
    const [soilType, setSoilType] = useState('Black Soil')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (onComplete) {
            onComplete({ farmName, approxArea, areaUnit, soilType })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#EAF4EE] text-[#174B35] flex items-center justify-center mb-2">
                    <Ruler size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#344334]">Your First Plot</h3>
                <p className="text-xs text-[#7A8475]">Enter your primary farmland details</p>
            </div>

            <div>
                <label className="block text-xs font-semibold text-[#344334] mb-1">Farm / Plot Name</label>
                <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Main Farm"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-[#344334] mb-1">Area</label>
                    <input
                        type="number"
                        step="0.1"
                        value={approxArea}
                        onChange={(e) => setApproxArea(e.target.value)}
                        placeholder="e.g. 3.5"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-[#344334] mb-1">Unit</label>
                    <select
                        value={areaUnit}
                        onChange={(e) => setAreaUnit(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35] bg-white"
                    >
                        <option value="Acre">Acre</option>
                        <option value="Hectare">Hectare</option>
                        <option value="Guntha">Guntha</option>
                        <option value="Bigha">Bigha</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-[#344334] mb-1">Primary Soil Type</label>
                <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35] bg-white"
                >
                    <option value="Black Soil">Black Soil (Regur)</option>
                    <option value="Red Soil">Red Soil</option>
                    <option value="Alluvial Soil">Alluvial Soil</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay Loam">Clay Loam</option>
                </select>
            </div>

            <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#174B35] text-white text-sm font-semibold hover:bg-[#0f3424] transition-colors"
            >
                Complete Setup
            </button>
        </form>
    )
}

export default FarmSetup
