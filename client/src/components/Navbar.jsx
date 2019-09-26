import React from 'react';
import { connect } from 'react-redux';
import { displayModal } from '../redux/actions/dataActions';
import { editUserInfo, logoutUser } from '../redux/actions/userActions';

import '../styles/components/navbarStyles.scss';
import navPic from '../images/relationship.svg';
import NotificationPrompt from './NotificationPrompt';

function Navbar(props) {
  const handleAddPost = () => {
    props.displayModal({
      active: true,
      modalContent: 'addPost'
    });
  };

  const handlePromptDisplay = () => {
    const prompt = document.getElementById('notifications__modal');
    const bell = document.getElementById('notification-bell');
    prompt.classList.toggle('show-modal');
    bell.classList.toggle('bell-color');
  };

  const handleViewProfile = () => {
    props.editUserInfo();
  };

  return (
    <div id="nav">
      <div id="nav__logo">
        <a href="/home" id="nav__image">
          <img src={navPic} alt="nav option" />
        </a>
        <h1>Ship crew</h1>
      </div>
      <ul id="nav__list">
        {/* // - add post  */}
        <li id="list__option">
          <i
            className="fa fa-plus"
            aria-hidden="true"
            onClick={handleAddPost}
          />
        </li>
        {props.match.path === '/home' ? null : (
          <li id="list__option">
            <i className="fa fa-home" aria-hidden="true" />
          </li>
        )}
        <li className="notifications" id="list__option">
          <i
            className="fa fa-bell"
            aria-hidden="true"
            id="notification-bell"
            onClick={handlePromptDisplay}
          />
          {/* // - Notifications Modal */}
          <div id="modal__arrow" />
          <div id="notifications__modal">
            {/* // - Notification Prompts */}
            {props.notifications.slice(0, 3).map((notification, i) => (
              <NotificationPrompt key={i} notification={notification} />
            ))}
            {/* // - Notification Prompts */}
          </div>
        </li>
        <li id="list__option">
          <i
            className="fa fa-user-circle"
            aria-hidden="true"
            onClick={handleViewProfile}
          />
        </li>
        <li id="list__option">
          <i
            class="fa fa-sign-out"
            aria-hidden="true"
            onClick={props.logoutUser}
           />
        </li>
      </ul>
    </div>
  );
}

const mapStateToProps = state => ({
  notifications: state.user.notifications
});

const mapActionsToProps = {
  displayModal,
  editUserInfo,
  logoutUser
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Navbar);
