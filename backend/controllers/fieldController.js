
const Field = require('../models/Field')

// Convert MongoDB documents to the format expected by the frontend
const formatField = (field) => {
    const data = field.toObject()
    data.id = data._id.toString()
    delete data.__v
    return data
}

// CREATE FIELD
const createField = async (req, res) => {
    try {
        const {
            fieldName,
            fieldArea,
            areaUnit,
            fieldLocation,
            soilType,
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

        const field = await Field.create({
            owner: req.user._id,
            fieldName,
            fieldArea: Number(fieldArea),
            areaUnit,
            fieldLocation,
            soilType,
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

        const allowedFields = [
            'fieldName',
            'fieldArea',
            'areaUnit',
            'fieldLocation',
            'soilType',
            'boundary',
        ]

        allowedFields.forEach((key) => {
            if (req.body[key] !== undefined) {
                field[key] = key === 'fieldArea'
                    ? Number(req.body[key])
                    : req.body[key]
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

        const status = error.name === 'CastError' ? 400 : 400

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

        return res.status(400).json({
            success: false,
            message: 'Unable to delete field.',
        })
    }
}

module.exports = {
    createField,
    getFields,
    updateField,
    deleteField,
}
