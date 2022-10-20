const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    auther:{
        type:mongoose.SchemaTypes.ObjectId, // refrence to user profile page
        ref:"usersProfileData",
        required:true
    },
    commentDate:{
        type:Date,
        required:true,
        default:()=>Date.now()
    },
    commentContaint:{
        type:String,
        required:true
    }
},

);

const commentModel = mongoose.model("PostComments",commentSchema);
module.exports = commentModel;