import * as YUP from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import AuthContext from "../Context/Context";
import { useNavigate } from "react-router-dom";

import AuthenticatedUser from "../components/Header/AuthenticatedUser";

const schema = YUP.object().shape({
  image: YUP.string().url("URL is not valid").required("URL in required"),
  username: YUP.string().required("Username is required"),
  bio: YUP.string().max(200, "Max bio is 200 letter").notRequired(),
  email: YUP.string().email("Email is not Valid").required("Email is required"),
  password: YUP.string()
    .notRequired()
    .transform((value) => (value === "" ? undefined : value))
    .min(6, "Password length must be at least 6 characters"),
});

export default function Settings() {
  const navigate = useNavigate();
  const { userInfos, isLogedin, logout } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      image: "",
      username: "",
      bio: "",
      email: "",
      password: "",
    },
  });

  const updateUserInfo = async (data) => {
    try {
      const userDatas = {
        user: Object.fromEntries(
          Object.entries({
            email: data.email,
            username: data.username,
            ...(data.password && { password: data.password }),
            ...(data.bio !== undefined && { bio: data.bio }),
            ...(data.image !== undefined && { image: data.image }),
          }).filter(([_, value]) => value !== "" && value !== undefined)
        ),
      };
      const userToken = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/user", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userDatas),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "خطا در ویرایش اطلاعات");
      }
      const responseData = await response.json();
      localStorage.setItem("token", responseData.user.token);
      navigate(`/profile/${userInfos.username}`);
      return responseData;
    } catch (error) {
      console.error("خطا در ویرایش اطلاعات کاربر:", error.message);
      throw error;
    }
  };

  const onSubmit = (formdata) => {
    console.log("Form data:", formdata);
    updateUserInfo(formdata);
  };

  useEffect(() => {
    if (!isLogedin) {
      navigate("/");
    }
    if (userInfos) {
      setValue("image", userInfos.image || "");
      setValue("username", userInfos.username || "");
      setValue("bio", userInfos.bio || "");
      setValue("email", userInfos.email || "");
    }
  }, [isLogedin, userInfos, navigate, setValue]);
  return (
    <>
      <AuthenticatedUser page="Settings" />
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      {...register("image")}
                      className="form-control"
                      type="text"
                      placeholder="URL of profile picture"
                    />
                    <ul className="error-messages">
                      {errors.image && <li>{errors.image.message}</li>}
                    </ul>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      {...register("username")}
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Your Username"
                    />
                    <ul className="error-messages">
                      {errors.username && <li>{errors.username.message}</li>}
                    </ul>
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      {...register("bio")}
                      className="form-control form-control-lg"
                      rows="8"
                      placeholder="Short bio about you"
                    ></textarea>
                    <ul className="error-messages">
                      {errors.bio && <li>{errors.bio.message}</li>}
                    </ul>
                  </fieldset>
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
                      placeholder="New Password"
                    />
                    <span className="text-muted">
                      *** if you dont want to change password, leaves this field
                      empty
                    </span>
                    <ul className="error-messages">
                      {errors.password && <li>{errors.password.message}</li>}
                    </ul>
                  </fieldset>
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary pull-xs-right"
                    disabled={isSubmitting}
                  >
                    Update Settings
                  </button>
                </fieldset>
              </form>
              <hr />
              <button
                onClick={() => {
                  logout();
                }}
                className="btn btn-outline-danger"
              >
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
