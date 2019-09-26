const mongoose = require('mongoose');

const CommentsSchema = mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    username: {
      type: String,
      ref: 'Users',
      required: true
    },
    body: {
      type: String,
      required: true
    }
  },
  {
    autoIndex: true,
    timestamps: true
  }
);

module.exports = mongoose.model('Comments', CommentsSchema);
