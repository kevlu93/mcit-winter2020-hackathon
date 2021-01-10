const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name : {
      type : String,
      required : [true, "Task Text must be provided"]
    }
    , createdBy : {type: mongoose.Schema.Types.ObjectId, ref: 'User'} 
    , listName : String   
  });

module.exports = mongoose.model('Item', itemSchema);