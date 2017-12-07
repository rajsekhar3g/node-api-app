var mongoose = require('mongoose');

var schema = mongoose.Schema,
objectId = schema.ObjectId;

var userSchema = new schema({
id:objectId,
first_name:String,
last_name:String,
email_address:String,
career:String
});

var userModel = mongoose.model('users',userSchema);

module.exports = userModel;