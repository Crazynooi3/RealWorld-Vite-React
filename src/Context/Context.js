import { createContext } from "react";

const AuthContext = createContext({
  isLogedin: false,
  token: null,
  userInfos: null,
  login: () => {},
  logout: () => {},
});

export default AuthContext;
