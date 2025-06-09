import * as YUP from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import AuthContext from "../../Context/Context";
import { useNavigate } from "react-router-dom";

import UnauthenticatedUser from "../../components/Header/UnauthenticatedUser";

const schema = YUP.object().shape({
  username: YUP.string().required("Username is required"),
  email: YUP.string().email("Email is not valid").required("Email is required"),
  password: YUP.string()
    .min(6, "Password must be 6 letter")
    .required("Password is required"),
});

export default function Register() {
  const authContext = useContext(AuthContext);
  const { isLogedin, login } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogedin) {
      navigate("/", { replace: true });
    }
  }, [isLogedin]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const userDatas = {
        user: {
          username: data.username,
          email: data.email,
          password: data.password,
        },
      };

      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userDatas),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "خطا در ورود به سیستم");
      }
      const responseData = await response.json();
      const { token } = responseData.user;

      login(token, responseData.user);
      return responseData;
    } catch (error) {
      console.error("خطا در ورود:", error.message);
      throw error;
    }
  };
  return (
    <>
      <UnauthenticatedUser />
      <div class="auth-page">
        <div class="container page">
          <div class="row">
            <div class="col-md-6 offset-md-3 col-xs-12">
              <h1 class="text-xs-center">Sign up</h1>
              <p class="text-xs-center">
                <a href="/login">Have an account?</a>
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset class="form-group">
                  <input
                    {...register("username")}
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                  />
                  <ul class="error-messages">
                    {errors.username && <li>{errors.username.message}</li>}
                  </ul>
                </fieldset>
                <fieldset class="form-group">
                  <input
                    {...register("email")}
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                  />
                  <ul class="error-messages">
                    {errors.email && <li>{errors.email.message}</li>}
                  </ul>
                </fieldset>
                <fieldset class="form-group">
                  <input
                    {...register("password")}
                    class="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                  />
                  <ul class="error-messages">
                    {errors.password && <li>{errors.password.message}</li>}
                  </ul>
                </fieldset>
                <button
                  type="submit"
                  class="btn btn-lg btn-primary pull-xs-right"
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
