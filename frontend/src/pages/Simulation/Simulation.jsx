
import React, { useEffect, useMemo, useState } from 'react'
import {
    Sprout,
    Droplets,
    CalendarDays,
    RotateCcw,
    FlaskConical,
    Sun,
    MapPin,
    TrendingUp,
    Droplet,
    Clock,
    Leaf,
    IndianRupee,
    Wallet,
    Wheat,
    Tractor,
    Users,
    Bug,
    Save,
    Trash2,
    History,
} from 'lucide-react'

import { useFields } from '../../context/FieldContext'
import { useSettings } from '../../context/SettingsContext'

const cropData = {
    Rice: {
        duration: 120,
        waterMin: 1200,
        waterMax: 1500,
        seasons: ['Kharif'],
        yieldPerAcre: 2200,
        pricePerQuintal: 2300,
        expenses: { seeds: 3500, fertilizer: 5000, labour: 8000, irrigation: 3000, pesticides: 2500, machinery: 3000 },
        insight: 'Rice generally requires consistent water availability. Monitor soil moisture and water levels throughout its growth stages.',
    },
    Wheat: {
        duration: 120,
        waterMin: 450,
        waterMax: 650,
        seasons: ['Rabi'],
        yieldPerAcre: 1800,
        pricePerQuintal: 2400,
        expenses: { seeds: 2500, fertilizer: 4000, labour: 5500, irrigation: 2000, pesticides: 1500, machinery: 2500 },
        insight: 'Wheat generally grows during cooler conditions. Adequate moisture is particularly important during flowering and grain development.',
    },
    Maize: {
        duration: 100,
        waterMin: 500,
        waterMax: 800,
        seasons: ['Kharif', 'Rabi', 'Zaid'],
        yieldPerAcre: 2500,
        pricePerQuintal: 2200,
        expenses: { seeds: 3000, fertilizer: 4000, labour: 4500, irrigation: 1500, pesticides: 1500, machinery: 1500 },
        insight: 'Maize needs adequate sunlight and moisture, especially during flowering and grain development.',
    },
    Chickpea: {
        duration: 110,
        waterMin: 250,
        waterMax: 400,
        seasons: ['Rabi'],
        yieldPerAcre: 700,
        pricePerQuintal: 5500,
        expenses: { seeds: 2500, fertilizer: 2000, labour: 4000, irrigation: 1500, pesticides: 2000, machinery: 2000 },
        insight: 'Chickpea is relatively drought tolerant compared with many other crops. It generally performs better in well-drained soil.',
    },
    Groundnut: {
        duration: 120,
        waterMin: 500,
        waterMax: 700,
        seasons: ['Kharif', 'Rabi', 'Zaid'],
        yieldPerAcre: 1000,
        pricePerQuintal: 6000,
        expenses: { seeds: 6000, fertilizer: 4000, labour: 5500, irrigation: 2000, pesticides: 2500, machinery: 2000 },
        insight: 'Groundnut performs well in loose, well-drained soil. Moisture is important during flowering and pod formation.',
    },
    Millets: {
        duration: 100,
        waterMin: 300,
        waterMax: 500,
        seasons: ['Kharif', 'Rabi'],
        yieldPerAcre: 900,
        pricePerQuintal: 2800,
        expenses: { seeds: 1500, fertilizer: 2000, labour: 3500, irrigation: 1000, pesticides: 1500, machinery: 2500 },
        insight: 'Millets are generally hardy crops and many varieties tolerate relatively dry conditions.',
    },
}

const AREA_TO_SQM = {
    acre: 4046.8564224,
    hectare: 10000,
    guntha: 101.17141056,
}

