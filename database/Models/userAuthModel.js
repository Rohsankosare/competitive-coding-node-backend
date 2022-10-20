const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userAuthSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is requried"],
      
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "email is required for sign up"],
      unique: [true,"email already exists"],
      validate: [isEmail, "please enter valid email"],
    },

    // reference to user profile collection it will store id of profile doc of this user
    userProfileDocId:{
      type:mongoose.SchemaTypes.ObjectId,
      ref:"usersProfileData",
      immutable:true
    }

   
  }
  

 
);

const userAuthModel = mongoose.model("usersAuthData", userAuthSchema);
module.exports = userAuthModel;
