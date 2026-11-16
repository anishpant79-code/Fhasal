import { useMemo } from 'react'
import { useFields } from '../FieldContext'
import { useSettings } from '../SettingsContext'
import { useAuth } from '../AuthContext'

const AREA_CONVERSIONS = {
    acre: 4046.8564224,
    hectare: 10000,
    guntha: 101.17141056,
    bigha: 2529.285264,
}

export const useFarmData = () => {
    const { fields = [], loading, error, fetchFields, getFieldById, addField, updateField, deleteField } = useFields()
    const { settings } = useSettings()
    const { user } = useAuth()

    const selectedUnit = String(settings?.areaUnit || 'acre').toLowerCase().replace(/s$/, '')

    const convertArea = (area, fromUnit, toUnit = selectedUnit) => {
        const val = Number(area) || 0
        const from = String(fromUnit || 'acre').toLowerCase().replace(/s$/, '')
        const to = String(toUnit || 'acre').toLowerCase().replace(/s$/, '')

        const fromFactor = AREA_CONVERSIONS[from] || AREA_CONVERSIONS.acre
        const toFactor = AREA_CONVERSIONS[to] || AREA_CONVERSIONS.acre

        return (val * fromFactor) / toFactor
    }

    const totalFarmingArea = useMemo(() => {
        return fields.reduce((sum, field) => {
            const area = field.fieldArea ?? field.area ?? 0
            const unit = field.areaUnit ?? field.unit ?? 'acre'
            return sum + convertArea(area, unit, selectedUnit)
        }, 0)
    }, [fields, selectedUnit])

    const activeCrops = useMemo(() => {
        return fields.filter((f) => f.currentCrop && f.currentCrop.trim().length > 0)
    }, [fields])

    return {
        user,
        fields,
        loading,
        error,
        selectedUnit,
        totalFarmingArea,
        totalFieldsCount: fields.length,
        activeCropsCount: activeCrops.length,
        activeCrops,
        convertArea,
        fetchFields,
        getFieldById,
        addField,
        updateField,
        deleteField,
    }
}

export default useFarmData
