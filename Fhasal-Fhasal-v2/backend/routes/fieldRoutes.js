const express = require('express')

const {
    createField,
    getFields,
    getFieldById,
    updateField,
    deleteField,
} = require('../controllers/fieldController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// Get all fields and create a new field
router.route('/')
    .get(protect, getFields)
    .post(protect, createField)

// Get single field, update and delete a specific field
router.route('/:id')
    .get(protect, getFieldById)
    .put(protect, updateField)
    .delete(protect, deleteField)

module.exports = router
