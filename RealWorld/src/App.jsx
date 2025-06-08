import React, { useEffect, useState } from "react";
import routes from "./Routes";
import { useRoutes } from "react-router-dom";
import AuthContext from "./Context/Context";

function App() {
  const router = useRoutes(routes);
  const [isLogin, setIsLogin] = useState();
  const [token, setToken] = useState(null);
  const [userInfos, setUserInfos] = useState(null); // user:{bio, email, image, token, username}

  const login = (token, userInfo) => {
    setToken(token);
    localStorage.setItem("token", token);
    setIsLogin(true);
    setUserInfos({
      email: userInfo.email,
      username: userInfo.username,
      image: userInfo.image,
      bio: userInfo.bio,
    });
  };
  const logout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    setToken(null);
    setUserInfos(null);
  };

  const fetchUserData = async () => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      setIsLogin(false);
      setToken(null);
      setUserInfos(null);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "خطا در ورود به سیستم");
      }
      const responseData = await response.json();
      localStorage.setItem("token", responseData.user.token);
      setIsLogin(true);
      setToken(responseData.user.token);
      setUserInfos({
        bio: responseData.user.bio,
        email: responseData.user.email,
        id: responseData.user.id,
        image: responseData.user.image,
        username: responseData.user.username,
      });
      // console.log(isLogin, userInfos);
      return responseData;
    } catch (error) {
      console.error("خطا در ورود:", error.message);
      // نمایش خطا به کاربر (می‌توانید از state استفاده کنید)
      // setError("serverError", { message: error.message });
      throw error;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // useEffect(() => {}, [isLogin, userInfos]);
  return (
    <AuthContext.Provider
      value={{
        isLogedin: isLogin,
        token: token,
        userInfos: userInfos,
        login,
        logout,
      }}
    >
      {router}
    </AuthContext.Provider>
  );
}

export default App;
