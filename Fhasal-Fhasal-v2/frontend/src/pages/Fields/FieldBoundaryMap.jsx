
import React, { useState } from 'react'
import {
    MapContainer,
    TileLayer,
    Polygon,
    CircleMarker,
    useMapEvents,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import { useSettings } from '../../context/SettingsContext'

const mapTranslations = {
    en: {
        instructions: 'Click on the map to mark your farmland boundary.',
        minimum: 'At least 3 points are required.',
        points: 'Points marked:',
        undo: 'Undo Last Point',
        clear: 'Clear Boundary',
    },
    hi: {
        instructions: 'अपने खेत की सीमा चिह्नित करने के लिए मानचित्र पर क्लिक करें।',
        minimum: 'कम से कम 3 बिंदु आवश्यक हैं।',
        points: 'चिह्नित बिंदु:',
        undo: 'अंतिम बिंदु हटाएं',
        clear: 'सीमा साफ़ करें',
    },
    kn: {
        instructions: 'ನಿಮ್ಮ ಕೃಷಿಭೂಮಿಯ ಗಡಿಯನ್ನು ಗುರುತಿಸಲು ನಕ್ಷೆಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.',
        minimum: 'ಕನಿಷ್ಠ 3 ಬಿಂದುಗಳು ಅಗತ್ಯವಿದೆ.',
        points: 'ಗುರುತಿಸಿದ ಬಿಂದುಗಳು:',
        undo: 'ಕೊನೆಯ ಬಿಂದುವನ್ನು ರದ್ದುಗೊಳಿಸಿ',
        clear: 'ಗಡಿಯನ್ನು ತೆರವುಗೊಳಿಸಿ',
    },
    mr: {
        instructions: 'तुमच्या शेताची सीमा दाखवण्यासाठी नकाशावर क्लिक करा.',
        minimum: 'किमान 3 बिंदू आवश्यक आहेत.',
        points: 'निवडलेले बिंदू:',
        undo: 'शेवटचा बिंदू काढा',
        clear: 'सीमा पुसून टाका',
    },
    te: {
        instructions: 'మీ వ్యవసాయ భూమి సరిహద్దును గుర్తించడానికి మ్యాప్‌పై క్లిక్ చేయండి.',
        minimum: 'కనీసం 3 పాయింట్లు అవసరం.',
        points: 'గుర్తించిన పాయింట్లు:',
        undo: 'చివరి పాయింట్‌ను తొలగించండి',
        clear: 'సరిహద్దును తొలగించండి',
    },
    ta: {
        instructions: 'உங்கள் விவசாய நிலத்தின் எல்லையைக் குறிக்க வரைபடத்தில் கிளிக் செய்யவும்.',
        minimum: 'குறைந்தது 3 புள்ளிகள் தேவை.',
        points: 'குறிக்கப்பட்ட புள்ளிகள்:',
        undo: 'கடைசிப் புள்ளியை நீக்கவும்',
        clear: 'எல்லையை அழிக்கவும்',
    },
    bn: {
        instructions: 'আপনার কৃষিজমির সীমানা চিহ্নিত করতে মানচিত্রে ক্লিক করুন।',
        minimum: 'কমপক্ষে ৩টি পয়েন্ট প্রয়োজন।',
        points: 'চিহ্নিত পয়েন্ট:',
        undo: 'শেষ পয়েন্টটি সরান',
        clear: 'সীমানা মুছুন',
    },
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

    const languageCode = settings.languageCode || 'en'
    const t = mapTranslations[languageCode] || mapTranslations.en

    // Load existing boundary if available
    const [points, setPoints] = useState(() => initialBoundary || [])

    // Set map center based on existing boundary
    const mapCenter = points.length > 0
        ? points[0]
        : [20.5937, 78.9629]

    // Set zoom based on boundary availability
    const mapZoom = points.length > 0 ? 15 : 10

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

            {/* Map */}
            <div className="h-[420px] w-full overflow-hidden rounded-xl border border-[#DCE5DA]">

                <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Handle map clicks */}
                    <MapClickHandler
                        onMapClick={handleMapClick}
                    />

                    {/* Display farmland boundary */}
                    {points.length >= 3 && (
                        <Polygon
                            positions={points}
                            pathOptions={{
                                color: '#347052',
                                fillColor: '#6FA783',
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
                                fillColor: '#347052',
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

                    <span className="block mt-1">
                        {t.minimum}
                    </span>

                    <span className="block mt-1">
                        {t.points} {points.length}
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
