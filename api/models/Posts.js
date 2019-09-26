const mongoose = require('mongoose');

const PostsSchema = mongoose.Schema(
  {
    username: {
      type: String,
      ref: 'Users',
      required: true
    },
    body: {
      type: String,
      required: true
    },
    likeCount: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0
    }
  },
  {
    autoIndex: true,
    timestamps: true
  }
);

module.exports = mongoose.model('Posts', PostsSchema);
