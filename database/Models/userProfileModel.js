const mongoose = require("mongoose");

const userProfileSchema = mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },

  // reference to posts collection it will store objects ids of posts
// this field store object id of posts created by user itself
  posts:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"usersPosts"
    }
  ]
}
);

const userProfileModel = mongoose.model("usersProfileData", userProfileSchema);
module.exports = userProfileModel;
