import React, { useEffect, useState } from "react";
import * as YUP from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import AuthContext from "../Context/Context";
import { useNavigate, useParams } from "react-router-dom";
import AuthenticatedUser from "../components/Header/AuthenticatedUser";

const schema = YUP.object().shape({
  title: YUP.string().required("Title is required"),
  description: YUP.string()
    .required("description is required")
    .min(10, "Min description must be 10 letter")
    .max(100, " Max description must be 50 letter"),
  body: YUP.string()
    .min(20, "MIN body must be 20 letter")
    .required("body is required"),
});

export default function CreateEditArticle(props) {
  const { articleSlug } = useParams();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const userToken = authContext.token || localStorage.getItem("token");
      if (userToken) {
        setIsAuthChecked(true);
      } else {
        setIsAuthChecked(true);
        navigate("/");
      }
    };
    checkAuth();
  }, [authContext.token, navigate]);
  const {
    register,
    handleSubmit,
    formState: { errors, usSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      body: "",
      tagList: [],
    },
  });
  const getArticle = async () => {
    const userToken = localStorage.getItem("token");
    try {
      const request = await fetch(
        `http://localhost:3000/api/articles/${articleSlug}`,
        {
          method: "GET",
          headers: {
            Authorization: userToken
              ? { Authorization: `Bearer ${userToken}` }
              : {},
          },
        }
      );

      const data = await request.json();
      // setArticleDetail(data);
      return data;
    } catch (error) {
      console.log("error on line 18:", error);
      return error;
    }
  };
  useEffect(() => {
    if (articleSlug) {
      getArticle().then((data) => {
        if (data?.article) {
          setValue("title", data.article.title || "");
          setValue("description", data.article.description || "");
          setValue("body", data.article.body || "");
          setValue("tagList", data.article.tagList || []);
          setTags(data.article.tagList || []);
        }
      });
    }
  }, [articleSlug, setValue]);

  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        const updatedTags = [...tags, newTag.trim()];
        setTags(updatedTags);
        setValue("tagList", updatedTags); // به‌روزرسانی تگ‌ها در فرم
        setNewTag(""); // پاک کردن ورودی
      }
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    setValue("tagList", updatedTags);
  };
  const onSubmit = async (data) => {
    try {
      const articlePayload = {
        article: {
          body: data.body,
          description: data.description,
          title: data.title,
          tagList: data.tagList || [],
        },
      };

      const url = articleSlug
        ? `http://localhost:3000/api/articles/${articleSlug}`
        : "http://localhost:3000/api/articles";
      const method = articleSlug ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${authContext.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(articlePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "خطا در ثبت مقاله در سایت");
      }

      const responseData = await response.json();
      navigate(`/article/${responseData.article.slug}`);
      return responseData;
    } catch (error) {
      console.error("خطا در ورود:", error.message);
      throw error;
    }
  };

  return (
    <>
      <AuthenticatedUser
        page="NewArticle"
        username={authContext.userInfos?.username || ""}
        image={authContext.userInfos?.image || ""}
      />
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      {...register("title")}
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Article Title"
                    />
                    <ul className="error-messages">
                      {errors.title && <li>{errors.title.message}</li>}
                    </ul>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      {...register("description")}
                      type="text"
                      className="form-control"
                      placeholder="What's this article about?"
                    />
                    <ul className="error-messages">
                      {errors.description && (
                        <li>{errors.description.message}</li>
                      )}
                    </ul>
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      {...register("body")}
                      className="form-control"
                      rows="8"
                      placeholder="Write your article (in markdown)"
                    ></textarea>
                    <ul className="error-messages">
                      {errors.body && <li>{errors.body.message}</li>}
                    </ul>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleAddTag}
                      type="text"
                      className="form-control"
                      placeholder="Write tag and press Enter to add"
                    />
                    <div className="tag-list">
                      {(tags || []).map((tag) => (
                        <span key={tag} className="tag-default tag-pill">
                          {tag}
                          <i
                            onClick={() => handleRemoveTag(tag)}
                            className="ion-close-round"
                          ></i>
                        </span>
                      ))}
                    </div>
                  </fieldset>
                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="submit"
                  >
                    {articleSlug ? "Update Article" : "Publish Article"}
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
