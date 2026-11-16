import React, { useState } from 'react'
import { ArrowRight, Droplets, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react'

export const WhatIfSimulator = ({ defaultPrimary = 'Rice', defaultAlternative = 'Millets' }) => {
    const [currentCrop, setCurrentCrop] = useState(defaultPrimary)
    const [proposedCrop, setProposedCrop] = useState(defaultAlternative)
    const [soilType, setSoilType] = useState('Black Soil')

    // Simulation outcomes
    const simulations = {
        'Rice-Millets': {
            waterSaving: 65,
            soilNitrogen: '+15%',
            incomeStability: '+20%',
            climateResilience: 'Very High',
            rationale: 'Millets require significantly less water than paddy and survive delayed monsoon rains with minimal input cost.',
        },
        'Cotton-Soybean': {
            waterSaving: 30,
            soilNitrogen: '+35%',
            incomeStability: '+10%',
            climateResilience: 'High',
            rationale: 'Soybean fixes atmospheric nitrogen and breaks cotton pest cycles (pink bollworm).',
        },
        'Wheat-Chickpea': {
            waterSaving: 45,
            soilNitrogen: '+25%',
            incomeStability: '+15%',
            climateResilience: 'High',
            rationale: 'Chickpea consumes less ground water during winter and leaves residual moisture for subsequent crops.',
        },
    }

    const key = `${currentCrop}-${proposedCrop}`
    const result = simulations[key] || {
        waterSaving: 35,
        soilNitrogen: '+18%',
        incomeStability: '+12%',
        climateResilience: 'Moderate to High',
        rationale: `Rotating from ${currentCrop} to ${proposedCrop} diversifies pest pressure and improves long-term soil structure.`,
    }

    return (
        <div className="bg-white rounded-2xl border border-[#E4E9DE] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-[#174B35]" />
                <h3 className="text-lg font-bold text-[#344334]">
                    What-If Crop Rotation Simulator
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-[#7A8475] mb-1">
                        Current Main Crop
                    </label>
                    <select
                        value={currentCrop}
                        onChange={(e) => setCurrentCrop(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35] bg-white"
                    >
                        <option value="Rice">Rice (Paddy)</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Sugarcane">Sugarcane</option>
                    </select>
                </div>

                <div className="flex items-center justify-center pt-5">
                    <ArrowRight size={22} className="text-[#174B35]" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[#7A8475] mb-1">
                        Proposed Rotation Crop
                    </label>
                    <select
                        value={proposedCrop}
                        onChange={(e) => setProposedCrop(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35] bg-white"
                    >
                        <option value="Millets">Millets (Bajra/Jowar)</option>
                        <option value="Chickpea">Chickpea (Gram)</option>
                        <option value="Soybean">Soybean</option>
                        <option value="Mustard">Mustard</option>
                        <option value="Groundnut">Groundnut</option>
                    </select>
                </div>
            </div>

            <div className="bg-[#EAF4EE] rounded-xl p-5">
                <h4 className="text-xs font-semibold text-[#174B35] uppercase tracking-wider mb-3">
                    Projected Impact Analysis
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-white p-3 rounded-xl">
                        <span className="text-xs text-[#7A8475] block">Water Saved</span>
                        <strong className="text-lg font-bold text-blue-600">~{result.waterSaving}%</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl">
                        <span className="text-xs text-[#7A8475] block">Soil Nitrogen</span>
                        <strong className="text-lg font-bold text-emerald-700">{result.soilNitrogen}</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl">
                        <span className="text-xs text-[#7A8475] block">Income Resilience</span>
                        <strong className="text-lg font-bold text-amber-700">{result.incomeStability}</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl">
                        <span className="text-xs text-[#7A8475] block">Climate Score</span>
                        <strong className="text-sm font-bold text-[#174B35] mt-1 block">
                            {result.climateResilience}
                        </strong>
                    </div>
                </div>
                <p className="text-xs text-[#344334] mt-4 leading-relaxed">
                    💡 <strong>Agronomist Note:</strong> {result.rationale}
                </p>
            </div>
        </div>
    )
}

export default WhatIfSimulator
