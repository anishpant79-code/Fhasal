const Field = require('../models/Field')

// Convert MongoDB documents to the format expected by the frontend
const formatField = (field) => {
    const data = field.toObject()
    data.id = data._id.toString()
    data._id = data._id.toString()
    delete data.__v
    return data
}

const ALLOWED_FIELD_KEYS = [
    'fieldName',
    'fieldArea',
    'areaUnit',
    'fieldLocation',
    'soilType',
    'currentCrop',
    'sowingDate',
    'cropStage',
    'irrigationType',
    'notes',
    'boundary',
]

// CREATE FIELD
const createField = async (req, res) => {
    try {
        const {
            fieldName,
            fieldArea,
            areaUnit,
            fieldLocation,
            soilType,
            currentCrop,
            sowingDate,
            cropStage,
            irrigationType,
            notes,
            boundary,
        } = req.body

        if (
            !fieldName ||
            fieldArea === undefined ||
            !fieldLocation ||
            !boundary
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required field details.',
            })
        }

        const normalizedUnit = String(areaUnit || 'acre').toLowerCase()

        const field = await Field.create({
            owner: req.user._id,
            fieldName: String(fieldName).trim(),
            fieldArea: Number(fieldArea),
            areaUnit: normalizedUnit,
            fieldLocation: String(fieldLocation).trim(),
            soilType: soilType ? String(soilType).trim() : '',
            currentCrop: currentCrop ? String(currentCrop).trim() : '',
            sowingDate: sowingDate ? new Date(sowingDate) : null,
            cropStage: cropStage ? String(cropStage).trim().toLowerCase() : '',
            irrigationType: irrigationType ? String(irrigationType).trim().toLowerCase() : '',
            notes: notes ? String(notes).trim() : '',
            boundary,
        })

        return res.status(201).json({
            success: true,
            message: 'Field registered successfully.',
            field: formatField(field),
        })
    } catch (error) {
        console.error('Create field error:', error.message)

        return res.status(400).json({
            success: false,
            message: error.message || 'Unable to register field.',
        })
    }
}

// GET ALL FIELDS FOR LOGGED-IN USER
const getFields = async (req, res) => {
    try {
        const fields = await Field.find({
            owner: req.user._id,
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            count: fields.length,
            fields: fields.map(formatField),
        })
    } catch (error) {
        console.error('Get fields error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to retrieve fields.',
        })
    }
}

// GET SINGLE FIELD BY ID
const getFieldById = async (req, res) => {
    try {
        const field = await Field.findOne({
            _id: req.params.id,
            owner: req.user._id,
        })

        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found.',
            })
        }

        return res.status(200).json({
            success: true,
            field: formatField(field),
        })
    } catch (error) {
        console.error('Get field by id error:', error.message)
        const status = error.name === 'CastError' ? 404 : 500
        return res.status(status).json({
            success: false,
            message: error.name === 'CastError' ? 'Invalid field ID.' : 'Unable to retrieve field.',
        })
    }
}

// UPDATE FIELD
const updateField = async (req, res) => {
    try {
        const field = await Field.findOne({
            _id: req.params.id,
            owner: req.user._id,
        })

        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found.',
            })
        }

        ALLOWED_FIELD_KEYS.forEach((key) => {
            if (req.body[key] !== undefined) {
                if (key === 'fieldArea') {
                    field[key] = Number(req.body[key])
                } else if (key === 'areaUnit') {
                    field[key] = String(req.body[key]).toLowerCase()
                } else if (key === 'sowingDate') {
                    field[key] = req.body[key] ? new Date(req.body[key]) : null
                } else if (typeof req.body[key] === 'string') {
                    field[key] = req.body[key].trim()
                } else {
                    field[key] = req.body[key]
                }
            }
        })

        await field.save()

        return res.status(200).json({
            success: true,
            message: 'Field updated successfully.',
            field: formatField(field),
        })
    } catch (error) {
        console.error('Update field error:', error.message)

        const status = error.name === 'CastError' ? 404 : 400

        return res.status(status).json({
            success: false,
            message: error.message || 'Unable to update field.',
        })
    }
}

// DELETE FIELD
const deleteField = async (req, res) => {
    try {
        const field = await Field.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        })

        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found.',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Field deleted successfully.',
        })
    } catch (error) {
        console.error('Delete field error:', error.message)

        const status = error.name === 'CastError' ? 404 : 400

        return res.status(status).json({
            success: false,
            message: 'Unable to delete field.',
        })
    }
}

module.exports = {
    createField,
    getFields,
    getFieldById,
    updateField,
    deleteField,
}
