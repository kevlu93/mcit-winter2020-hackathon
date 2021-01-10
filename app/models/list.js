const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
    name: String
    , createdBy: {type: mongoose.Schema.ObjectId, ref: 'User'}
    , todo: [{type: mongoose.Schema.ObjectId, ref: 'Item'}]
    , completed: [{type: mongoose.Schema.ObjectId, ref: 'Item'}]
});

module.exports = mongoose.model('List', listSchema);