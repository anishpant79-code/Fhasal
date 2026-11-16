
import React, { useState, useEffect } from 'react'
import {
    MapContainer,
    TileLayer,
    Polygon,
    CircleMarker,
    useMapEvents,
    useMap,
} from 'react-leaflet'
import { Search, MapPin, Satellite, Map as MapIcon, Loader2 } from 'lucide-react'

import 'leaflet/dist/leaflet.css'
import { useSettings } from '../../context/SettingsContext'

const mapTranslations = {
    en: {
        instructions: 'Click on the map to mark your farmland boundary.',
        minimum: 'At least 3 points are required.',
        points: 'Points marked:',
        undo: 'Undo Last Point',
        clear: 'Clear Boundary',
        searchPlaceholder: 'Search village, taluka or district to jump...',
        satellite: 'Satellite',
        street: 'Street',
    },
    hi: {
        instructions: 'अपने खेत की सीमा चिह्नित करने के लिए मानचित्र पर क्लिक करें।',
        minimum: 'कम से कम 3 बिंदु आवश्यक हैं।',
        points: 'चिह्नित बिंदु:',
        undo: 'अंतिम बिंदु हटाएं',
        clear: 'सीमा साफ़ करें',
        searchPlaceholder: 'अपने गाँव या जिले का नाम खोजें...',
        satellite: 'सैटेलाइट',
        street: 'नक्शा',
    },
    kn: {
        instructions: 'ನಿಮ್ಮ ಕೃಷಿಭೂಮಿಯ ಗಡಿಯನ್ನು ಗುರುತಿಸಲು ನಕ್ಷೆಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.',
        minimum: 'ಕನಿಷ್ಠ 3 ಬಿಂದುಗಳು ಅಗತ್ಯವಿದೆ.',
        points: 'ಗುರುತಿಸಿದ ಬಿಂದುಗಳು:',
        undo: 'ಕೊನೆಯ ಬಿಂದುವನ್ನು ರದ್ದುಗೊಳಿಸಿ',
        clear: 'ಗಡಿಯನ್ನು ತೆರವುಗೊಳಿಸಿ',
        searchPlaceholder: 'ಗ್ರಾಮ ಅಥವಾ ಜಿಲ್ಲೆಯನ್ನು ಹುಡುಕಿ...',
        satellite: 'ಉಪಗ್ರಹ',
        street: 'ರಸ್ತೆ ನಕ್ಷೆ',
    },
    mr: {
        instructions: 'तुमच्या शेताची सीमा दाखवण्यासाठी नकाशावर क्लिक करा.',
        minimum: 'किमान 3 बिंदू आवश्यक आहेत.',
        points: 'निवडलेले बिंदू:',
        undo: 'शेवटचा बिंदू काढा',
        clear: 'सीमा पुसून टाका',
        searchPlaceholder: 'गावाचे किंवा जिल्ह्याचे नाव शोधा...',
        satellite: 'उपग्रह',
        street: 'नकाशा',
    },
    te: {
        instructions: 'మీ వ్యవసాయ భూమి సరిహద్దును గుర్తించడానికి మ్యాప్‌పై క్లిక్ చేయండి.',
        minimum: 'కనీసం 3 పాయింట్లు అవసరం.',
        points: 'గుర్తించిన పాయింట్లు:',
        undo: 'చివరి పాయింట్‌ను తొలగించండి',
        clear: 'సరిహద్దును తొలగించండి',
        searchPlaceholder: 'గ్రామం లేదా జిల్లాను వెతకండి...',
        satellite: 'శాటిలైట్',
        street: 'మ్యాప్',
    },
    ta: {
        instructions: 'உங்கள் விவசாய நிலத்தின் எல்லையைக் குறிக்க வரைபடத்தில் கிளிக் செய்யவும்.',
        minimum: 'குறைந்தது 3 புள்ளிகள் தேவை.',
        points: 'குறிக்கப்பட்ட புள்ளிகள்:',
        undo: 'கடைசிப் புள்ளியை நீக்கவும்',
        clear: 'எல்லையை அழிக்கவும்',
        searchPlaceholder: 'கிராமம் அல்லது மாவட்டத்தைத் தேடுங்கள்...',
        satellite: 'செயற்கைக்கோள்',
        street: 'தெரு வரைபடம்',
    },
    bn: {
        instructions: 'আপনার কৃষিজমির সীমানা চিহ্নিত করতে মানচিত্রে ক্লিক করুন।',
        minimum: 'কমপক্ষে ৩টি পয়েন্ট প্রয়োজন।',
        points: 'চিহ্নিত পয়েন্ট:',
        undo: 'শেষ পয়েন্টটি সরান',
        clear: 'সীমানা মুছুন',
        searchPlaceholder: 'গ্রাম বা জেলা অনুসন্ধান করুন...',
        satellite: 'স্যাটেলাইট',
        street: 'মানচিত্র',
    },
}

// Controller to smoothly pan/zoom map to searched location
const MapPanController = ({ target }) => {
    const map = useMap()
    useEffect(() => {
        if (target) {
            map.flyTo(target, 16, { duration: 1.2 })
        }
    }, [map, target])
    return null
}

// Handles clicks on the map
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick([
                e.latlng.lat,
                e.latlng.lng,
            ])
        },
    })

    return null
}

