import UnauthenticatedUser from "../../components/Header/UnauthenticatedUser";
import * as YUP from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import AuthContext from "../../Context/Context";
import { useNavigate } from "react-router-dom";

const schema = YUP.object().shape({
  email: YUP.string().email("Email is not valid").required("Email is required"),
  password: YUP.string()
    .min(6, "Password must be 6 letter")
    .required("Password is required"),
});

export default function Login() {
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
          email: data.email,
          password: data.password,
        },
      };
      const response = await fetch("http://localhost:3000/api/users/login", {
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
      const result = await response.json();
      const { token } = result.user;

      await login(token, result.user);
      return result;
    } catch (error) {
      console.error("خطا در ورود:", error.message);
      throw error;
    }
  };
  return (
    <>
      <UnauthenticatedUser />
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <a href="/register">Need an account?</a>
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="form-group">
                  <input
                    {...register("email")}
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                  />
                  <ul className="error-messages">
                    {errors.email && <li>{errors.email.message}</li>}
                  </ul>
                </fieldset>

                <fieldset className="form-group">
                  <input
                    {...register("password")}
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                  />
                  <ul className="error-messages">
                    {errors.password && <li>{errors.password.message}</li>}
                    {/* اگر خطای سرور وجود داشت، اینجا می‌توانید نمایش دهید */}
                  </ul>
                </fieldset>
                <button
                  type="submit"
                  className="btn btn-lg btn-primary pull-xs-right"
                >
                  {isSubmitting ? "در حال ورود..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
