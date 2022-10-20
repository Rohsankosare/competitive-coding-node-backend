const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  postContaint: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  likes: {
    type: Number,
  },
  tags: {
    type: String,
    required: true,
    enum: [
      "placement",
      "coding",
      "interview",
      "DSA",
      "placements",
      "programing language",
      "carrier",
    ],
  },

  // refrence  to user profile collection  it will store object id of author
  auther: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "usersProfileData",
    require: [true, "username is required for creating post"],
  },

  // reference to comments collection it will store objects ids of comments
  comments:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"PostComments"
  }
  
  ]
});

const postModel = mongoose.model("usersPosts", postSchema);

module.exports = postModel;
