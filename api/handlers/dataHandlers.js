/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

const Users = require('../models/Users');
const Posts = require('../models/Posts');
const Notifications = require('../models/Notifications');
const Comments = require('../models/Comments');
const { authorizedUserToken } = require('../../util/validators');

exports.getAllPosts = async (req, res) => {
  //  - Gets posts for home page
  try {
    const getAllPosts = await Posts.find({});
    return res
      .status(201)
      .json({ postsCount: getAllPosts.length, posts: getAllPosts.reverse() });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ posts: 'could not get all posts' });
  }
};

exports.getOnePost = async (req, res) => {
  //  - Gets one post for notification click
  try {
    const getPost = await Posts.findById(req.params.postId);
    res.status(200).json({ post: getPost });
  } catch (err) {
    console.log(err);
    res.status(404).json({ post: 'post could not be found' });
  }
};

exports.createOnePost = (req, res) => {
  // - Save new post created by user
  const newPost = new Posts({
    username: req.params.username,
    body: req.body.body
  });
  try {
    const addNewPost = newPost.save((err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ post: 'something went wrong when saving your post' });
      }

      res.status(201).json({ post: 'post has been created' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ post: 'your post could not be created' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    // - find requesting user and post
    const foundPost = await Posts.findById(req.params.postId);
    // - this is a fallback for the client-side time restriction ( 1 hour limit )
    if (Date.now() > foundPost.createdAt.getTime() + 3600000) {
      console.log('========= USER ATTEMPTED TO DELETE LOCKED POST =========');
      return res
        .status(401)
        .json({ editPost: 'post cannot be deleted after one hour' });
    }
    const foundUser = await Users.findOne({ username: req.params.username });
    // - checks for tampered/bad token
    const tokenVerified = await authorizedUserToken(req.headers, req.params);
    // - verifies token against requester name
    if (foundPost.username !== foundUser.username || !tokenVerified) {
      console.log('============== WRONG USER TO DELETE POST =================');
      return res.status(401).json({
        deletePost:
          'cannot delete posts that have not been created by this user'
      });
    }
    // - after verified user is permitted to remove the post (time restriction created client-side)
    const removePost = await Posts.findByIdAndDelete(
      foundPost._id,
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          return res
            .status(200)
            .json({ deletePost: `post ${req.params.postId} has been deleted` });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ deletePost: 'post could not be deleted' });
  }
};

exports.commentPost = async (req, res) => {
  let postCreator;
  // - checks if comment exists
  try {
    const checkForPost = await Posts.findById(req.params.postId);
    postCreator = checkForPost.username;
    if (checkForPost.length > 1) {
      console.log(
        '============== POST COULD NOT BE FOUND TO ADD COMMENT ==============='
      );
      return res
        .status(400)
        .json({ comment: 'post could not be found with that id' });
    }
    // - After verification of post this creates comment
    const newComment = new Comments({
      postId: req.params.postId,
      username: req.params.username,
      body: req.body.body
    });
    try {
      // - adds to comment count for post
      const addCommentCount = await Posts.updateOne(
        { _id: checkForPost._id },
        { $inc: { commentCount: 1 } }
      );
      const saveComment = await newComment.save((err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ comments: 'comment could not be saved' });
        }

        // - Creates Notification
        const createNotification = new Notifications({
          recipient: postCreator,
          sender: req.params.username,
          postId: req.params.postId,
          type: 'comment'
        });
        createNotification.save((err, res) => err && console.log(err));

        return res
          .status(201)
          .json({ comments: `comment ${req.params.postId} was saved` });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        comments: `could not add comment to post ${req.params.postId}`
      });
    }
  } catch (err) {
    console.log(err);
    console.log(
      '============== POST COULD NOT BE FOUND TO ADD COMMENT ==============='
    );
    return res
      .status(400)
      .json({ comment: 'post could not be found with that id' });
  }
};

exports.getPostComments = async (req, res) => {
  try {
    const fetchComments = await Comments.find({ postId: req.params.postId });
    return res
      .status(200)
      .json({ postId: req.params.postId, allComments: fetchComments });
  } catch (err) {
    console.log('================ COULD NOT GET ALL POSTS ==============');
    console.log(err);
    return res
      .status(404)
      .json({ comments: 'comments could not be found for this post' });
  }
};

exports.statusPost = async (req, res) => {
  try {
    //   - check for the post and for an existing notification to that post for the user
    const foundPost = await Posts.findById(req.params.postId);
    const existingLikes = await Notifications.find({
      $and: [{ sender: req.params.username }, { postId: req.params.postId }]
    });
    // console.log(existingLikes);
    // =============== IF LIKE IS ALREADY THERE (DISLIKE)===============
    //  - dislikes existing
    if (existingLikes.length >= 1 && existingLikes[0].type === 'like') {
      const removeNotification = await Notifications.findByIdAndUpdate(
        existingLikes[0]._id,
        {
          type: 'dislike'
        },
        async (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ notification: 'could dislike post' });
          }
          // - decrements like count for disliked post
          const addLike = await Posts.updateOne(
            { _id: foundPost._id },
            { $inc: { likeCount: -1 } }
          );
          return res
            .status(201)
            .json({ dislikePost: 'post status has been changed to dislike' });
        }
      );
      return;
    }
    // =============== IF LIKE IS ALREADY THERE (Like)===============
    //  - likes existing
    if (existingLikes.length >= 1 && existingLikes[0].type === 'dislike') {
      const removeNotification = Notifications.findByIdAndUpdate(
        existingLikes[0]._id,
        {
          type: 'like'
        },
        async (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ notification: 'could like post' });
          }
          // - increments like count for liked post
          const addLike = await Posts.updateOne(
            { _id: foundPost._id },
            { $inc: { likeCount: 1 } }
          );
          return res
            .status(201)
            .json({ dislikePost: 'post status has been changed to like' });
        }
      );
      return;
    }

    // =============== IF LIKE IS NOT THERE ===============
    // - create new post if existing cannot be found and handled
    const newNotification = new Notifications({
      recipient: req.body.recipient,
      sender: req.params.username,
      postId: req.params.postId,
      type: 'like'
    });

    const saveNotification = newNotification.save(async (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ notification: 'could not save notification' });
      }
      // - increments like count for liked post
      const addLike = await Posts.updateOne(
        { _id: foundPost._id },
        { $inc: { likeCount: 1 } }
      );
      return res
        .status(201)
        .json({ likePost: 'post status has been changed to like' });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ post: 'unable to alter post status' });
  }
};
