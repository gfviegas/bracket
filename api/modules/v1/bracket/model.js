const mongoose = require('mongoose')
const modelName = 'bracket'

const structure = {
  slug: {
    unique: true,
    required: true,
    type: String
  },
  title: {
    unique: true,
    required: false,
    type: String
  },
  description: {
    unique: true,
    required: false,
    type: String
  },
  options: [{
    label: {
      required: false,
      type: String
    },
    image: {
      required: true,
      type: String
    },
    order: {
      required: false,
      type: Number,
      default: 0
    }
  }]
}

const options = {
  strict: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}

const schema = mongoose.Schema(structure, options)
const model = mongoose.model(modelName, schema)

module.exports = {
  schema: schema,
  model: model
}
