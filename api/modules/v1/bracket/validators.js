const rfr = require('rfr')
const handleValidation = rfr('/helpers/validation')
const Model = require('./model').model

const uniqueSlugValidator = (req, res, next) => {
  const {slug} = req.body
  if (!slug) return next()
  Model
    .findOne({slug})
    .exec((err, modelInstance) => {
      if (err) throw err

      if (!modelInstance) {
        next()
      } else {
        const errorMessage = {
          'slug': {
            param: 'slug',
            msg: {
              error: 'unique'
            }
          }
        }
        res.status(409).json(errorMessage)
        return false
      }
    })
}

const titleValidators = (req) => {
  req.checkBody('title', {error: 'required'}).notEmpty()
  req.checkBody('title', {error: 'length', min: 3, max: 350}).len(3, 350)
}
const slugValidators = (req) => {
  req.checkBody('slug', {error: 'required'}).notEmpty()
  req.checkBody('slug', {error: 'length', min: 3, max: 350}).len(3, 350)
}
const descriptionValidators = (req) => {
  req.checkBody('description', {error: 'required'}).notEmpty()
  req.checkBody('description', {error: 'length', min: 3, max: 350}).len(3, 350)
}
const bracketValidator = (req) => {
  titleValidators(req)
  slugValidators(req)
  descriptionValidators(req)
}

module.exports = {
  create: (req, res, next) => {
    bracketValidator(req)
    handleValidation(req, res, next)
  },
  update: (req, res, next) => {
    // req.checkBody('name', {error: 'length', min: 4, max: 20}).len(4, 20)
    // req.checkBody('email', {error: 'invalid'}).isEmail()
  },
  slugCheck: (req, res, next) => {
    slugValidators(req)
    handleValidation(req, res, next)
  },
  uniqueSlugValidator
}
