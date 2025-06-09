import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../Context/Context";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import UnauthenticatedUser from "../components/Header/UnauthenticatedUser";
import AuthenticatedUser from "../components/Header/AuthenticatedUser";
import Footer from "../components/Footer/Footer";
import ArticlePreview from "../components/ArticlePreview/ArticlePreview";
import ArticlePreviewFeed from "../components/ArticlePreview/ArticlePreviewFeed";
import Pagination from "../components/Pagination/Pagination";

export default function Home() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [isLogedin, setIsLogin] = useState(authContext.isLogedin);
  const [tags, setTags] = useState([]);
  const [userInfos, setUserInfos] = useState({
    username: "",
    image: "",
  });
  const [userFeed, setUserFeed] = useState("globalFeed");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const articlesPerPage = 10;
  const [articleList, setArticleList] = useState({
    articles: [],
    articlesCount: 0,
  });
  const [feedArticleList, setFeedArticleList] = useState({
    articles: [],
    articlesCount: 0,
  });

  const getAuthContext = () => {
    setIsLogin(authContext.isLogedin);
    setUserInfos(authContext.userInfos);
  };

  const getGlobalFeed = async (offset, limit) => {
    const userToken = localStorage.getItem("token");
    try {
      if (authContext.isLogedin) {
        const request = await fetch(
          `http://localhost:3000/api/articles?offset=${offset}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const data = await request.json();
        setArticleList(data);
        return data;
      } else {
        const request = await fetch(
          `http://localhost:3000/api/articles?offset=${offset}&limit=${limit}`
        );
        const data = await request.json();
        setArticleList(data);
        return data;
      }
    } catch (error) {
      console.log("error:", error);
      return error;
    }
  };

  const getYourFeedArticle = async () => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/login");
    }
    try {
      const request = await fetch(`http://localhost:3000/api/articles/feed`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await request.json();
      setFeedArticleList(data);
      return data;
    } catch (error) {
      console.log("error on line 18:", error);
      return error;
    }
  };

  const favorite = (slug) => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/login");
    }
    fetch(`http://localhost:3000/api/articles/${slug}/favorite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        getGlobalFeed();
        getYourFeedArticle();
      });
  };

  const UnFavorite = (slug) => {
    const userToken = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/articles/${slug}/favorite`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        getGlobalFeed();
        getYourFeedArticle();
      });
  };

  const getTags = () => {
    fetch(`http://localhost:3000/api/tags`)
      .then((res) => res.json())
      .then((data) => {
        setTags(data.tags);
      });
  };

  useEffect(() => {
    getGlobalFeed();
    getTags();
  }, []);

  useEffect(() => {
    if (userFeed === "globalFeed") {
      const offset = (currentPage - 1) * articlesPerPage;
      getGlobalFeed(offset, articlesPerPage);
    } else if (userFeed === "yourFeed") {
      const offset = (currentPage - 1) * articlesPerPage;
      getYourFeedArticle(offset, articlesPerPage);
    }
  }, [currentPage, userFeed]);

  useEffect(() => {
    getAuthContext();
  }, [authContext.isLogedin]);
  return (
    <>
      {isLogedin ? <AuthenticatedUser page="Home" /> : <UnauthenticatedUser />}
      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <Link
                      onClick={() => {
                        setUserFeed("yourFeed");
                      }}
                      className={`nav-link ${
                        userFeed === "yourFeed" ? "active" : ""
                      }`}
                      to={"/yourFeed"}
                    >
                      Your Feed
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      onClick={() => {
                        setUserFeed("globalFeed");
                      }}
                      className={`nav-link ${
                        userFeed === "globalFeed" ? "active" : ""
                      }`}
                      to={"/globalFeed"}
                    >
                      Global Feed
                    </Link>
                  </li>
                </ul>
              </div>
              {userFeed === "globalFeed"
                ? articleList.articles.map((article) => (
                    <ArticlePreview
                      key={article.slug}
                      author={article.author.username}
                      image={article.author.image}
                      title={article.title}
                      favoritesCount={article.favoritesCount}
                      description={article.description}
                      slug={article.slug}
                      tagList={article.tagList}
                      createdAt={article.createdAt}
                      favorited={article.favorited}
                      favoriteFunc={favorite}
                      unFavoriteFunc={UnFavorite}
                    />
                  ))
                : userFeed === "yourFeed"
                ? feedArticleList.articles.map((article) => (
                    <ArticlePreviewFeed
                      key={article.slug}
                      author={article.author.username}
                      image={article.author.image}
                      title={article.title}
                      favoritesCount={article.favoritesCount}
                      description={article.description}
                      slug={article.slug}
                      tagList={article.tagList}
                      createdAt={article.createdAt}
                      favorited={article.favorited}
                      favoriteFunc={favorite}
                      unFavoriteFunc={UnFavorite}
                    />
                  ))
                : ""}

              {userFeed === "globalFeed" && articleList.articlesCount > 0 && (
                <Pagination
                  pages={Math.ceil(articleList.articlesCount / articlesPerPage)}
                  currentPage={currentPage}
                />
              )}

              {userFeed === "yourFeed" && feedArticleList.articlesCount > 0 && (
                <Pagination
                  pages={Math.ceil(
                    feedArticleList.articlesCount / articlesPerPage
                  )}
                  currentPage={currentPage}
                />
              )}
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
                <div className="tag-list">
                  {tags.map((tag, index) => (
                    <Link
                      key={index + 1}
                      to=""
                      className="tag-pill tag-default"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
