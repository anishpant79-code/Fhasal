const mongoose = require('mongoose')

const fieldSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        fieldName: {
            type: String,
            required: true,
            trim: true,
        },

        fieldArea: {
            type: Number,
            required: true,
            min: 0,
        },

        areaUnit: {
            type: String,
            required: true,
            enum: ['acre', 'hectare', 'guntha', 'bigha'],
            default: 'acre',
            lowercase: true,
        },

        fieldLocation: {
            type: String,
            required: true,
            trim: true,
        },

        soilType: {
            type: String,
            default: '',
            trim: true,
        },

        currentCrop: {
            type: String,
            default: '',
            trim: true,
        },

        sowingDate: {
            type: Date,
            default: null,
        },

        cropStage: {
            type: String,
            enum: ['sowing', 'vegetative', 'flowering', 'maturity', 'harvested', 'fallow', ''],
            default: '',
        },

        irrigationType: {
            type: String,
            enum: ['drip', 'sprinkler', 'flood', 'rainfed', 'canal', 'other', ''],
            default: '',
        },

        notes: {
            type: String,
            default: '',
            trim: true,
        },

        // Stores map coordinates as [latitude, longitude]
        boundary: {
            type: [[Number]],
            required: true,
            validate: {
                validator: function (points) {
                    if (!Array.isArray(points) || points.length < 3) {
                        return false
                    }

                    return points.every((point) =>
                        Array.isArray(point) &&
                        point.length === 2 &&
                        Number.isFinite(point[0]) &&
                        Number.isFinite(point[1]) &&
                        point[0] >= -90 &&
                        point[0] <= 90 &&
                        point[1] >= -180 &&
                        point[1] <= 180
                    )
                },
                message: 'At least three valid boundary points are required',
            },
        },
    },
    {
        timestamps: true,
    }
)

const Field = mongoose.model('Field', fieldSchema)

const devStore = require('../utils/devStore')

const FieldProxy = new Proxy(Field, {
    get(target, prop, receiver) {
        if (mongoose.connection && mongoose.connection.readyState === 1) {
            return Reflect.get(target, prop, receiver)
        }
        if (devStore.FieldModel[prop]) {
            return devStore.FieldModel[prop]
        }
        return Reflect.get(target, prop, receiver)
    },
})

module.exports = FieldProxy
