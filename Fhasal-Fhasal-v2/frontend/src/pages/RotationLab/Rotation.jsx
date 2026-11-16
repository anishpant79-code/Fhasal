
import React, { useMemo, useState } from 'react'
import {
    RefreshCw,
    Sprout,
    Droplets,
    CalendarDays,
    Leaf,
    ArrowRight,
    Info,
    CheckCircle2,
} from 'lucide-react'

import { useFields } from '../../context/FieldContext'

const rotationPlans = [
    {
        id: 1,
        title: 'Rice → Chickpea',
        firstCrop: 'Rice',
        secondCrop: 'Chickpea',
        season: 'Kharif → Rabi',
        duration: '12 months',
        benefit: 'Legumes can help improve soil nitrogen availability.',
        water: 'Moderate',
        category: 'Cereal + Legume',
        color: 'bg-blue-50 text-blue-700',
    },
    {
        id: 2,
        title: 'Maize → Groundnut',
        firstCrop: 'Maize',
        secondCrop: 'Groundnut',
        season: 'Kharif → Rabi',
        duration: '12 months',
        benefit: 'A legume rotation can support soil fertility and crop diversity.',
        water: 'Moderate',
        category: 'Cereal + Legume',
        color: 'bg-green-50 text-green-700',
    },
    {
        id: 3,
        title: 'Wheat → Chickpea',
        firstCrop: 'Wheat',
        secondCrop: 'Chickpea',
        season: 'Rabi → Kharif',
        duration: '12 months',
        benefit: 'Diversifies crops and can reduce dependence on one crop family.',
        water: 'Low to Moderate',
        category: 'Cereal + Legume',
        color: 'bg-amber-50 text-amber-700',
    },
]

const Rotation = () => {
    const { fields } = useFields()

    const [selectedField, setSelectedField] = useState(
        fields.length > 0 ? String(fields[0].id) : ''
    )

    const [selectedPlan, setSelectedPlan] = useState(null)

    const currentField = useMemo(
        () => fields.find(
            (field) => String(field.id) === selectedField
        ),
        [fields, selectedField]
    )

    return (
        <div className="min-h-screen bg-fhasal-green-light p-4 md:p-8">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <div>
                    <div className="flex items-center gap-2 text-fhasal-green mb-2">
                        <RefreshCw size={20} />
                        <span className="text-sm font-semibold">
                            FARM PLANNING
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Crop Rotation Lab
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Plan better crop sequences to support long-term soil health.
                    </p>
                </div>

                <div className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
                    <div className="bg-green-100 p-2 rounded-lg">
                        <Sprout className="text-fhasal-green" size={22} />
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Registered fields
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                            {fields.length}
                        </p>
                    </div>
                </div>

            </div>

            {/* Field Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">

                <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Select Your Field
                </h2>

                {fields.length > 0 ? (
                    <div className="max-w-xl">
                        <select
                            value={selectedField}
                            onChange={(e) => {
                                setSelectedField(e.target.value)
                                setSelectedPlan(null)
                            }}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                        >
                            {fields.map((field) => (
                                <option
                                    key={field.id}
                                    value={String(field.id)}
                                >
                                    {field.fieldName || 'Unnamed Field'}
                                </option>
                            ))}
                        </select>

                        {currentField && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div className="bg-fhasal-green-light rounded-xl p-4">
                                    <p className="text-sm text-gray-500">
                                        Field location
                                    </p>
                                    <p className="font-semibold text-gray-800 mt-1">
                                        {currentField.fieldLocation || 'Not specified'}
                                    </p>
                                </div>

                                <div className="bg-fhasal-wheat rounded-xl p-4">
                                    <p className="text-sm text-gray-500">
                                        Field area
                                    </p>
                                    <p className="font-semibold text-gray-800 mt-1">
                                        {currentField.fieldArea || 0} {currentField.areaUnit || 'acre'}
                                    </p>
                                </div>

                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-amber-50 rounded-xl p-5 flex gap-3">
                        <Info className="text-amber-600 shrink-0" />

                        <div>
                            <p className="font-semibold text-gray-800">
                                No registered fields found
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Register a field first to start planning crop rotations.
                            </p>
                        </div>
                    </div>
                )}

            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="bg-green-100 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                        <Sprout className="text-green-700" />
                    </div>
                    <h3 className="font-bold text-gray-800">
                        Soil Fertility
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Legume crops can contribute to nitrogen cycling and soil fertility.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="bg-blue-100 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                        <Droplets className="text-blue-700" />
                    </div>
                    <h3 className="font-bold text-gray-800">
                        Resource Planning
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Compare crop water needs before planning your next season.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="bg-amber-100 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                        <CalendarDays className="text-amber-700" />
                    </div>
                    <h3 className="font-bold text-gray-800">
                        Seasonal Planning
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Plan crop sequences around seasonal growing cycles.
                    </p>
                </div>

            </div>

            {/* Rotation Plans */}
            <div className="mb-8">

                <div className="mb-5">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Suggested Rotation Plans
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Explore these example crop sequences.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">

                    {rotationPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                        >

                            <div className="flex justify-between items-start gap-3">
                                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${plan.color}`}>
                                    {plan.category}
                                </span>

                                <RefreshCw
                                    className="text-fhasal-green"
                                    size={20}
                                />
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mt-5">
                                {plan.title}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                {plan.season}
                            </p>

                            {/* Crop Sequence */}
                            <div className="flex items-center gap-3 mt-6">

                                <div className="flex-1 bg-fhasal-green-light rounded-xl p-4 text-center">
                                    <Sprout className="mx-auto text-fhasal-green mb-2" size={24} />
                                    <p className="font-semibold text-gray-800">
                                        {plan.firstCrop}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        First crop
                                    </p>
                                </div>

                                <ArrowRight className="text-gray-400 shrink-0" />

                                <div className="flex-1 bg-fhasal-wheat rounded-xl p-4 text-center">
                                    <Leaf className="mx-auto text-amber-700 mb-2" size={24} />
                                    <p className="font-semibold text-gray-800">
                                        {plan.secondCrop}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Next crop
                                    </p>
                                </div>

                            </div>

                            <div className="space-y-3 mt-5">

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Duration
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {plan.duration}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Water requirement
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {plan.water}
                                    </span>
                                </div>

                            </div>

                            <button
                                onClick={() => setSelectedPlan(
                                    selectedPlan === plan.id ? null : plan.id
                                )}
                                className="w-full mt-6 border border-fhasal-green text-fhasal-green font-semibold rounded-xl py-3 hover:bg-fhasal-green hover:text-white transition-colors"
                            >
                                {selectedPlan === plan.id
                                    ? 'Hide Details'
                                    : 'View Rotation Details'}
                            </button>

                            {selectedPlan === plan.id && (
                                <div className="mt-4 bg-green-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2
                                            size={18}
                                            className="text-green-700"
                                        />
                                        <p className="font-semibold text-green-800 text-sm">
                                            Rotation Benefit
                                        </p>
                                    </div>

                                    <p className="text-sm text-gray-600">
                                        {plan.benefit}
                                    </p>
                                </div>
                            )}

                        </div>
                    ))}

                </div>

            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-3">
                <Info className="text-blue-600 shrink-0" />

                <p className="text-sm text-blue-800">
                    These are illustrative rotation examples, not personalized
                    agronomic recommendations. Actual crop selection depends on
                    local climate, soil type, irrigation, previous crops,
                    planting dates, and local agricultural guidance.
                </p>
            </div>

        </div>
    )
}

export default Rotation