const FieldBoundaryMap = ({
    onBoundaryChange,
    initialBoundary = [],
}) => {
    const { settings } = useSettings()

    const languageCode = settings?.languageCode || 'en'
    const t = mapTranslations[languageCode] || mapTranslations.en

    // Load existing boundary if available
    const [points, setPoints] = useState(() => initialBoundary || [])
    const [mapType, setMapType] = useState('satellite') // default to satellite for parcel visibility
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [panTarget, setPanTarget] = useState(null)

    // Set map center based on existing boundary
    const mapCenter = points.length > 0
        ? points[0]
        : [20.5937, 78.9629]

    const mapZoom = points.length > 0 ? 16 : 5

    const handleSearch = async (e) => {
        e?.preventDefault()
        const q = searchQuery.trim()
        if (q.length < 2) return

        setIsSearching(true)
        try {
            const res = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`
            )
            const data = await res.json()
            setSearchResults(data.results || [])
        } catch (err) {
            console.error('Location search failed:', err)
        } finally {
            setIsSearching(false)
        }
    }

    const selectLocation = (place) => {
        setPanTarget([place.latitude, place.longitude])
        setSearchResults([])
        setSearchQuery(`${place.name}${place.admin1 ? `, ${place.admin1}` : ''}`)
    }

    // Update points and notify parent component
    const updateBoundary = (updatedPoints) => {
        setPoints(updatedPoints)

        if (onBoundaryChange) {
            onBoundaryChange(updatedPoints)
        }
    }

    // Add a boundary point
    const handleMapClick = (coordinates) => {
        const updatedPoints = [...points, coordinates]
        updateBoundary(updatedPoints)
    }

    // Undo the last selected point
    const handleUndo = () => {
        const updatedPoints = points.slice(0, -1)
        updateBoundary(updatedPoints)
    }

    // Clear all boundary points
    const handleClear = () => {
        updateBoundary([])
    }

    return (
        <div className="space-y-3">
            {/* Search Bar & Layer Toggle */}
            <div className="flex flex-col sm:flex-row gap-2 relative">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t.searchPlaceholder}
                            className="w-full pl-9 pr-20 py-2 rounded-xl border border-[#DCE5DA] text-sm focus:outline-none focus:border-[#174B35] bg-white"
                        />
                        <Search size={16} className="absolute left-3 top-2.5 text-[#829187]" />
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="absolute right-1.5 top-1 px-3 py-1 rounded-lg bg-[#174B35] text-white text-xs font-medium hover:bg-[#0f3424] transition-colors disabled:opacity-50"
                        >
                            {isSearching ? <Loader2 size={13} className="animate-spin" /> : 'Search'}
                        </button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#DCE5DA] shadow-lg z-50 overflow-hidden divide-y divide-gray-100 max-h-56 overflow-y-auto">
                            {searchResults.map((place) => (
                                <button
                                    key={place.id}
                                    type="button"
                                    onClick={() => selectLocation(place)}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#EAF4EE] flex items-center justify-between"
                                >
                                    <span className="font-semibold text-[#344334]">
                                        {place.name}
                                        {place.admin1 && <span className="font-normal text-[#7A8475]">, {place.admin1}</span>}
                                    </span>
                                    <span className="text-[10px] text-gray-400">{place.country}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </form>

                {/* Map Type Toggle */}
                <div className="flex rounded-xl border border-[#DCE5DA] overflow-hidden bg-white shrink-0 self-start">
                    <button
                        type="button"
                        onClick={() => setMapType('satellite')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                            mapType === 'satellite'
                                ? 'bg-[#174B35] text-white'
                                : 'text-[#7A8475] hover:bg-gray-50'
                        }`}
                    >
                        <Satellite size={13} />
                        {t.satellite}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMapType('street')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                            mapType === 'street'
                                ? 'bg-[#174B35] text-white'
                                : 'text-[#7A8475] hover:bg-gray-50'
                        }`}
                    >
                        <MapIcon size={13} />
                        {t.street}
                    </button>
                </div>
            </div>

            {/* Map */}
            <div className="h-[430px] w-full overflow-hidden rounded-xl border border-[#DCE5DA] relative">
                <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >
                    {mapType === 'satellite' ? (
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            maxZoom={18}
                        />
                    ) : (
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            maxZoom={19}
                        />
                    )}

                    {/* Fly to searched location */}
                    <MapPanController target={panTarget} />

                    {/* Handle map clicks */}
                    <MapClickHandler onMapClick={handleMapClick} />

                    {/* Display farmland boundary */}
                    {points.length >= 3 && (
                        <Polygon
                            positions={points}
                            pathOptions={{
                                color: '#22c55e',
                                fillColor: '#86efac',
                                fillOpacity: 0.35,
                                weight: 3,
                            }}
                        />
                    )}

                    {/* Display boundary markers */}
                    {points.map((point, index) => (
                        <CircleMarker
                            key={index}
                            center={point}
                            radius={6}
                            pathOptions={{
                                color: '#FFFFFF',
                                weight: 2,
                                fillColor: '#174B35',
                                fillOpacity: 1,
                            }}
                        />
                    ))}
                </MapContainer>
            </div>

            {/* Instructions and Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-[#829187]">
                    {t.instructions}
                    <span className="block mt-0.5">
                        {t.minimum} • <strong className="text-[#344334]">{t.points} {points.length}</strong>
                    </span>
                </p>

                {/* Boundary Controls */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleUndo}
                        disabled={points.length === 0}
                        className="px-4 py-2 rounded-lg border border-[#DCE5DA] text-sm text-[#347052] hover:bg-[#F2F6F1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        {t.undo}
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={points.length === 0}
                        className="px-4 py-2 rounded-lg border border-[#DCE5DA] text-sm text-[#347052] hover:bg-[#F2F6F1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        {t.clear}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FieldBoundaryMap
