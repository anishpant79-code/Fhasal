
import React, { useEffect, useMemo, useState } from 'react'
import BackButton from '../../components/common/BackButton'
import {
    Satellite,
    MapPin,
    CalendarDays,
    Leaf,
    Layers,
    Search,
    Info,
    Activity,
    RefreshCw,
    Sprout,
    AlertTriangle,
    CheckCircle2,
} from 'lucide-react'

import {
    MapContainer,
    TileLayer,
    Polygon,
    useMap,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

import { useFields } from '../../context/FieldContext'

// --------------------------------------------------
// DATE HELPERS
// --------------------------------------------------

const getDefaultSatelliteDate = (daysAgo = 8) => {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

const getToday = () => getDefaultSatelliteDate(0)

// --------------------------------------------------
// NASA GIBS SATELLITE LAYERS
// --------------------------------------------------

const NASA_GIBS_URL =
    'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best'

const layers = [
    {
        id: 'ndvi',
        name: 'NDVI',
        description: 'Vegetation greenness',
        icon: Leaf,
        color: 'bg-green-100 text-green-700',
        nasaLayer: 'MODIS_Terra_NDVI_8Day',
        format: 'png',
        type: 'overlay',
        resolution: '250 m',
        source: 'NASA MODIS Terra',
    },
    {
        id: 'true-colour',
        name: 'True Colour',
        description: 'Natural satellite view',
        icon: Satellite,
        color: 'bg-blue-100 text-blue-700',
        nasaLayer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
        format: 'jpg',
        type: 'base',
        resolution: '250 m',
        source: 'NASA MODIS Terra',
    },
    {
        id: 'false-colour',
        name: 'False Colour',
        description: 'Vegetation contrast',
        icon: Layers,
        color: 'bg-purple-100 text-purple-700',
        nasaLayer: 'MODIS_Terra_CorrectedReflectance_Bands367',
        format: 'jpg',
        type: 'base',
        resolution: '250 m',
        source: 'NASA MODIS Terra',
    },
]

// --------------------------------------------------
// MAP HELPERS
// --------------------------------------------------

const INDIA_CENTER = [20.5937, 78.9629]

const getValidBoundary = (boundary) => {
    if (!Array.isArray(boundary)) return []

    return boundary
        .filter(
            (point) =>
                Array.isArray(point) &&
                point.length >= 2 &&
                Number.isFinite(Number(point[0])) &&
                Number.isFinite(Number(point[1])) &&
                Number(point[0]) >= -90 &&
                Number(point[0]) <= 90 &&
                Number(point[1]) >= -180 &&
                Number(point[1]) <= 180
        )
        .map((point) => [
            Number(point[0]),
            Number(point[1]),
        ])
}

const getMapCenter = (boundary) => {
    if (!boundary.length) return INDIA_CENTER

    const latitude =
        boundary.reduce((sum, point) => sum + point[0], 0) /
        boundary.length

    const longitude =
        boundary.reduce((sum, point) => sum + point[1], 0) /
        boundary.length

    return [latitude, longitude]
}

const FitFieldBounds = ({ boundary }) => {
    const map = useMap()

    useEffect(() => {
        if (boundary.length >= 3) {
            map.fitBounds(boundary, {
                padding: [35, 35],
                maxZoom: 15,
            })
        }
    }, [map, boundary])

    return null
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

const SatelliteImagery = () => {
    const { fields = [] } = useFields()

    const [selectedFieldId, setSelectedFieldId] = useState(
        fields.length > 0 ? String(fields[0].id) : ''
    )

    const [selectedDate, setSelectedDate] = useState(getDefaultSatelliteDate(8))
    const [activeLayer, setActiveLayer] = useState('ndvi')
    const [searchTerm, setSearchTerm] = useState('')
    const [tileError, setTileError] = useState(false)

    // Keep selected field synchronized with FieldContext.
    useEffect(() => {
        if (fields.length === 0) {
            setSelectedFieldId('')
            return
        }

        const selectedStillExists = fields.some(
            (field) => String(field.id || field._id) === selectedFieldId
        )

        if (!selectedStillExists) {
            setSelectedFieldId(String(fields[0].id || fields[0]._id))
        }
    }, [fields, selectedFieldId])

    // Find selected field.
    const selectedField = useMemo(
        () =>
            fields.find(
                (field) => String(field.id || field._id) === selectedFieldId
            ),
        [fields, selectedFieldId]
    )

    // Validate selected field boundary.
    const boundary = useMemo(
        () => getValidBoundary(selectedField?.boundary),
        [selectedField]
    )

    // Map center.
    const mapCenter = useMemo(
        () => getMapCenter(boundary),
        [boundary]
    )

    // Search registered fields.
    const filteredFields = useMemo(
        () =>
            fields.filter((field) =>
                `${field.fieldName || ''} ${field.fieldLocation || ''}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            ),
        [fields, searchTerm]
    )

    const currentLayer = layers.find(
        (layer) => layer.id === activeLayer
    )

    // NASA GIBS tile URL.
    const imageryUrl = currentLayer
        ? `${NASA_GIBS_URL}/${currentLayer.nasaLayer}/default/${selectedDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.${currentLayer.format}`
        : ''

    const handleReset = () => {
        setSelectedDate(getDefaultSatelliteDate(8))
        setActiveLayer('ndvi')
        setSearchTerm('')
        setTileError(false)

        if (fields.length > 0) {
            setSelectedFieldId(String(fields[0].id || fields[0]._id))
        }
    }

    const handleLayerChange = (layerId) => {
        setActiveLayer(layerId)
        setTileError(false)
    }

    const handleFieldChange = (event) => {
        setSelectedFieldId(event.target.value)
        setTileError(false)
    }

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value)
        setTileError(false)
    }

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div className="min-h-screen space-y-6 bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div>
                <BackButton />
            </div>

            {/* PAGE HEADER */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <Satellite
                            className="text-fhasal-green"
                            size={28}
                        />

                        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                            Satellite Imagery
                        </h1>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        Explore satellite imagery and vegetation monitoring
                        for your registered fields.
                    </p>
                </div>

                <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                    <RefreshCw size={16} />
                    Reset Filters
                </button>
            </div>

            {/* FIELD AND DATE SELECTION */}

            <div className="grid grid-cols-1 gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-2">

                {/* FIELD SELECTION */}

                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <MapPin
                            size={17}
                            className="text-fhasal-green"
                        />
                        Select Registered Field
                    </label>

                    {fields.length > 0 ? (
                        <>
                            <div className="relative mb-2">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    placeholder="Search fields..."
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            <select
                                value={selectedFieldId}
                                onChange={handleFieldChange}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            >
                                {filteredFields.length > 0 ? (
                                    filteredFields.map((field) => {
                                        const fId = String(field.id || field._id)
                                        return (
                                            <option
                                                key={fId}
                                                value={fId}
                                            >
                                                {field.fieldName || 'Unnamed Field'}
                                            </option>
                                        )
                                    })
                                ) : (
                                    <option value="">
                                        No matching fields found
                                    </option>
                                )}
                            </select>

                            <p className="mt-2 text-xs text-gray-500">
                                Search and select one of your registered fields.
                            </p>
                        </>
                    ) : (
                        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                            No registered fields found. Register a field
                            first to use this section.
                        </div>
                    )}
                </div>

                {/* DATE SELECTION */}

                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <CalendarDays
                            size={17}
                            className="text-fhasal-green"
                        />
                        Select Observation Date
                    </label>

                    <input
                        type="date"
                        value={selectedDate}
                        max={getToday()}
                        onChange={handleDateChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                        Choose the date for the satellite imagery.
                    </p>
                </div>
            </div>

            {/* SELECTED FIELD INFORMATION */}

            {selectedField && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                            <MapPin size={17} />
                            <span className="text-xs font-medium">
                                Field Location
                            </span>
                        </div>

                        <p className="mt-2 font-semibold text-gray-800">
                            {selectedField.fieldLocation || 'Not specified'}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Sprout size={17} />
                            <span className="text-xs font-medium">
                                Field Area
                            </span>
                        </div>

                        <p className="mt-2 font-semibold text-gray-800">
                            {selectedField.fieldArea || 'Not available'}{' '}
                            {selectedField.areaUnit || ''}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Activity size={17} />
                            <span className="text-xs font-medium">
                                Boundary Points
                            </span>
                        </div>

                        <p className="mt-2 font-semibold text-gray-800">
                            {boundary.length} points
                        </p>
                    </div>
                </div>
            )}

            {/* IMAGERY LAYER SELECTION */}

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <div className="mb-4">
                    <h2 className="font-bold text-gray-800">
                        Imagery Layers
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Select the satellite imagery type you want to explore.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {layers.map((layer) => {
                        const Icon = layer.icon
                        const isActive = activeLayer === layer.id

                        return (
                            <button
                                key={layer.id}
                                onClick={() => handleLayerChange(layer.id)}
                                className={`rounded-xl border p-4 text-left transition ${
                                    isActive
                                        ? 'border-green-600 bg-green-50 ring-2 ring-green-100'
                                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`rounded-lg p-2 ${layer.color}`}>
                                        <Icon size={21} />
                                    </div>

                                    {isActive && (
                                        <span className="text-xs font-semibold text-green-700">
                                            Selected
                                        </span>
                                    )}
                                </div>

                                <h3 className="mt-3 font-semibold text-gray-800">
                                    {layer.name}
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    {layer.description}
                                </p>

                                <p className="mt-2 text-xs text-gray-400">
                                    {layer.source} · {layer.resolution}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* SATELLITE VIEWER */}

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-bold text-gray-800">
                            Satellite Viewer
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {currentLayer?.name} · {selectedDate}
                        </p>
                    </div>

                    <span className="flex w-fit items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        <CheckCircle2 size={14} />
                        NASA GIBS Connected
                    </span>
                </div>

                {currentLayer ? (
                    <>
                        <div className="relative h-[350px] w-full sm:h-[450px] lg:h-[550px]">

                            <MapContainer
                                key={`${selectedFieldId}-${activeLayer}-${selectedDate}`}
                                center={mapCenter}
                                zoom={boundary.length >= 3 ? 13 : 5}
                                minZoom={2}
                                maxZoom={18}
                                scrollWheelZoom={true}
                                className="h-full w-full"
                            >
                                {/* Basemap for high-resolution zoomed farm context */}
                                <TileLayer
                                    attribution='Tiles &copy; Esri &mdash; Source: Esri, USGS, Maxar'
                                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                    maxZoom={18}
                                />

                                {/* NASA satellite imagery */}
                                <TileLayer
                                    key={imageryUrl}
                                    url={imageryUrl}
                                    attribution='Imagery: <a href="https://earthdata.nasa.gov/">NASA GIBS / NASA Earthdata</a>'
                                    minZoom={0}
                                    maxZoom={18}
                                    maxNativeZoom={9}
                                    opacity={currentLayer.type === 'overlay' ? 0.8 : 0.9}
                                    eventHandlers={{
                                        tileerror: () => setTileError(true),
                                        load: () => setTileError(false),
                                    }}
                                />

                                {/* Registered field boundary */}

                                {boundary.length >= 3 && (
                                    <Polygon
                                        positions={boundary}
                                        pathOptions={{
                                            color: '#166534',
                                            weight: 3,
                                            fillColor: '#22c55e',
                                            fillOpacity: 0.12,
                                        }}
                                    />
                                )}

                                <FitFieldBounds boundary={boundary} />
                            </MapContainer>
                        </div>

                        <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-gray-500">
                                Source: NASA GIBS / MODIS Terra
                            </p>

                            <p className="text-xs text-gray-500">
                                Selected date: {selectedDate}
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        Select an imagery layer to continue.
                    </div>
                )}
            </div>

            {/* TILE ERROR NOTICE */}

            {tileError && (
                <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <AlertTriangle
                        className="mt-0.5 shrink-0 text-amber-600"
                        size={20}
                    />

                    <div>
                        <h3 className="text-sm font-semibold text-amber-900">
                            Some satellite tiles could not be loaded
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-amber-800">
                            NASA may not have imagery available for the
                            selected date or map area. Try another date,
                            or zoom out and check again.
                        </p>
                    </div>
                </div>
            )}

            {/* FIELD BOUNDARY NOTICE */}

            {selectedField && boundary.length < 3 && (
                <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <Info
                        className="mt-0.5 shrink-0 text-amber-600"
                        size={20}
                    />

                    <div>
                        <h3 className="text-sm font-semibold text-amber-900">
                            Field boundary unavailable
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-amber-800">
                            Satellite imagery can still be explored, but
                            this field does not have at least three valid
                            boundary points. Update the field boundary to
                            display its outline on the map.
                        </p>
                    </div>
                </div>
            )}

            {/* NDVI LEGEND */}

            {activeLayer === 'ndvi' && (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                    <div className="mb-4 flex items-center gap-2">
                        <Leaf size={20} className="text-green-700" />

                        <h2 className="font-bold text-gray-800">
                            NDVI Reference Guide
                        </h2>
                    </div>

                    <p className="mb-4 text-sm leading-6 text-gray-500">
                        NDVI represents vegetation greenness. The NASA
                        layer is an 8-day composite. The ranges below
                        are general interpretation guidelines, not
                        calculated measurements of your selected field.
                    </p>

                    <div className="space-y-3">
                        {[
                            {
                                label: 'Very Poor',
                                range: '-1.0 to 0.0',
                                color: 'bg-red-500',
                            },
                            {
                                label: 'Poor',
                                range: '0.0 to 0.2',
                                color: 'bg-orange-400',
                            },
                            {
                                label: 'Moderate',
                                range: '0.2 to 0.4',
                                color: 'bg-yellow-400',
                            },
                            {
                                label: 'Good',
                                range: '0.4 to 0.6',
                                color: 'bg-lime-500',
                            },
                            {
                                label: 'Healthy',
                                range: '0.6 to 1.0',
                                color: 'bg-green-600',
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center justify-between gap-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`h-4 w-4 rounded ${item.color}`}
                                    />

                                    <span className="text-sm font-medium text-gray-700">
                                        {item.label}
                                    </span>
                                </div>

                                <span className="text-sm text-gray-500">
                                    {item.range}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* DATA INFORMATION */}

            <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <Info
                    className="mt-0.5 shrink-0 text-blue-600"
                    size={20}
                />

                <div>
                    <h3 className="text-sm font-semibold text-blue-900">
                        Understanding the satellite data
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-blue-800">
                        Satellite imagery is loaded from NASA GIBS.
                        The displayed MODIS imagery has approximately
                        250 m resolution. NDVI is shown as a satellite
                        raster layer, not as an average calculated
                        specifically for your field. Cloud cover,
                        satellite acquisition dates and data availability
                        can affect the imagery.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default SatelliteImagery
