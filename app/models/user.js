/**
 * Generates the User model for our database
 * A user simply contains their username and password
 */
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// define the schema for our user model
const userSchema = new mongoose.Schema({

    local : {
        username : String,
        password : String,
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};



// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);