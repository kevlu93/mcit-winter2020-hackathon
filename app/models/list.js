/**
 * Creates the List schema. A List knows the User who created it, and keeps track of two arrays.
 * One array contains Item objects that have not been completed yet (todo)
 * The other array contains Item objects that have been completed (completed) 
 * Potential future revisions include constructing Items as subdocuments of Lists, and Lists as subdocuments of Users
 */
const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    name: String
    , createdBy: {type: mongoose.Schema.ObjectId, ref: 'User'}
    , todo: [{type: mongoose.Schema.ObjectId, ref: 'Item'}]
    , completed: [{type: mongoose.Schema.ObjectId, ref: 'Item'}]
});

module.exports = mongoose.model('List', listSchema);