import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../context/Context";
import "./singlePost.css";
import Dummy from "./../../dummy.png";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function SinglePost() {
  const PF = "http://localhost:5000/images/";
  const [post, setPost] = useState({});
  const params = useParams();
  const path = params.postId;
  const { user } = useContext(Context);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("");
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get("/posts/" + path);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setStatus(res.data.status);
    };
    getPost();
  }, [path]);

  const confirmPostDelete = () => {
    confirmDialog({
      message: "Do you want to delete this post?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(),
      reject: () => {
        toast.error("Delete Failed!");
      },
    });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${path}`, {
        data: { username: user.username },
      });
      window.location.replace("/");
      toast.success("Post Successfully deleted!");
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/posts/${path}`, {
        username: user.username,
        title,
        desc,
        status: "published",
      });
      window.location.reload();
      toast.success("Successfully published your post!");
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };
  const handleUpdateAsDraft = async () => {
    try {
      await axios.put(`/posts/${path}`, {
        username: user.username,
        title,
        desc,
        status: "draft",
      });
      window.location.replace(`/${user.username}/drafts`);
      toast.success("Successfully Drafted your post!");
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        <img
          src={post?.photo ? PF + post.photo : Dummy}
          alt=""
          className="singlePostImg"
        />

        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.username === user?.username ? (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon far fa-edit"
                  onClick={() => setUpdateMode(true)}
                ></i>
                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={confirmPostDelete}
                ></i>
                <ConfirmDialog />
              </div>
            ) : (
              ""
            )}
          </h1>
        )}

        <div className="singlePostInfo">
          <Link to={`/?user=${post.username}`} className="link">
            <span className="singlePostAuthor">
              Author : <b>{post.username}</b>
            </span>
          </Link>

          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString() + " " + new Date(post.createdAt).toLocaleTimeString()}
          </span>
        </div>
        {updateMode ? (
          <>
            {/* <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          /> */}
            <CKEditor
              editor={ClassicEditor}
              data={desc}
              onReady={(editor) => {
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setDesc(data);
                console.log({ event, editor, data });
              }}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
          </>
        ) : (
          <>
            {/* <div id="editor">{desc}</div> */}
            <div
              style={{ wordWrap: "break-word", display: "inline-block" }}
            ></div>
            <div
              className="editor"
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          </>
        )}
        {updateMode ? (
          status === "draft" ? (
            <>
              <button
                className="singlePostButton"
                onClick={handleUpdateAsDraft}
              >
                Save as Draft
              </button>
              <button className="singlePostButton" onClick={handleUpdate}>
                {" "}
                Publish
              </button>
            </>
          ) : (
            <button className="singlePostButton" onClick={handleUpdate}>
              Update
            </button>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
