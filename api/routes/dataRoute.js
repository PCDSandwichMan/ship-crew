const router = require('express').Router();
// "heroku-postbuild": "cd client && npm install && npm install --only=dev --no-shrinkwrap && npm run build"
const jwtAuth = require('../middleware/jwtAuth');
const {
  getAllPosts,
  getOnePost,
  createOnePost,
  deletePost,
  commentPost,
  statusPost,
  getPostComments
} = require('../handlers/dataHandlers');

// - Get All Posts
router.get('/posts', jwtAuth, getAllPosts);

// - Get One Post ( notification click )
router.get('/post/:postId', jwtAuth, getOnePost);

// - Create One Post
router.post('/:username/create-post', jwtAuth, createOnePost);

// - Delete Post (Only allow user to do this <time window>)
router.delete('/:username/delete/:postId', jwtAuth, deletePost);

// - Comment On Post
router.post('/:username/add-comment/:postId', jwtAuth, commentPost);

// - Get all comments on post
router.get('/get-comments/:postId', jwtAuth, getPostComments);

// - Change Like Status
router.post('/:username/like-status/:postId', jwtAuth, statusPost);

module.exports = router;
