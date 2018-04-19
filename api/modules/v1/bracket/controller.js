const rfr = require('rfr')
const actionsPath = './actions/'
const extend = require('extend')
const Model = require('./model').model
const ObjectId = require('mongoose').Types.ObjectId

const controllerActions = {}

// Import default actions
const importActions = ['create', 'findOneAndUpdate', 'find', 'findById', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)

// Controller custom actions
const customMethods = {
  findByIdOrSlug: (req, res) => {
    const query = (ObjectId.isValid(req.params.id)) ? {_id: req.params.id} : {slug: req.params.id}
    Model.findOne(query, (err, data) => {
      if (err) throw err
      if (!data) return res.status(404).json({error: 'bracket_not_found'})
      res.status(200).json(data)
    })
  },
  checkExists: (req, res) => {
    Model
      .count(req.body)
      .exec((err, value) => {
        if (err) throw err
        res.status(200).json({exists: !!(value >= 1)})
      })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
