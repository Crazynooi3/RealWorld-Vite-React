import { useState, useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import AuthenticatedUser from "../components/Header/AuthenticatedUser";
import UnauthenticatedUser from "../components/Header/UnauthenticatedUser";
import AuthContext from "../Context/Context";
import DeleteModal from "../components/Modal/DeleteModal";

export default function Article() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { isLogedin } = useContext(AuthContext);
  const { articleSlug } = useParams();
  const [articleDetail, setArticleDetail] = useState({});
  const [isAuthor, setIsAuthor] = useState(false);
  const [comments, setComments] = useState({
    comments: [],
  });
  const [commentValue, setCommentValue] = useState("");
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [isFalowing, setIsFalowing] = useState(false);

  const getArticle = async () => {
    const userToken = localStorage.getItem("token");
    try {
      if (isLogedin) {
        const request = await fetch(
          `http://localhost:3000/api/articles/${articleSlug}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        const data = await request.json();
        setArticleDetail(data);
        setFavorited(data.article.favorited);
        setFavoritesCount(data.article.favoritesCount);
        setIsFalowing(data.article.author.following);
        return data;
      } else {
        const request = await fetch(
          `http://localhost:3000/api/articles/${articleSlug}`
        );

        const data = await request.json();
        setArticleDetail(data);
        setFavorited(data.article.favorited);
        setFavoritesCount(data.article.favoritesCount);
        setIsFalowing(data.article.author.following);
        return data;
      }
    } catch (error) {
      console.log("error on line 18:", error);
      return error;
    }
  };
  const isAuthorFunc = () => {
    let articleAuthor = articleDetail?.article?.author?.username;
    let currentUser = authContext?.userInfos?.username;

    if (articleAuthor && currentUser && articleAuthor === currentUser) {
      setIsAuthor(true);
    } else {
      setIsAuthor(false);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options); // خروجی: 28 May 2025
  };
  const deleteArticle = async () => {
    const userToken = localStorage.getItem("token");
    try {
      if (isAuthor) {
      }
      const request = await fetch(
        `http://localhost:3000/api/articles/${articleSlug}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const data = await request.json();
      setArticleDetail(data);
      return data;
    } catch (error) {
      console.log("error on line 18:", error);
      return error;
    }
  };
  const getComments = async () => {
    try {
      const request = await fetch(
        `http://localhost:3000/api/articles/${articleSlug}/comments`
      );

      const data = await request.json();
      setComments(data);
      return data;
    } catch (error) {
      console.log("error on line 18:", error);
      return error;
    }
  };
  const favorite = () => {
    if (!isLogedin) {
      navigate("/login");
    }
    const userToken = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/articles/${articleSlug}/favorite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFavorited(data.article.favorited);
        getArticle();
      });
  };
  const UnFavorite = () => {
    const userToken = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/articles/${articleSlug}/favorite`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFavorited(data.article.favorited);
        getArticle();
      });
  };
  const favBtnHandler = () => {
    if (favorited) {
      UnFavorite();
    } else {
      favorite();
    }
  };
  const createComment = async (e, comment) => {
    e.preventDefault();
    const userToken = localStorage.getItem("token");
    let newComment = {
      comment: {
        body: comment,
      },
    };
    try {
      const request = await fetch(
        `http://localhost:3000/api/articles/${articleSlug}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(newComment),
        }
      );

      const data = await request.json();
      getComments();
      setCommentValue("");
      return data;
    } catch (error) {
      console.log("error on :", error);
      return error;
    }
  };
  const removeComment = async (e, commentID) => {
    e.preventDefault();
    const userToken = localStorage.getItem("token");
    try {
      const request = await fetch(
        `http://localhost:3000/api/articles/${articleSlug}/comments/${commentID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const data = await request.json();
      getComments();
      return data;
    } catch (error) {
      console.log("error on :", error);
      return error;
    }
  };
  const follow = () => {
    if (!isLogedin) {
      navigate("/login");
    }
    const userToken = localStorage.getItem("token");
    fetch(
      `http://localhost:3000/api/profiles/${articleDetail.article.author.username}/follow`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setIsFalowing(data.profile.following);
        getArticle();
      });
  };
  const unFollow = () => {
    const userToken = localStorage.getItem("token");
    fetch(
      `http://localhost:3000/api/profiles/${articleDetail.article.author.username}/follow`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setIsFalowing(data.profile.following);
        getArticle();
      });
  };
  const followBtnHandler = () => {
    if (isFalowing) {
      unFollow();
    } else {
      follow();
    }
  };

  useEffect(() => {
    getArticle();
    getComments();
  }, [articleSlug, authContext.token]);
  useEffect(() => {
    isAuthorFunc();
  }, [articleDetail, authContext.userInfos?.username]);

  return (
    <>
      {/* Article page (URL: /#/article/article-slug-here )
        Delete article button (only shown to article’s author)
        Render markdown from server client side
        Comments section at bottom of page
        Delete comment button (only shown to comment’s author)
        */}
      {isLogedin ? (
        <AuthenticatedUser page={"NewArticle"} />
      ) : (
        <UnauthenticatedUser />
      )}

      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{articleDetail?.article?.title}</h1>

            <div className="article-meta">
              <Link to={`/profile/${articleDetail?.article?.author?.username}`}>
                <img src={articleDetail?.article?.author?.image} />
              </Link>
              <div className="info">
                <Link
                  to={`/profile/${articleDetail?.article?.author?.username}`}
                  className="author"
                >
                  {articleDetail?.article?.author?.username}
                </Link>
                <span className="date">
                  {formatDate(articleDetail?.article?.createdAt)}
                </span>
              </div>
              <button
                onClick={() => followBtnHandler()}
                className={`btn btn-sm btn-outline-secondary ${
                  isFalowing ? "active" : ""
                }`}
              >
                <i
                  className={isFalowing ? "ion-minus-round" : "ion-plus-round "}
                ></i>
                &nbsp; {`Follow ${articleDetail?.article?.author?.username}`}{" "}
              </button>
              &nbsp;&nbsp;
              <button
                onClick={() => favBtnHandler()}
                className={`btn btn-sm btn-outline-primary ${
                  favorited ? "active" : ""
                }`}
              >
                <i className="ion-heart"></i>
                &nbsp; Favorite Post{" "}
                <span className="counter">({favoritesCount})</span>
              </button>
              {isAuthor && (
                <>
                  <Link to={`/editor/${articleSlug}`}>
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="ion-edit"></i> Edit Article
                    </button>
                  </Link>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    <i className="ion-trash-a"></i> Delete Article
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <p>{articleDetail?.article?.description}</p>
              <h2 id="introducing-ionic">{articleDetail?.article?.title}</h2>
              <p>{articleDetail?.article?.body}</p>
              <ul className="tag-list">
                {articleDetail?.article?.tagList.map((tag, index) => (
                  <li
                    key={index + 1}
                    className="tag-default tag-pill tag-outline"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr />

          <div className="article-actions">
            <div className="article-meta">
              <Link to={`/profile/${articleDetail?.article?.author?.username}`}>
                <img src={articleDetail?.article?.author?.image} />
              </Link>
              <div className="info">
                <Link
                  to={`/profile/${articleDetail?.article?.author?.username}`}
                  className="author"
                >
                  {articleDetail?.article?.author?.username}
                </Link>
                <span className="date">
                  {formatDate(articleDetail?.article?.createdAt)}
                </span>
              </div>
              <button
                onClick={() => followBtnHandler()}
                className={`btn btn-sm btn-outline-secondary ${
                  isFalowing ? "active" : ""
                }`}
              >
                <i
                  className={isFalowing ? "ion-minus-round" : "ion-plus-round "}
                ></i>
                &nbsp; {`Follow ${articleDetail?.article?.author?.username}`}{" "}
              </button>
              &nbsp;
              <button
                onClick={() => favBtnHandler()}
                className={`btn btn-sm btn-outline-primary ${
                  favorited ? "active" : ""
                }`}
              >
                <i className="ion-heart"></i>
                &nbsp; Favorite Post{" "}
                <span className="counter">({favoritesCount})</span>
              </button>
              {isAuthor && (
                <>
                  <Link to={`/editor/${articleSlug}`}>
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="ion-edit"></i> Edit Article
                    </button>
                  </Link>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    <i className="ion-trash-a"></i> Delete Article
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              <form className="card comment-form">
                <div className="card-block">
                  <textarea
                    value={commentValue}
                    onChange={(e) => {
                      setCommentValue(e.target.value);
                    }}
                    className="form-control"
                    placeholder="Write a comment..."
                    rows="3"
                  ></textarea>
                </div>
                <div className="card-footer">
                  {isLogedin ? (
                    <img
                      src={authContext?.userInfos?.image}
                      className="comment-author-img"
                    />
                  ) : (
                    ""
                  )}
                  <button
                    disabled={!isLogedin}
                    onClick={(e) => createComment(e, commentValue)}
                    className="btn btn-sm btn-primary"
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              {comments.comments.map((commnet) => (
                <div key={commnet.id} className="card">
                  <div className="card-block">
                    <p className="card-text">{commnet.body}</p>
                  </div>
                  <div className="card-footer">
                    <Link
                      to={`/profile/${commnet.author.username}`}
                      className="comment-author"
                    >
                      <img
                        src={commnet.author.image}
                        className="comment-author-img"
                      />
                    </Link>
                    &nbsp;
                    <Link
                      to={`/profile/${commnet.author.username}`}
                      className="comment-author"
                    >
                      {commnet.author.username}
                    </Link>
                    <span className="date-posted">
                      {formatDate(commnet.createdAt)}
                    </span>
                    {isAuthor ? (
                      <span
                        onClick={(e) => removeComment(e, commnet.id)}
                        className="mod-options"
                      >
                        <i className="ion-trash-a"></i>
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        deleteArticle={deleteArticle}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
