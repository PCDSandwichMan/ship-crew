/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getUserInfo, editUserInfo } from '../redux/actions/userActions';

import '../styles/components/profileCardStyles.scss';
import profilePlaceholder from '../images/profilePlaceholder.png';

function ProfileCard(props) {
  // - refreshes users profile info
  useEffect(() => {
    props.getUserInfo(props.username);
  });

  const handleUserInfoEdit = () => {
    props.editUserInfo();
  };

  return (
    <div id="profile">
      <div id="profile__image-container">
        <div id="image__wrapper">
          <img id="image-user" src={profilePlaceholder} alt="missing image" />
        </div>
      </div>
      <div id="profile__text-container">
        <h2 id="profile__text-name">{props.username}</h2>
        <div id="profile__text-bio">
          <h4 id="bio__text">{props.bio}</h4>
        </div>
        <div id="profile__info-wrapper">
          <span id="profile__text-location">
            <i className="fa fa-map-marker" aria-hidden="true" />
            <h4>{props.location}</h4>
          </span>
          <span id="profile__text-website">
            <i className="fa fa-link" aria-hidden="true" />
            <a href="/home">{props.website}</a>
          </span>
          <span id="profile__text-created">
            <i className="fa fa-calendar" aria-hidden="true" />
            <h4>{props.createdAt}</h4>
          </span>
        </div>
      </div>
      <i
        className="fa fa-pencil"
        aria-hidden="true"
        onClick={handleUserInfoEdit}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  username: state.user.username,
  bio: state.user.bio,
  location: state.user.location,
  website: state.user.website,
  createdAt: state.user.createdAt
});

const mapActionsToProps = {
  getUserInfo,
  editUserInfo
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ProfileCard);
