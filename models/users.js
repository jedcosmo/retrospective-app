var mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
  userId: {type: String, default: ""},
  firstName: {type: String, default: ""},
  lastName: {type: String, default: ""},
  emailVerified: { type: Boolean, default: false },
  avatar: {type: String, default: ""},
  createdAt: {type: String, default: ""},
  updatedAt: {type: String, default: ""},
  lastLoggedIn: {type: String, default: ""}
},
{
    timestamps: true
});

module.exports = mongoose.model('Users', retrospectiveSchema);
