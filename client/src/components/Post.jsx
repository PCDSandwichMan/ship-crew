import React from 'react';
import { connect } from 'react-redux';

import {
  deletePost,
  likePost,
  displayModal
} from '../redux/actions/dataActions';

import '../styles/components/postStyles.scss';
import defaultImage from '../images/profilePlaceholder.png';

function Post(props) {
  const handleDelete = () => {
    const deletePackage = {
      username: props.username,
      id: props.id
    };
    props.deletePost(deletePackage);
  };

  // - ============= Handles Like ============
  const handleLike = () => {
    props.likePost({
      username: props.currentUsername,
      recipient: props.username,
      id: props.id
    });
  };

  const handleCommentsView = () => {
    props.displayModal({
      active: true,
      modalContent: 'viewComments',
      post: props.post
    });
  };

  return (
    <div id="post">
      <div id="post__image-wrapper">
        <img id="post__image" src={defaultImage} alt="defaultImage" />
      </div>
      <div id="post__text">
        <h3>{props.username}</h3>
        <small>{props.createdAt}</small>
        <div id="post__text-body">
          <h5>{props.body}</h5>
        </div>
        <i
          id="post__text-like"
          className="fa fa-heart"
          aria-hidden="true"
          onClick={handleLike}
        >
          <small>{props.likes}</small>
        </i>
        <i
          id="post__text-comment"
          className="fa fa-comments-o"
          aria-hidden="true"
          onClick={handleCommentsView}
        >
          <small>{props.comments}</small>
        </i>
        {props.username === props.currentUsername ? (
          <i
            onClick={handleDelete}
            id="post__text-delete"
            className="fa fa-trash-o"
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  );
}

const mapStateToProps = (state, props) => {
  // console.log(props);
  return {
    currentUsername: state.user.username,
    post: props.post,
    username: props.username,
    body: props.body,
    createdAt: props.createdAt,
    likes: props.likes,
    comments: props.comments,
    id: props.id
  };
};

const mapActionsToProps = {
  deletePost,
  likePost,
  displayModal
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Post);
