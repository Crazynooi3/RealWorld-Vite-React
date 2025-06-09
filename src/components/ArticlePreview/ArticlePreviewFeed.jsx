import React from "react";
import { Link, useActionData } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../Context/Context";

export default function ArticlePreviewFeed(props) {
  const authContext = useContext(AuthContext);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options); // خروجی: 28 May 2025
  };
  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/profile/${props.author}`}>
          <img src={props.image} />
        </Link>
        <div className="info">
          <Link to={`/profile/${props.author}`} className="author">
            {props.author}
          </Link>
          <span className="date">{formatDate(props.createdAt)}</span>
        </div>
        <button
          onClick={() => {
            props.favorited
              ? props.unFavoriteFunc(props.slug)
              : props.favoriteFunc(props.slug);
          }}
          className={`btn btn-outline-primary  btn-sm pull-xs-right ${
            props?.favorited ? "active" : ""
          }`}
        >
          <i className="ion-heart"></i> {props.favoritesCount}
        </button>
      </div>
      <a href={`/article/${props.slug}`} className="preview-link">
        <h1>{props.title}</h1>
        <p>{props.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {props.tagList.map((tag, index) => (
            <li key={index + 1} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </a>
    </div>
  );
}
