
import React, { useState, useEffect } from 'react'
import {
    Settings as SettingsIcon,
    User,
    Globe,
    Ruler,
    Bell,
    CloudRain,
    Sprout,
    ShieldCheck,
    Save,
    RotateCcw,
    CheckCircle,
} from 'lucide-react'

const DEFAULT_SETTINGS = {
    language: 'English',
    areaUnit: 'Acre',
    preferences: {
        notifications: true,
        weatherAlerts: true,
        irrigationReminders: true,
        cropUpdates: true,
        farmingAdvisories: false,
    },
}

const loadSettings = () => {
    try {
        const savedSettings = localStorage.getItem('fhasal-settings')

        if (!savedSettings) {
            return DEFAULT_SETTINGS
        }

        const parsedSettings = JSON.parse(savedSettings)

        return {
            language: parsedSettings.language || DEFAULT_SETTINGS.language,
            areaUnit: parsedSettings.areaUnit || DEFAULT_SETTINGS.areaUnit,
            preferences: {
                ...DEFAULT_SETTINGS.preferences,
                ...(parsedSettings.preferences || {}),
            },
        }
    } catch (error) {
        console.error('Unable to load settings:', error)
        return DEFAULT_SETTINGS
    }
}

const Settings = () => {
    const [settings, setSettings] = useState(loadSettings)
    const [saved, setSaved] = useState(false)

    const { language, areaUnit, preferences } = settings

    useEffect(() => {
        setSaved(false)
    }, [settings])

    const updateSetting = (key, value) => {
        setSettings((previous) => ({
            ...previous,
            [key]: value,
        }))
    }

    const handlePreferenceChange = (key) => {
        setSettings((previous) => ({
            ...previous,
            preferences: {
                ...previous.preferences,
                [key]: !previous.preferences[key],
            },
        }))
    }

    const handleSave = () => {
        try {
            localStorage.setItem(
                'fhasal-settings',
                JSON.stringify(settings)
            )

            setSaved(true)
        } catch (error) {
            console.error('Unable to save settings:', error)
            setSaved(false)
        }
    }

    const handleReset = () => {
        setSettings({
            ...DEFAULT_SETTINGS,
            preferences: { ...DEFAULT_SETTINGS.preferences },
        })

        setSaved(false)
    }

    const preferenceItems = [
        {
            key: 'notifications',
            title: 'Push Notifications',
            description: 'Receive notifications about your farming activities.',
            icon: Bell,
        },
        {
            key: 'weatherAlerts',
            title: 'Weather Alerts',
            description: 'Receive updates about rainfall and weather conditions.',
            icon: CloudRain,
        },
        {
            key: 'irrigationReminders',
            title: 'Irrigation Reminders',
            description: 'Get reminders to check your irrigation schedule.',
            icon: Ruler,
        },
        {
            key: 'cropUpdates',
            title: 'Crop Updates',
            description: 'Receive updates about crop recommendations and planning.',
            icon: Sprout,
        },
        {
            key: 'farmingAdvisories',
            title: 'Farming Advisories',
            description: 'Receive general farming tips and advisory information.',
            icon: ShieldCheck,
        },
    ]

    return (
        <div className="min-h-screen bg-[#F7F9F5] p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <div className="mb-8">

                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#347052]">
                    <SettingsIcon size={17} />
                    Application Preferences
                </div>

                <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                    Settings
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Manage your account preferences and farming application settings.
                </p>

            </div>

            <div className="mx-auto max-w-5xl space-y-6">

                {/* Profile */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-[#EAF3EB] p-3 text-[#347052]">
                            <User size={22} />
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-800">
                                Account Information
                            </h2>

                            <p className="text-sm text-gray-500">
                                Your account overview
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-[#F8FAF7] p-4">
                        <p className="text-sm font-semibold text-gray-700">
                            Fhasal User
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Profile management will be available after authentication integration.
                        </p>
                    </div>

                </section>

                {/* General Preferences */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-[#EAF3EB] p-3 text-[#347052]">
                            <Globe size={22} />
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-800">
                                General Preferences
                            </h2>

                            <p className="text-sm text-gray-500">
                                Customize your application experience.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Application Language
                            </label>

                            <select
                                value={language}
                                onChange={(e) => updateSetting('language', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#347052]"
                            >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Kannada">Kannada</option>
                                <option value="Marathi">Marathi</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Telugu">Telugu</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Area Measurement Unit
                            </label>

                            <select
                                value={areaUnit}
                                onChange={(e) => updateSetting('areaUnit', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#347052]"
                            >
                                <option value="Acre">Acre</option>
                                <option value="Hectare">Hectare</option>
                                <option value="Guntha">Guntha</option>
                            </select>
                        </div>

                    </div>

                </section>

                {/* Notification Preferences */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-[#FFF5DF] p-3 text-[#B68A35]">
                            <Bell size={22} />
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-800">
                                Notification Preferences
                            </h2>

                            <p className="text-sm text-gray-500">
                                Choose which updates you want to receive.
                            </p>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">

                        {preferenceItems.map((item) => {
                            const Icon = item.icon

                            return (
                                <div
                                    key={item.key}
                                    className="flex items-center justify-between gap-4 py-4"
                                >

                                    <div className="flex min-w-0 items-center gap-3">

                                        <div className="rounded-lg bg-gray-50 p-2.5 text-[#347052]">
                                            <Icon size={19} />
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-800">
                                                {item.title}
                                            </h3>

                                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                                {item.description}
                                            </p>
                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={preferences[item.key]}
                                        onClick={() => handlePreferenceChange(item.key)}
                                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                            preferences[item.key]
                                                ? 'bg-[#347052]'
                                                : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                                preferences[item.key]
                                                    ? 'left-6'
                                                    : 'left-1'
                                            }`}
                                        />
                                    </button>

                                </div>
                            )
                        })}

                    </div>

                </section>

                {/* Privacy */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                    <div className="flex items-start gap-3">

                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <ShieldCheck size={22} />
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-800">
                                Privacy and Security
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Your field information and preferences are currently
                                stored locally in this browser. Account security and
                                cloud synchronization will require backend integration.
                            </p>
                        </div>

                    </div>

                </section>

                {/* Actions */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <button
                        onClick={handleReset}
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                        <RotateCcw size={17} />
                        Reset Settings
                    </button>

                    <button
                        onClick={handleSave}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#347052] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#28583F]"
                    >
                        <Save size={17} />
                        Save Settings
                    </button>

                </div>

                {saved && (
                    <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                        <CheckCircle size={19} />
                        Settings saved successfully in this browser.
                    </div>
                )}

            </div>

        </div>
    )
}

export default Settings
