import React from 'react'
import { Map, Ruler, Sprout, Layers } from 'lucide-react'
import { useFields } from '../../context/FieldContext'
import { useSettings } from '../../context/SettingsContext'

export const MyFarm = () => {
    const { fields = [] } = useFields()
    const { settings } = useSettings()

    const totalArea = fields.reduce((sum, f) => sum + (Number(f.fieldArea) || 0), 0)
    const activeCrops = [
        ...new Set(fields.filter((f) => f.currentCrop).map((f) => f.currentCrop)),
    ]

    return (
        <div className="bg-white rounded-2xl border border-[#E4E9DE] p-6 shadow-sm space-y-6">
            <div>
                <h3 className="text-xl font-bold text-[#344334]">My Farm Holdings</h3>
                <p className="text-sm text-[#7A8475]">Aggregated summary of all registered plots</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#EAF4EE] rounded-xl">
                    <span className="text-xs text-[#174B35] font-semibold uppercase">Total Acreage</span>
                    <p className="text-2xl font-bold text-[#174B35] mt-1">
                        {totalArea.toFixed(2)} <span className="text-sm font-normal">Acres</span>
                    </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl">
                    <span className="text-xs text-amber-800 font-semibold uppercase">Registered Plots</span>
                    <p className="text-2xl font-bold text-amber-800 mt-1">{fields.length}</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                    <span className="text-xs text-blue-800 font-semibold uppercase">Active Crops</span>
                    <p className="text-2xl font-bold text-blue-800 mt-1">{activeCrops.length}</p>
                </div>
            </div>

            {fields.length > 0 && (
                <div className="border-t border-[#E4E9DE] pt-4">
                    <h4 className="text-xs font-semibold text-[#344334] uppercase tracking-wider mb-3">
                        Plot Registry
                    </h4>
                    <div className="divide-y divide-[#E4E9DE]">
                        {fields.map((f) => (
                            <div key={f.id || f._id} className="py-2.5 flex items-center justify-between text-sm">
                                <div>
                                    <strong className="text-[#344334]">{f.fieldName || 'Field'}</strong>
                                    <span className="text-xs text-[#7A8475] ml-2">({f.soilType || 'Soil not set'})</span>
                                </div>
                                <span className="text-[#7A8475]">{Number(f.fieldArea || 0).toFixed(2)} {f.areaUnit || 'acre'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyFarm
