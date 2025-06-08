import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../Context/Context";

export default function AuthenticatedUser(props) {
  const { userInfos } = useContext(AuthContext);
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to={"/"}>
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            {/* <!-- Add "active" className when you're on that page" --> */}
            <Link
              className={`nav-link ${props.page === "Home" ? "active" : ""} `}
              to="/"
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                props.page === "NewArticle" ? "active" : ""
              } `}
              to="/editor"
            >
              {" "}
              <i className="ion-compose"></i>&nbsp;New Article{" "}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                props.page === "Settings" ? "active" : ""
              } `}
              to="/settings"
            >
              {" "}
              <i className="ion-gear-a"></i>&nbsp;Settings{" "}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                props.page === "profile" ? "active" : ""
              } `}
              to={`/profile/${userInfos.username}`}
            >
              <img src={userInfos.image} className="user-pic" />
              {userInfos.username}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
