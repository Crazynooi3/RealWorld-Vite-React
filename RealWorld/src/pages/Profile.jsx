import React, { useContext, useEffect, useState } from "react";
import AuthenticatedUser from "../components/Header/AuthenticatedUser";
import { useParams } from "react-router-dom";
import { Link, useSearchParams } from "react-router-dom";
import AuthContext from "../Context/Context";
import ArticlePreview from "../components/ArticlePreview/ArticlePreview";
import Pagination from "../components/Pagination/Pagination";

export default function Profile() {
  const param = useParams();
  const [userProfile, setUserProfile] = useState(); // profile: {bio, following, image, username}
  const [currentUser, setCurrentUser] = useState();
  const [userTab, setUserTab] = useState("myArticles");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const articlesPerPage = 10;
  const [myArticleList, setMyArticleList] = useState({
    articles: [],
    articlesCount: 0,
  });
  const { isLogedin } = useContext(AuthContext);

  useEffect(() => {}, []);

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

  const getMyArticle = async () => {
    const userToken = localStorage.getItem("token");
    const { username } = userProfile.profile;

    try {
      if (isLogedin && username) {
        const request = await fetch(
          `http://localhost:3000/api/articles?author=${username}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const data = await request.json();
        setMyArticleList(data);
        return data;
      } else {
        const request = await fetch(
          `http://localhost:3000/api/articles?author=${userProfile.profile.username}`,
          {
            method: "GET",
          }
        );
        const data = await request.json();
        setMyArticleList(data);
        return data;
      }
    } catch (error) {
      console.log("error:", error);
      return error;
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    getMyArticle();
  }, [userProfile]);

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
                    <Link className="nav-link" to="">
                      Favorited Articles
                    </Link>
                  </li>
                </ul>
              </div>

              {myArticleList.articles.map((myArticle) => (
                <ArticlePreview
                  key={myArticle.slug}
                  author={myArticle.author.username}
                  image={myArticle.author.image}
                  title={myArticle.title}
                  favoritesCount={myArticle.favoritesCount}
                  description={myArticle.description}
                  slug={myArticle.slug}
                  tagList={myArticle.tagList}
                  createdAt={myArticle.createdAt}
                  favorited={myArticle.favorited}
                  // favoriteFunc={favorite}
                  // unFavoriteFunc={UnFavorite}
                />
              ))}

              {userTab === "myArticles" && myArticleList.articlesCount > 0 && (
                <Pagination
                  pages={Math.ceil(
                    myArticleList.articlesCount / articlesPerPage
                  )}
                  currentPage={currentPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
