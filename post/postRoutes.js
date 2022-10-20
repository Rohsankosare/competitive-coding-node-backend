const express = require("express");
const authenticateUser = require("../auth/authenticationToken");
const commentModel = require("../database/Models/commentsModel");
const postModel = require("../database/Models/postModel");

const userProfileModel = require("../database/Models/userProfileModel");

const postRoutes = express.Router();

postRoutes.post("/createpost", authenticateUser, async (req, res) => {
  try {
    const postTitle = req.body.postTitle;
    const tags = req.body.tags;
    const postContaint = req.body.postContaint;
    const auther = await userProfileModel.findById(req.user.userObjectId);
    // const username = req.user.username;

    postModel
      .create({
        title: postTitle,
        postContaint: postContaint,
        tags: tags,
        auther: auther["_id"],
      })
      .then(async (post) => {
        // update user profile add this post ref to user profile posts array field
        await auther.update({ $push: { posts: post["_id"] } });
        await auther.save();
        res.json({ success: true, message: "post created sucessfully" });
      })
      .catch((err) => {
        res.json({ success: false, err });
      });
  } catch (err) {
    res.json({ success: false, err });
  }
});

postRoutes.get("/getposts", async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .select("_id title createdAt auther tags")
      .populate("auther", "username");

    res.json({ posts });
  } catch (err) {
    res.json({ err });
  }
});

postRoutes.get("/getpost", async (req, res) => {
  try {
    const postId = req.query.postId;

    const posts = await postModel
      .findById(postId)
      .populate("auther", "username _id ");
      const comments = await postModel
      .findById(postId).select("comments")
      .populate({path:"comments",
      populate:{
        path:"auther",
        model:"usersProfileData",
        select:"username email"
      }
    });

    res.json({posts,comments});
  } catch (err) {
    console.log(err)
    res.json({ err });
  }
});

postRoutes.post("/createcomment", authenticateUser, async (req, res) => {
  try {
    const commentBody = req.body.commentBody;
    const postId = req.body.postId;
    const userId = req.user.userObjectId;
    const post = await postModel.findById(postId);

    commentModel
      .create({
        auther: userId,
        commentContaint: commentBody,
      })
      .then(async (comment) => {
        await post.update({ $push: { comments: comment["_id"] } });
        await post.save();
        res.json({ success: true, message: "comment saved " });
      });
  } catch (err) {
    res.json({ err });
  }
});

module.exports = postRoutes;
