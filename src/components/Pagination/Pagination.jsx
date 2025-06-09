import React from "react";
import { Link } from "react-router-dom";

export default function Pagination(props) {
  return (
    <ul className="pagination">
      {Array.from({ length: props.pages }, (_, index) => (
        <li
          key={index + 1}
          className={`page-item ${
            props.currentPage === index + 1 ? "active" : ""
          }`}
        >
          <Link className="page-link" to={`?page=${index + 1}`}>
            {index + 1}
          </Link>
        </li>
      ))}
    </ul>
  );
}
