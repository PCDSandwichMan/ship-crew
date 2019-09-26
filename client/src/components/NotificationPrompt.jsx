import React from 'react';
import { connect } from 'react-redux';

import { markAsRead } from '../redux/actions/userActions';

import '../styles/components/notificationPromptStyles.scss';

function NotificationPrompt(props) {
  const handlePromptClick = () => {
    props.markAsRead({
      username: props.notification.recipient,
      id: props.notification._id
    });
  };
  return typeof props.notification === 'object' ? (
    <div id="prompt" onClick={handlePromptClick}>
      <section id="prompt__info">
        <h4 id="prompt__status">
          {!props.notification.read ? 'Undread' : 'Read'}
        </h4>
        <small id="prompt__time">{props.notification.createdAt}</small>
      </section>
      <h2 id="prompt__name">{props.notification.sender}</h2>
      <h3 id="prompt__action">{props.notification.type}</h3>
      <h2 id="prompt__post">{props.notification.postId}</h2>
    </div>
  ) : null;
}

const mstp = (state, props) => {
  return {
    notification: props.notification
  };
};

const matp = {
  markAsRead
};

export default connect(
  mstp,
  matp
)(NotificationPrompt);
