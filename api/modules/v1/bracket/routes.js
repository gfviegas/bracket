const rfr = require('rfr')
const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')

const jwtMiddleware = rfr('/helpers/jwt').middleware

// Get
router.get('/', controller.find)

// Get by Id
router.get('/:id', [], controller.findByIdOrSlug)

// Create
router.post('/', [jwtMiddleware, validators.create, validators.uniqueSlugValidator], controller.create)

// Update
router.put('/', [jwtMiddleware], controller.findOneAndUpdate)

// Check if exists
router.post('/check', [jwtMiddleware, validators.slugCheck], controller.checkExists)

module.exports = router
