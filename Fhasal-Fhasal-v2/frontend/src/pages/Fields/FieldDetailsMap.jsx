
import React from 'react'

import {
    MapContainer,
    TileLayer,
    Polygon,
    CircleMarker,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import { useSettings } from '../../context/SettingsContext'

const mapTranslations = {
    en: {
        noBoundary: 'No boundary information available.',
    },
    hi: {
        noBoundary: 'खेत की सीमा की जानकारी उपलब्ध नहीं है।',
    },
    kn: {
        noBoundary: 'ಜಮೀನಿನ ಗಡಿ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.',
    },
    mr: {
        noBoundary: 'शेताच्या सीमेची माहिती उपलब्ध नाही.',
    },
    te: {
        noBoundary: 'పొలం సరిహద్దు సమాచారం అందుబాటులో లేదు.',
    },
    ta: {
        noBoundary: 'வயல் எல்லைத் தகவல் கிடைக்கவில்லை.',
    },
    bn: {
        noBoundary: 'জমির সীমানার তথ্য উপলব্ধ নেই।',
    },
}

const FieldDetailsMap = ({ boundary }) => {
    const { settings } = useSettings()

    const languageCode = settings.languageCode || 'en'

    const t = (key) =>
        mapTranslations[languageCode]?.[key] ??
        mapTranslations.en[key]

    // Check whether valid boundary information exists.
    if (
        !Array.isArray(boundary) ||
        boundary.length < 3 ||
        !boundary.every(
            (point) =>
                Array.isArray(point) &&
                point.length >= 2 &&
                Number.isFinite(Number(point[0])) &&
                Number.isFinite(Number(point[1]))
        )
    ) {
        return (
            <div className="h-64 flex items-center justify-center bg-[#F7F9F6] rounded-xl">
                <p className="text-sm text-[#829187]">
                    {t('noBoundary')}
                </p>
            </div>
        )
    }

    // Calculate the map centre from boundary points.
    const center = [
        boundary.reduce(
            (sum, point) => sum + Number(point[0]),
            0
        ) / boundary.length,

        boundary.reduce(
            (sum, point) => sum + Number(point[1]),
            0
        ) / boundary.length,
    ]

    return (
        <div className="h-80 rounded-xl overflow-hidden border border-[#E5EAE1]">
            <MapContainer
                center={center}
                zoom={15}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Display farm boundary */}
                <Polygon
                    positions={boundary}
                    pathOptions={{
                        color: '#347052',
                        weight: 3,
                        fillColor: '#347052',
                        fillOpacity: 0.25,
                    }}
                />

                {/* Display boundary markers */}
                {boundary.map((point, index) => (
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
    )
}

export default FieldDetailsMap
