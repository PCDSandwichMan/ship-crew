/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';

import { getAllPosts, clearErrors } from '../redux/actions/dataActions';
import { fetchNotifications } from '../redux/actions/userActions';

import Post from '../components/Post';
import Modal from '../components/Modal';
import '../styles/Home/homeStyles.scss';

function Home(props) {
  useEffect(() => {
    props.getAllPosts();
  }, [props.refreshQue]);

  useEffect(() => {
    props.fetchNotifications(props.userInfo.username);
  }, [props.userInfo.username]);

  const handleFlashClose = () => {
    props.clearErrors();
  };

  return (
    <div id="home-page">
      {props.modalActive === true ? <Modal /> : null}
      <div id="home-page__blurWrapper">
        <Navbar match={props.match} />
        <div id="home-page__body">
          {/* // -  Error flash messages  */}
          {props.errors.length > 0
            ? props.errors.map((err, i) => (
                <div key={i} onClick={handleFlashClose} id="home__flashMessage">
                  <h3>{err}</h3>
                  <i
                    id="fashMessage__close"
                    className="fa fa-times-circle-o"
                    aria-hidden="true"
                    onClick={handleFlashClose}
                  />
                </div>
              ))
            : null}
          <div id="body__posts">
            <div id="body__posts">
              {!props.loading ? (
                props.posts
                // TODO this is calling every refresh and flipping the order
                  .map((post, i) => (
                    <Post
                      key={i}
                      post={post}
                      username={post.username}
                      body={post.body}
                      createdAt={post.createdAt}
                      likes={post.likeCount}
                      comments={post.commentCount}
                      id={post._id}
                    />
                  ))
              ) : (
                <h5 id="body__loading" >Loading posts....</h5>
              )}
            </div>
          </div>
          <div id="body__profile">
            <ProfileCard />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    errors: state.UI.errors,
    loading: state.UI.loading,
    userInfo: state.user,
    posts: state.data.allPosts,
    refreshQue: state.UI.refreshQue,
    modalActive: state.UI.modalActive
  };
};

const mapActionsToProps = {
  getAllPosts,
  fetchNotifications,
  clearErrors
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Home);
