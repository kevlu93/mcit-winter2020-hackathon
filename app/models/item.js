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