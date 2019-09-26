const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema(
  {
    recipient: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      required: true,
      lowercase: true,
    }
  },
  {
    autoIndex: true,
    timestamps: true
  }
);

module.exports = mongoose.model('Notifications', NotificationSchema);
