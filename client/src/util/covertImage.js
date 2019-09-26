// - Used to convert image buffer into an image

exports.coververtImage = (profileImage, profileImageType) => {
  if (profileImage && profileImageType) {
    return `data:${
      this.profileImageType
    };charset=utf-8;base64,${this.profileImage.toString('base64')}`;
  }
};
