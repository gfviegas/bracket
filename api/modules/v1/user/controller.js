const rfr = require('rfr')
const actionsPath = './actions/'
const Model = require('./model').model
const extend = require('extend')
const createQueryObject = rfr('helpers/request').createQueryObject

const controllerActions = {}

// Import default actions
const importActions = ['create', 'findById', 'findOneAndUpdate', 'update', 'remove', 'checkExists']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)

// Controller custom actions
const customMethods = {
  find: (req, res) => {
    let query = createQueryObject(req)

    if (req.query.filter && req.query.filter.length) {
      let regex = new RegExp(req.query.filter, 'i')
      query = Object.assign(query, {
        '$or': [
          {name: regex},
          {username: regex},
          {email: regex}
        ]
      })
    }

    const pagOptions = {
      page: (Number.parseInt(req.query.page) - 1) || 0,
      limit: Number.parseInt(req.query.limit) || 15,
      sort: req.query.sort || {'name': 'asc'}
    }

    Model
      .find(query)
      .count()
      .exec((err, count) => {
        if (err) throw err
        const meta = {
          currentPage: (pagOptions.page + 1),
          limit: pagOptions.limit,
          totalPages: Math.ceil(count / pagOptions.limit),
          count: count
        }
        Model
          .find(query)
          .sort(pagOptions.sort)
          .skip(pagOptions.page * pagOptions.limit)
          .limit(pagOptions.limit)
          .exec((err, data) => {
            if (err) throw err
            const response = {
              users: data,
              meta: meta
            }
            res.status(200).json(response)
          })
      })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
