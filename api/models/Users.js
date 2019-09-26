/* eslint-disable func-names */
const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      match: /^\s*\S+\s*$/,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      trim: true
    },
    profilePicture: {
      type: Buffer
    },
    profilePictureType: {
      type: String
    },
    bio: {
      type: String
    },
    website: {
      type: String,
      trim: true
    },
    location: {
      type: String
    }
  },
  {
    autoIndex: true,
    timestamps: true
  }
);

// - Used to convert filepond image buffing into an image when .profileImagePath is called
UsersSchema.virtual('profileImagePath').get(function() {
  if (this.profilePicture && this.profileImageType) {
    return `data:${
      this.profileImageType
    };charset=utf-8;base64,${this.profileImage.toString('base64')}`;
  }
});

module.exports = mongoose.model('Users', UsersSchema);
