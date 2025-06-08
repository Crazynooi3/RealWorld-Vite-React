import React, { useEffect, useState } from "react";
import AuthenticatedUser from "../components/Header/AuthenticatedUser";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Profile() {
  const param = useParams();
  const [userProfile, setUserProfile] = useState(); // profile: {bio, following, image, username}
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    console.log(userProfile);
  }, [userProfile]);

  const getProfile = () => {
    const userToken = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/profiles/${param.username}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUserProfile(data));

    fetch(`http://localhost:3000/api/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data));
  };
  const follow = () => {
    const userToken = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/profiles/${param.username}/follow`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUserProfile(data));
  };
  const unFollow = () => {
    const userToken = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/profiles/${param.username}/follow`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUserProfile(data));
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <AuthenticatedUser page="profile" />
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img src={userProfile?.profile?.image} className="user-img" />
                <h4>{userProfile?.profile?.username || ""}</h4>
                <p>
                  {userProfile?.profile?.bio ||
                    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, officiis!`}
                </p>
                {userProfile?.profile?.following ? (
                  <button
                    onClick={() => unFollow()}
                    className="btn btn-sm btn-outline-secondary action-btn"
                  >
                    <i classNameName="ion-minus-round"></i>
                    &nbsp; {`UnFollow ${userProfile?.profile?.username}`}
                  </button>
                ) : (
                  <button
                    onClick={() => follow()}
                    className="btn btn-sm btn-outline-secondary action-btn"
                  >
                    <i className="ion-plus-round"></i>
                    &nbsp; {`Follow ${userProfile?.profile?.username}`}
                  </button>
                )}

                {userProfile?.profile?.username ===
                currentUser?.user?.username ? (
                  <Link
                    to={`/settings`}
                    className="btn btn-sm btn-outline-secondary action-btn"
                  >
                    <i className="ion-gear-a"></i>
                    &nbsp; "Edit Profile Settings"
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <Link className="nav-link active" to="">
                      My Articles
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="">
                      Favorited Articles
                    </a>
                  </li>
                </ul>
              </div>

              <div className="article-preview">
                <div className="article-meta">
                  <a href="/profile/eric-simons">
                    <img src="http://i.imgur.com/Qr71crq.jpg" />
                  </a>
                  <div className="info">
                    <a href="/profile/eric-simons" className="author">
                      Eric Simons
                    </a>
                    <span className="date">January 20th</span>
                  </div>
                  <button className="btn btn-outline-primary btn-sm pull-xs-right">
                    <i className="ion-heart"></i> 29
                  </button>
                </div>
                <a
                  href="/article/how-to-buil-webapps-that-scale"
                  className="preview-link"
                >
                  <h1>How to build webapps that scale</h1>
                  <p>This is the description for the post.</p>
                  <span>Read more...</span>
                  <ul className="tag-list">
                    <li className="tag-default tag-pill tag-outline">
                      realworld
                    </li>
                    <li className="tag-default tag-pill tag-outline">
                      implementations
                    </li>
                  </ul>
                </a>
              </div>

              <div className="article-preview">
                <div className="article-meta">
                  <a href="/profile/albert-pai">
                    <img src="http://i.imgur.com/N4VcUeJ.jpg" />
                  </a>
                  <div className="info">
                    <a href="/profile/albert-pai" className="author">
                      Albert Pai
                    </a>
                    <span className="date">January 20th</span>
                  </div>
                  <button className="btn btn-outline-primary btn-sm pull-xs-right">
                    <i className="ion-heart"></i> 32
                  </button>
                </div>
                <a href="/article/the-song-you" className="preview-link">
                  <h1>
                    The song you won't ever stop singing. No matter how hard you
                    try.
                  </h1>
                  <p>This is the description for the post.</p>
                  <span>Read more...</span>
                  <ul className="tag-list">
                    <li className="tag-default tag-pill tag-outline">Music</li>
                    <li className="tag-default tag-pill tag-outline">Song</li>
                  </ul>
                </a>
              </div>

              <ul className="pagination">
                <li className="page-item active">
                  <a className="page-link" href="">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="">
                    2
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
