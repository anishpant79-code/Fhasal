import React from 'react'
import { Bell, CloudRain, Droplets, Sprout, Lightbulb } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export const NotificationSettings = () => {
    const { settings, updatePreference } = useSettings()
    const preferences = settings?.preferences || {}

    const items = [
        { key: 'notifications', label: 'General Notifications', icon: Bell },
        { key: 'weatherAlerts', label: 'Weather Alerts', icon: CloudRain },
        { key: 'irrigationReminders', label: 'Irrigation Reminders', icon: Droplets },
        { key: 'cropUpdates', label: 'Crop Growth Updates', icon: Sprout },
        { key: 'farmingAdvisories', label: 'Farming Advisories', icon: Lightbulb },
    ]

    return (
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <Bell className="text-[#174B35]" size={22} />
                <div>
                    <h2 className="font-semibold text-gray-800">Notification Preferences</h2>
                    <p className="text-sm text-gray-500">Configure alerts and advisory notifications</p>
                </div>
            </div>

            <div className="divide-y divide-gray-100">
                {items.map(({ key, label, icon: Icon }) => {
                    const enabled = Boolean(preferences[key])
                    return (
                        <div key={key} className="flex items-center justify-between py-3.5">
                            <div className="flex items-center gap-3">
                                <Icon size={18} className="text-[#174B35]" />
                                <span className="text-sm font-medium text-gray-700">{label}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => updatePreference(key, !enabled)}
                                className={`relative h-6 w-11 rounded-full transition ${
                                    enabled ? 'bg-[#174B35]' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                        enabled ? 'left-6' : 'left-1'
                                    }`}
                                />
                            </button>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default NotificationSettings
