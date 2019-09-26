import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  displayModal,
  createPost,
  createComment
} from '../redux/actions/dataActions';
import {
  sendEditedInfo,
  // ! ======== IN DEVELOPMENT ============
  // uploadProfilePicture
  // ! ======== IN DEVELOPMENT ============
} from '../redux/actions/userActions';

import '../styles/components/modalStyles.scss';

function Modal(props) {
  // - Used for post creation info
  const [postInfo, setPostInfo] = useState({
    username: props.username,
    body: ''
  });

  // - Used for comment creation
  const [commentBody, setCommentBody] = useState({
    body: ''
  });

  // - Used for editing profileInfo
  const [profileInfoEdits, setProfileInfoEdits] = useState({
    currentUsername: props.allUserInfo.username,
    username: props.allUserInfo.username,
    email: props.allUserInfo.email,
    bio: props.allUserInfo.bio,
    website: props.allUserInfo.website,
    location: props.allUserInfo.location
  });

  // - ============= Handles blur toggle ===============
  const blurWrapper = document.getElementById('home-page__blurWrapper');

  useEffect(() => {
    if (props.modalContent !== '') {
      blurWrapper.classList.add('background-blur');
    } else {
      blurWrapper.classList.remove('background-blur');
    }
  }, [props.modalContent]);

  const handleModalClose = () => {
    blurWrapper.classList.remove('background-blur');
    props.displayModal({
      active: false,
      modalContent: ''
    });
  };

  // - ============= Handles post creation ===============
  const onChangeNewPost = event => {
    setPostInfo({
      ...postInfo,
      [event.target.name]: event.target.value
    });
  };

  const handlePostCreation = e => {
    e.preventDefault();
    props.createPost(postInfo);
    blurWrapper.classList.remove('background-blur');
  };

  // - ============= Handles Comments creation ===============
  const handleCommentChange = e => {
    setCommentBody({ ...commentBody, [e.target.name]: e.target.value });
  };

  const handleCreateComment = e => {
    e.preventDefault();
    props.createComment({
      username: props.username,
      postId: props.currentPostDisplayed,
      body: commentBody.body
    });
  };

  // - ============= Handles Profile Edit ===============
  const handleChangeProfileEdit = e => {
    setProfileInfoEdits({
      ...profileInfoEdits,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileEdit = e => {
    e.preventDefault();
    props.sendEditedInfo(profileInfoEdits);
  };

  // ! ======== IN DEVELOPMENT ============
  // // - ============== Handles Image Conversion =============
  // // - Used for editing profileInfo
  // const [file, setFile] = useState('');
  // const [filename, setFilename] = useState('Choose File');
  // const [uploadedFile, setUploadedFile] = useState({});

  // const storeFile = e => {
  //   setFile(e.target.files[0]);
  //   setFilename(e.target.files[0].name);
  // };

  // const uploadFile = e => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   props.uploadProfilePicture(props.username, formData);
  // };
  // ! ======== IN DEVELOPMENT ============
  return (
    <div id="modal-overlay">
      <div id="modal-body">
        <i
          id="modal__close"
          className="fa fa-times-circle-o"
          aria-hidden="true"
          onClick={handleModalClose}
        />
        {/* // - Add post content */}
        {props.modalContent === 'addPost' ? (
          <div id="newPost-container">
            <div id="newPost-header">
              <h1>Create Post</h1>
              <hr />
            </div>
            <span id="newPost__presetInfo">
              <h2>{props.username}</h2>
              <h4>{moment().format('MMMM Do YYYY, h:mm:ss a')}</h4>
            </span>
            <form id="newPost__form" onSubmit={handlePostCreation}>
              <textarea
                name="body"
                value={postInfo.body}
                onChange={onChangeNewPost}
              />
              <button type="submit">Save</button>
            </form>
          </div>
        ) : null}
        {/* // - Comments content */}
        {props.modalContent === 'viewComments' ? (
          <div id="comments-wrapper">
            <div id="comments-container">
              {props.modalPostComments.length > 0 ? (
                props.modalPostComments.map((comment, i) => (
                  <section key={i}>
                    <small>{comment.createdAt}</small>
                    <div id="comment" key={i}>
                      <h3>{comment.username}</h3>
                      <h5>{comment.body}</h5>
                    </div>
                  </section>
                ))
              ) : (
                <h1>No Comments</h1>
              )}
            </div>
            <form id="comments_form" onSubmit={handleCreateComment}>
              <input
                type="text"
                name="body"
                placeholder="Add Comment..."
                onChange={handleCommentChange}
                value={commentBody.body}
              />
              <button type="submit">Save</button>
            </form>
          </div>
        ) : null}
        {/* // - Profile view and edit content */}
        {props.modalContent === 'viewUserProfile' ? (
          <div id="profile-container">
            <div id="profile__info">
            {/* // ! ======== IN DEVELOPMENT ============ */}
              {/* <form onSubmit={uploadFile} encType="multipart/form-data">
                <input
                  type="file"
                  name="userPicture"
                  accept=".jpeg,.jpg,.png,.gif"
                  onChange={storeFile}
                />
                <button type="submit">Upload File</button>
              </form> */}
              {/* // ! ======== IN DEVELOPMENT ============ */}
              <form onSubmit={handleProfileEdit} id="info__form">
                <input
                  value={profileInfoEdits.username}
                  onChange={handleChangeProfileEdit}
                  type="text"
                  name="username"
                  placeholder="Username"
                />
                <input
                  value={profileInfoEdits.email}
                  onChange={handleChangeProfileEdit}
                  type="text"
                  name="email"
                  placeholder="Email"
                />
                <textarea
                  value={profileInfoEdits.bio}
                  onChange={handleChangeProfileEdit}
                  type="text"
                  name="bio"
                  placeholder="Bio"
                />
                <input
                  value={profileInfoEdits.location}
                  onChange={handleChangeProfileEdit}
                  type="text"
                  name="location"
                  placeholder="Location"
                />
                <input
                  value={profileInfoEdits.website}
                  onChange={handleChangeProfileEdit}
                  type="text"
                  name="website"
                  placeholder="Website"
                />
                <button type="submit">Save Changes</button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  modalActive: state.UI.modalActive,
  modalContent: state.UI.modalContent,
  allUserInfo: state.user,
  username: state.user.username,
  currentPostDisplayed: state.UI.postId,
  modalPostComments: state.UI.modalPostComments
});

const mapActionsToProps = {
  displayModal,
  createPost,
  createComment,
  sendEditedInfo,
  // ! ======== IN DEVELOPMENT ============
  // uploadProfilePicture
  // ! ======== IN DEVELOPMENT ============
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Modal);
