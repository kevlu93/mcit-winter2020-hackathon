/**
 * Creates the Item schema
 * Items know the user who created them, as well as the list they are in
 * They also know whether they have been completed or not
 * Potential future revisions would be to restructure items as a subdocument of lists
 */
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name : {
      type : String,
      required : [true, "Task Text must be provided"]
    }
    , createdBy : {type: mongoose.Schema.Types.ObjectId, ref: 'User'} 
    , listName : String
    , listId : {type: mongoose.Schema.Types.ObjectId, ref: 'List'}   
    , completed : Boolean
  });

module.exports = mongoose.model('Item', itemSchema);