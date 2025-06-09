import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import CreateEditArticle from "./pages/CreateEditArticle";
import Article from "./pages/Article";
import Profile from "./pages/Profile";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/globalfeed", element: <Home /> },
  { path: "/yourFeed", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/settings", element: <Settings /> },
  { path: "/article/:articleSlug", element: <Article /> },
  { path: "/editor/:articleSlug", element: <CreateEditArticle /> },
  { path: "/editor", element: <CreateEditArticle /> },
  { path: "/editor/:articleSlug", element: <CreateEditArticle /> },
  { path: "/profile/:username", element: <Profile /> },
  // For Favorited Articles
  { path: "/profile/:username/favorites", element: <Profile /> },
];

export default routes;