const expenseOptions = [
    { key: 'seeds', label: 'Seeds', description: 'Seed and planting material', icon: Sprout },
    { key: 'fertilizer', label: 'Fertiliser', description: 'Fertilisers and soil nutrients', icon: Leaf },
    { key: 'labour', label: 'Labour', description: 'Farm workers and field operations', icon: Users },
    { key: 'irrigation', label: 'Irrigation', description: 'Water, pumping and irrigation expenses', icon: Droplet },
    { key: 'pesticides', label: 'Pesticides', description: 'Crop protection and pest management', icon: Bug },
    { key: 'machinery', label: 'Machinery', description: 'Equipment, fuel and machinery rental', icon: Tractor },
]

const normalizeUnit = (unit) => {
    const value = String(unit || 'acre').toLowerCase()
    if (value.startsWith('hectare') || value === 'ha') return 'hectare'
    if (value.startsWith('guntha')) return 'guntha'
    return 'acre'
}

const convertArea = (value, fromUnit, toUnit) => {
    const areaValue = Number(value)
    if (!Number.isFinite(areaValue)) return 0

    return (
        areaValue *
        AREA_TO_SQM[normalizeUnit(fromUnit)] /
        AREA_TO_SQM[normalizeUnit(toUnit)]
    )
}

const formatNumber = (value, decimals = 2) =>
    new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: decimals,
    }).format(Number.isFinite(value) ? value : 0)

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number.isFinite(value) ? value : 0)

const SAVED_SIMULATIONS_KEY = 'fhasal-saved-simulations'

