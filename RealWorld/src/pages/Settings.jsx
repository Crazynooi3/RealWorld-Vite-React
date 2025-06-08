import * as YUP from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import AuthContext from "../Context/Context";
import { useNavigate } from "react-router-dom";

import AuthenticatedUser from "../components/Header/AuthenticatedUser";

const schema = YUP.object().shape({
  URL: YUP.string()
    .url("لطفاً یک URL معتبر وارد کنید")
    .required("آدرس تصویر پروفایل الزامی است"),
  email: YUP.string().email("ایمیل معتبر نیست").required("ایمیل الزامی است"),
  password: YUP.string()
    .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
    .required("رمز عبور الزامی است"),
});

export default function Settings() {
  const navigate = useNavigate();
  const { userInfos, isLogedin, logout } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors, usSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      URL: "",
      Name: "",
      Bio: "",
      Email: "",
    },
  });

  useEffect(() => {
    if (!isLogedin) {
      navigate("/");
    }

    setValue("URL", userInfos?.image);
    setValue("Name", userInfos?.username);
    setValue("Bio", userInfos?.bio);
    setValue("Email", userInfos?.email);
  }, []);
  return (
    <>
      <AuthenticatedUser page="Settings" />
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>

              <ul className="error-messages">
                <li>That name is required</li>
              </ul>

              <form>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      {...register("URL")}
                      className="form-control"
                      type="text"
                      placeholder="URL of profile picture"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      {...register("Name")}
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Your Name"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      {...register("Bio")}
                      className="form-control form-control-lg"
                      rows="8"
                      placeholder="Short bio about you"
                    ></textarea>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      {...register("Email")}
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Email"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      {...register("Password")}
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="New Password"
                    />
                  </fieldset>
                  <button className="btn btn-lg btn-primary pull-xs-right">
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
