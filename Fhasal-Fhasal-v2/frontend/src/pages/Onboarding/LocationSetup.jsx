import React, { useState } from 'react'
import { MapPin, Search } from 'lucide-react'

export const LocationSetup = ({ onNext }) => {
    const [village, setVillage] = useState('')
    const [district, setDistrict] = useState('')
    const [state, setState] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (onNext) onNext({ village, district, state })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#EAF4EE] text-[#174B35] flex items-center justify-center mb-2">
                    <MapPin size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#344334]">Farm Location</h3>
                <p className="text-xs text-[#7A8475]">Helps us pinpoint your regional climate and agro zone</p>
            </div>

            <div>
                <label className="block text-xs font-semibold text-[#344334] mb-1">Village / Taluka</label>
                <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Niphad, Nashik"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-[#344334] mb-1">District</label>
                    <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="District"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-[#344334] mb-1">State</label>
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#174B35] text-white text-sm font-semibold hover:bg-[#0f3424] transition-colors"
            >
                Next Step
            </button>
        </form>
    )
}

export default LocationSetup