const loadSavedSimulations = () => {
    try {
        const saved = localStorage.getItem(SAVED_SIMULATIONS_KEY)
        const parsed = saved ? JSON.parse(saved) : []

        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

const Simulation = () => {
    const { fields } = useFields()
    const { settings } = useSettings()

    const displayUnit = normalizeUnit(settings?.areaUnit)

    const [selectedFieldId, setSelectedFieldId] = useState(
        fields?.[0]?.id !== undefined ? String(fields[0].id) : ''
    )

    const [crop, setCrop] = useState('Rice')
    const [soil, setSoil] = useState('Loamy')
    const [season, setSeason] = useState('Kharif')
    const [irrigation, setIrrigation] = useState('Moderate')
    const [area, setArea] = useState('1')

    const [yieldPerAcre, setYieldPerAcre] = useState(
        String(cropData.Rice.yieldPerAcre)
    )

    const [pricePerQuintal, setPricePerQuintal] = useState(
        String(cropData.Rice.pricePerQuintal)
    )

    const [expenses, setExpenses] = useState({ ...cropData.Rice.expenses })

    const [savedScenarios, setSavedScenarios] = useState(loadSavedSimulations)
    const [saveMessage, setSaveMessage] = useState('')

    const selectedField = useMemo(
        () =>
            fields?.find(
                (field) => String(field.id) === String(selectedFieldId)
            ) || null,
        [fields, selectedFieldId]
    )

    const cropInfo = cropData[crop]

    // Keep selected field valid when fields are added or deleted.
    useEffect(() => {
        if (!fields?.length) {
            setSelectedFieldId('')
            return
        }

        const exists = fields.some(
            (field) => String(field.id) === String(selectedFieldId)
        )

        if (!exists) {
            setSelectedFieldId(String(fields[0].id))
        }
    }, [fields, selectedFieldId])

    // Load registered field area in the current Settings unit.
    useEffect(() => {
        if (!selectedField) return

        const savedArea = Number(selectedField.fieldArea)

        if (Number.isFinite(savedArea) && savedArea > 0) {
            const converted = convertArea(
                savedArea,
                selectedField.areaUnit,
                displayUnit
            )

            setArea(String(Number(converted.toFixed(4))))
        }
    }, [
        selectedField?.id,
        selectedField?.fieldArea,
        selectedField?.areaUnit,
        displayUnit,
    ])

    // Update default assumptions when crop changes.
    useEffect(() => {
        setYieldPerAcre(String(cropInfo.yieldPerAcre))
        setPricePerQuintal(String(cropInfo.pricePerQuintal))
        setExpenses({ ...cropInfo.expenses })
    }, [crop])

    // Save scenarios whenever the saved list changes.
    useEffect(() => {
        try {
            localStorage.setItem(
                SAVED_SIMULATIONS_KEY,
                JSON.stringify(savedScenarios)
            )
        } catch {
            setSaveMessage(
                'Could not save scenarios. Check your browser storage.'
            )
        }
    }, [savedScenarios])

    const numericArea = Number(area)

    const validArea =
        area !== '' &&
        Number.isFinite(numericArea) &&
        numericArea > 0

    const areaInAcres = validArea
        ? numericArea * AREA_TO_SQM[displayUnit] / AREA_TO_SQM.acre
        : 0

    const validYield =
        yieldPerAcre !== '' &&
        Number.isFinite(Number(yieldPerAcre)) &&
        Number(yieldPerAcre) >= 0

    const validPrice =
        pricePerQuintal !== '' &&
        Number.isFinite(Number(pricePerQuintal)) &&
        Number(pricePerQuintal) >= 0

    const validExpenses = expenseOptions.every(({ key }) => {
        const value = expenses[key]

        return (
            value !== '' &&
            Number.isFinite(Number(value)) &&
            Number(value) >= 0
        )
    })

    const financialInputsValid =
        validArea && validYield && validPrice && validExpenses

    const costPerAcre = expenseOptions.reduce(
        (total, item) => total + (Number(expenses[item.key]) || 0),
        0
    )

    const totalCultivationCost = costPerAcre * areaInAcres

    const estimatedHarvest = financialInputsValid
        ? areaInAcres * Number(yieldPerAcre)
        : 0

    const estimatedRevenue = financialInputsValid
        ? (estimatedHarvest / 100) * Number(pricePerQuintal)
        : 0

    const estimatedProfit = estimatedRevenue - totalCultivationCost

    const waterRequirement = useMemo(() => {
        if (!validArea) {
            return { minimum: 0, maximum: 0, average: 0 }
        }

        const areaInSquareMetres = numericArea * AREA_TO_SQM[displayUnit]
        const average = (cropInfo.waterMin + cropInfo.waterMax) / 2

        return {
            minimum: cropInfo.waterMin * areaInSquareMetres,
            maximum: cropInfo.waterMax * areaInSquareMetres,
            average: average * areaInSquareMetres,
        }
    }, [numericArea, validArea, displayUnit, cropInfo])

    const dailyWater = validArea
        ? waterRequirement.average / cropInfo.duration
        : 0

    const handleExpenseChange = (key, value) => {
        if (value === '' || Number(value) >= 0) {
            setExpenses((previous) => ({
                ...previous,
                [key]: value,
            }))
        }
    }

    const handleReset = () => {
        setCrop('Rice')
        setSoil('Loamy')
        setSeason('Kharif')
        setIrrigation('Moderate')
        setYieldPerAcre(String(cropData.Rice.yieldPerAcre))
        setPricePerQuintal(String(cropData.Rice.pricePerQuintal))
        setExpenses({ ...cropData.Rice.expenses })

        if (selectedField) {
            const converted = convertArea(
                selectedField.fieldArea,
                selectedField.areaUnit,
                displayUnit
            )

            setArea(
                converted > 0
                    ? String(Number(converted.toFixed(4)))
                    : '1'
            )
        } else {
            setArea('1')
        }

        setSaveMessage('')
    }

    // Save the current simulation as a separate snapshot.
    const handleSaveScenario = () => {
        if (!financialInputsValid) {
            setSaveMessage(
                'Please enter valid simulation and financial values before saving.'
            )
            return
        }

        const scenario = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            savedAt: new Date().toISOString(),

            fieldId: selectedField?.id ?? null,
            fieldName: selectedField?.fieldName || 'Sample field',
            fieldLocation: selectedField?.fieldLocation || 'Location not specified',

            crop,
            soil,
            season,
            irrigation,

            area: numericArea,
            areaUnit: displayUnit,

            yieldPerAcre: Number(yieldPerAcre),
            pricePerQuintal: Number(pricePerQuintal),
            expenses: { ...expenses },

            estimatedHarvest,
            estimatedRevenue,
            totalCultivationCost,
            estimatedProfit,

            waterAverage: waterRequirement.average,
            duration: cropInfo.duration,
        }

        setSavedScenarios((previous) => [scenario, ...previous])
        setSaveMessage(`${crop} simulation saved successfully.`)
    }

    // Delete a saved scenario.
    const handleDeleteScenario = (scenarioId) => {
        setSavedScenarios((previous) =>
            previous.filter((scenario) => scenario.id !== scenarioId)
        )

        setSaveMessage('Saved simulation deleted.')
    }

    // Load a saved scenario back into the simulation controls.
    const handleLoadScenario = (scenario) => {
        if (!scenario || !cropData[scenario.crop]) {
            setSaveMessage('This saved scenario is invalid or unsupported.')
            return
        }

        setSelectedFieldId(
            scenario.fieldId !== null && scenario.fieldId !== undefined
                ? String(scenario.fieldId)
                : ''
        )

        setCrop(scenario.crop)
        setSoil(scenario.soil || 'Loamy')
        setSeason(scenario.season || 'Kharif')
        setIrrigation(scenario.irrigation || 'Moderate')

        const convertedArea = convertArea(
            scenario.area,
            scenario.areaUnit,
            displayUnit
        )

        setArea(
            convertedArea > 0
                ? String(Number(convertedArea.toFixed(4)))
                : '1'
        )

        setYieldPerAcre(String(scenario.yieldPerAcre))
        setPricePerQuintal(String(scenario.pricePerQuintal))

        setExpenses({
            ...cropData[scenario.crop].expenses,
            ...(scenario.expenses || {}),
        })

        setSaveMessage(`${scenario.crop} scenario loaded successfully.`)

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    const getSoilAdvice = () => {
        if (soil === 'Sandy') {
            return 'Sandy soils generally drain quickly. More frequent, carefully managed irrigation may be needed.'
        }

        if (soil === 'Clay') {
            return 'Clay soils retain more water and may drain slowly. Avoid excessive irrigation and waterlogging.'
        }

        if (soil === 'Black Soil') {
            return 'Black soils can retain substantial moisture. Monitor drainage and soil moisture before irrigation.'
        }

        if (soil === 'Alluvial') {
            return 'Alluvial soils vary in texture and fertility. Base irrigation and crop decisions on the actual field condition.'
        }

        return 'Loamy soil generally provides a balance of drainage and moisture retention. Maintain suitable soil moisture.'
    }

    const getIrrigationAdvice = () => {
        if (irrigation === 'Low') {
            return 'Water availability is limited. Consider efficient irrigation methods and check whether this crop is suitable for your available water supply.'
        }

        if (irrigation === 'Moderate') {
            return 'Moderate water availability is selected. Monitor soil moisture and adjust irrigation according to crop growth and rainfall.'
        }

        return 'High water availability is selected. Use water efficiently and avoid over-irrigation or waterlogging.'
    }

    const getSeasonAdvice = () => {
        if (cropInfo.seasons.includes(season)) {
            return `${crop} is commonly grown during the ${season} season in suitable regions. Local climate and variety still matter.`
        }

        return `${season} is not the typical season shown for ${crop} in this basic simulator. Check local agricultural guidance before planting.`
    }

    const unitLabel =
        displayUnit === 'acre'
            ? 'Acres'
            : displayUnit === 'hectare'
                ? 'Hectares'
                : 'Guntha'

    return (
        <div className="min-h-screen bg-[#F7F9F5] p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#347052]">
                        <FlaskConical size={17} />
                        Farm Planning
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                        Farm Simulation
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Explore crop growth, water requirements, yield and cultivation costs.
                    </p>
                </div>

                <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                    <RotateCcw size={16} />
                    Reset Simulation
                </button>
            </div>

            {/* Field Information */}
            <div className="mb-6 rounded-2xl border border-[#DCE9DE] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-[#EAF3EB] p-3 text-[#347052]">
                            <MapPin size={22} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-800">Field Information</h2>
                            <p className="text-sm text-gray-500">
                                {selectedField
                                    ? `${selectedField.fieldName || 'Registered Field'} · ${selectedField.fieldLocation || 'Location not specified'}`
                                    : 'No registered field selected. You can still run a sample simulation.'}
                            </p>
                        </div>
                    </div>

                    {fields?.length > 0 && (
                        <select
                            value={selectedFieldId}
                            onChange={(e) => setSelectedFieldId(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#347052] sm:max-w-xs"
                        >
                            {fields.map((field) => (
                                <option key={field.id} value={String(field.id)}>
                                    {field.fieldName || 'Registered Field'}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Simulation Controls */}
                <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">

                    <div className="mb-2 flex items-center gap-3">
                        <div className="rounded-xl bg-[#EAF3EB] p-3 text-[#347052]">
                            <Sprout size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Simulation Parameters</h2>
                            <p className="text-sm text-gray-500">
                                Change the conditions for your farming scenario.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Select Crop</label>
                        <select
                            value={crop}
                            onChange={(e) => setCrop(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#347052]"
                        >
                            {Object.keys(cropData).map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Soil Type</label>
                        <select
                            value={soil}
                            onChange={(e) => setSoil(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#347052]"
                        >
                            <option>Loamy</option>
                            <option>Clay</option>
                            <option>Sandy</option>
                            <option>Black Soil</option>
                            <option>Alluvial</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Growing Season</label>
                        <select
                            value={season}
                            onChange={(e) => setSeason(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#347052]"
                        >
                            <option>Kharif</option>
                            <option>Rabi</option>
                            <option>Zaid</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Irrigation Availability</label>
                        <select
                            value={irrigation}
                            onChange={(e) => setIrrigation(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#347052]"
                        >
                            <option>Low</option>
                            <option>Moderate</option>
                            <option>High</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Farming Area ({unitLabel})
                        </label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#347052]"
                            placeholder="Enter farming area"
                        />

                        {selectedField && (
                            <p className="mt-2 text-xs text-gray-400">
                                Initially loaded from your registered field. Changes here do not modify your saved field.
                            </p>
                        )}

                        {!validArea && (
                            <p className="mt-2 text-xs text-red-500">
                                Enter an area greater than zero.
                            </p>
                        )}
                    </div>

                    {/* Financial assumptions */}
                    <div className="border-t border-gray-100 pt-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-xl bg-[#FFF5DF] p-3 text-[#B68A35]">
                                <IndianRupee size={21} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Financial Assumptions</h3>
                                <p className="text-xs text-gray-500">
                                    Edit yield and selling price for your scenario.
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Expected Yield (kg per acre)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={yieldPerAcre}
                                onChange={(e) => setYieldPerAcre(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#347052]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Expected Selling Price (₹ per quintal)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={pricePerQuintal}
                                onChange={(e) => setPricePerQuintal(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#347052]"
                            />
                        </div>
                    </div>

                    {/* Expense breakdown */}
                    <div className="border-t border-gray-100 pt-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                <Wallet size={21} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Cultivation Expense Breakdown</h3>
                                <p className="text-xs text-gray-500">
                                    Enter estimated expenses per acre in rupees.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {expenseOptions.map((item) => {
                                const Icon = item.icon

                                return (
                                    <div key={item.key} className="rounded-xl border border-gray-100 p-4">
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="rounded-lg bg-[#F0F6F0] p-2 text-[#347052]">
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                                                <p className="text-xs text-gray-400">{item.description}</p>
                                            </div>
                                        </div>

                                        <label className="mb-2 block text-xs font-medium text-gray-500">
                                            Cost per acre (₹)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="100"
                                            value={expenses[item.key]}
                                            onChange={(e) => handleExpenseChange(item.key, e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#347052]"
                                        />
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F0F6F0] p-4">
                            <span className="text-sm font-semibold text-[#426F58]">Total cost per acre</span>
                            <span className="text-lg font-bold text-[#347052]">{formatCurrency(costPerAcre)}</span>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-5">

                    <div className="rounded-2xl bg-[#347052] p-6 text-white shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="rounded-xl bg-white/15 p-3">
                                <TrendingUp size={23} />
                            </div>
                            <div>
                                <h2 className="font-bold">Scenario Overview</h2>
                                <p className="text-xs text-white/70">Current simulation settings</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                ['Crop', crop],
                                ['Soil', soil],
                                ['Season', season],
                                ['Irrigation', irrigation],
                                ['Area', `${validArea ? formatNumber(numericArea) : '0'} ${unitLabel}`],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between gap-3 border-b border-white/20 pb-3 last:border-0 last:pb-0">
                                    <span className="text-sm text-white/75">{label}</span>
                                    <span className="text-right font-semibold">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-xl bg-[#FFF5DF] p-3 text-[#B68A35]">
                                <Clock size={21} />
                            </div>
                            <h2 className="font-bold text-gray-800">Estimated Crop Duration</h2>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-[#347052]">{cropInfo.duration}</span>
                            <span className="text-sm text-gray-500">days</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                <Droplets size={21} />
                            </div>
                            <h2 className="font-bold text-gray-800">Seasonal Water Estimate</h2>
                        </div>

                        {validArea ? (
                            <>
                                <p className="text-2xl font-bold text-blue-700">
                                    {formatNumber(waterRequirement.average / 1000000, 3)} million L
                                </p>
                                <p className="mt-1 text-xs text-gray-500">Approximate seasonal crop water demand</p>

                                <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-sm">
                                    <div className="flex justify-between gap-2">
                                        <span className="text-gray-500">Lower estimate</span>
                                        <span className="font-medium">{formatNumber(waterRequirement.minimum / 1000000, 3)} million L</span>
                                    </div>
                                    <div className="flex justify-between gap-2">
                                        <span className="text-gray-500">Upper estimate</span>
                                        <span className="font-medium">{formatNumber(waterRequirement.maximum / 1000000, 3)} million L</span>
                                    </div>
                                    <div className="flex justify-between gap-2">
                                        <span className="text-gray-500">Daily average</span>
                                        <span className="font-medium">{formatNumber(dailyWater / 1000, 2)} thousand L</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Enter a valid area to calculate water demand.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Financial Results */}
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-[#EAF3EB] p-3 text-[#347052]">
                        <Wallet size={23} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Estimated Financial Outcome</h2>
                        <p className="text-sm text-gray-500">
                            Calculated using your yield, price and individual expenses.
                        </p>
                    </div>
                </div>

                {financialInputsValid ? (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-xl bg-[#F0F6F0] p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm text-[#347052]">
                                    <Wheat size={17} /> Estimated Harvest
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{formatNumber(estimatedHarvest)} kg</p>
                                <p className="mt-1 text-xs text-gray-500">{formatNumber(estimatedHarvest / 100)} quintals</p>
                            </div>

                            <div className="rounded-xl bg-blue-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm text-blue-700">
                                    <IndianRupee size={17} /> Estimated Revenue
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{formatCurrency(estimatedRevenue)}</p>
                                <p className="mt-1 text-xs text-gray-500">Before cultivation costs</p>
                            </div>

                            <div className="rounded-xl bg-amber-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm text-amber-700">
                                    <Wallet size={17} /> Total Cultivation Cost
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalCultivationCost)}</p>
                                <p className="mt-1 text-xs text-gray-500">All six expense categories</p>
                            </div>

                            <div className={`rounded-xl p-4 ${estimatedProfit >= 0 ? 'bg-[#EAF3EB]' : 'bg-red-50'}`}>
                                <div className={`mb-2 flex items-center gap-2 text-sm ${estimatedProfit >= 0 ? 'text-[#347052]' : 'text-red-700'}`}>
                                    <TrendingUp size={17} /> Estimated Net Profit
                                </div>
                                <p className={`text-2xl font-bold ${estimatedProfit >= 0 ? 'text-[#347052]' : 'text-red-700'}`}>
                                    {formatCurrency(estimatedProfit)}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">Revenue minus listed costs</p>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-100 pt-5">
                            <h3 className="mb-4 font-bold text-gray-800">Expense Summary</h3>

                            <div className="space-y-4">
                                {expenseOptions.map((item) => {
                                    const total = Number(expenses[item.key]) * areaInAcres
                                    const percentage = costPerAcre > 0
                                        ? (Number(expenses[item.key]) / costPerAcre) * 100
                                        : 0

                                    return (
                                        <div key={item.key}>
                                            <div className="mb-2 flex justify-between gap-3 text-sm">
                                                <span className="text-gray-600">{item.label}</span>
                                                <span className="font-semibold text-gray-800">{formatCurrency(total)}</span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-[#6D9B79]"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <p className="mt-1 text-xs text-gray-400">{formatNumber(percentage, 1)}% of cultivation cost</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mt-6 rounded-xl border border-gray-100 p-4">
                            <h3 className="mb-3 text-sm font-bold text-gray-800">Calculation Breakdown</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">Area converted to acres</span>
                                    <span className="font-medium text-gray-800">{formatNumber(areaInAcres)} acres</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">Expected yield per acre</span>
                                    <span className="font-medium text-gray-800">{formatNumber(Number(yieldPerAcre))} kg</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">Selling price per quintal</span>
                                    <span className="font-medium text-gray-800">{formatCurrency(Number(pricePerQuintal))}</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">Cultivation cost per acre</span>
                                    <span className="font-medium text-gray-800">{formatCurrency(costPerAcre)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Save Current Scenario */}
                        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[#DCE9DE] bg-[#F7FAF6] p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="font-bold text-gray-800">Save this simulation</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    Keep this crop plan so you can compare it with other scenarios later.
                                </p>
                            </div>
                            <button
                                onClick={handleSaveScenario}
                                disabled={!financialInputsValid}
                                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#347052] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285A40] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save size={17} />
                                Save Scenario
                            </button>
                        </div>

                        {saveMessage && (
                            <p className="mt-3 text-sm text-[#347052]" role="status">
                                {saveMessage}
                            </p>
                        )}
                    </>
                ) : (
                    <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                        Enter a valid area, yield, selling price and all six expense values to calculate the financial outcome.
                    </p>
                )}
            </div>

            {/* Saved Scenarios and Comparison */}
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-[#EAF3EB] p-3 text-[#347052]">
                            <History size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Saved Simulations</h2>
                            <p className="text-sm text-gray-500">
                                Compare your saved crop plans and financial estimates.
                            </p>
                        </div>
                    </div>

                    <span className="w-fit rounded-full bg-[#EAF3EB] px-3 py-1 text-sm font-semibold text-[#347052]">
                        {savedScenarios.length} saved
                    </span>
                </div>

                {savedScenarios.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
                        <History size={32} className="mx-auto mb-3 text-gray-400" />
                        <h3 className="font-semibold text-gray-700">No saved simulations yet</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Configure a crop simulation above and select Save Scenario to start comparing plans.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-5 space-y-3">
                            {savedScenarios.map((scenario) => (
                                <div
                                    key={scenario.id}
                                    className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-bold text-gray-800">{scenario.crop}</h3>
                                            <span className="rounded-full bg-[#EAF3EB] px-2.5 py-1 text-xs font-medium text-[#347052]">
                                                {scenario.season}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {scenario.fieldName} · {formatNumber(scenario.area)} {scenario.areaUnit}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            Saved {new Date(scenario.savedAt).toLocaleString('en-IN')}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Estimated profit</p>
                                            <p className={`font-bold ${scenario.estimatedProfit >= 0 ? 'text-[#347052]' : 'text-red-600'}`}>
                                                {formatCurrency(scenario.estimatedProfit)}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleLoadScenario(scenario)}
                                            className="flex items-center gap-2 rounded-lg border border-[#DCE9DE] px-3 py-2 text-sm font-medium text-[#347052] transition hover:bg-[#F0F6F0]"
                                        >
                                            <History size={16} />
                                            Load
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteScenario(scenario.id)}
                                            className="flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                            aria-label={`Delete ${scenario.crop} simulation`}
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comparison table */}
                        <div className="border-t border-gray-100 pt-5">
                            <h3 className="mb-4 font-bold text-gray-800">Scenario Comparison</h3>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                                    <thead>
                                        <tr className="bg-[#F0F6F0] text-[#426F58]">
                                            <th className="rounded-l-lg p-3 font-semibold">Crop</th>
                                            <th className="p-3 font-semibold">Field</th>
                                            <th className="p-3 font-semibold">Area</th>
                                            <th className="p-3 font-semibold">Harvest</th>
                                            <th className="p-3 font-semibold">Revenue</th>
                                            <th className="p-3 font-semibold">Cost</th>
                                            <th className="rounded-r-lg p-3 font-semibold">Net Profit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {savedScenarios.map((scenario) => (
                                            <tr key={scenario.id} className="border-b border-gray-100 last:border-0">
                                                <td className="p-3 font-semibold text-gray-800">
                                                    {scenario.crop}
                                                    <p className="text-xs font-normal text-gray-400">{scenario.season}</p>
                                                </td>
                                                <td className="p-3 text-gray-600">{scenario.fieldName}</td>
                                                <td className="p-3 text-gray-600">
                                                    {formatNumber(scenario.area)} {scenario.areaUnit}
                                                </td>
                                                <td className="p-3 text-gray-600">
                                                    {formatNumber(scenario.estimatedHarvest)} kg
                                                </td>
                                                <td className="p-3 text-gray-600">
                                                    {formatCurrency(scenario.estimatedRevenue)}
                                                </td>
                                                <td className="p-3 text-gray-600">
                                                    {formatCurrency(scenario.totalCultivationCost)}
                                                </td>
                                                <td className={`p-3 font-bold ${scenario.estimatedProfit >= 0 ? 'text-[#347052]' : 'text-red-600'}`}>
                                                    {formatCurrency(scenario.estimatedProfit)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Farming Insights */}
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-xl bg-[#EAF3EB] p-3 text-[#347052]">
                            <Leaf size={21} />
                        </div>
                        <h2 className="font-bold text-gray-800">Crop Insights</h2>
                    </div>
                    <p className="text-sm leading-6 text-gray-600">{cropInfo.insight}</p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <Droplet size={21} />
                        </div>
                        <h2 className="font-bold text-gray-800">Water Planning</h2>
                    </div>
                    <p className="text-sm leading-6 text-gray-600">{getIrrigationAdvice()}</p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-xl bg-[#FFF5DF] p-3 text-[#B68A35]">
                            <Sun size={21} />
                        </div>
                        <h2 className="font-bold text-gray-800">Soil & Season</h2>
                    </div>
                    <p className="text-sm leading-6 text-gray-600">{getSoilAdvice()}</p>
                    <p className="mt-3 text-sm text-gray-600">{getSeasonAdvice()}</p>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <CalendarDays size={19} className="mt-0.5 shrink-0" />
                <p>
                    <strong>Prototype notice:</strong> Yield, selling price, cultivation costs, crop duration and water requirements are illustrative assumptions. Actual outcomes depend on crop variety, location, soil, rainfall, labour, input prices, market prices and farming practices. The expense categories may not cover every cost, such as land rent, loan interest, transport, storage, taxes or market deductions. Use local agricultural and market information before making financial decisions.
                </p>
            </div>
        </div>
    )
}

export default Simulation
