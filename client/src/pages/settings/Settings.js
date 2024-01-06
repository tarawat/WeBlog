import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import "./settings.css";
import Avatar from "../../avatar.jpg";
import { Link } from "react-router-dom";
import Posts from "../../components/posts/Posts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";

export default function Settings({ blognum }) {
  const PF = "http://localhost:5000/images/";
  const { user, dispatch } = useContext(Context);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [blogStatus, setBlogStatus] = useState(blognum || 0);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);

  useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`/posts/${user.username}/published`);
      setPublishedPosts(res.data);
    };
    fetchPosts();
  }, [user.username, publishedPosts]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`/posts/${user.username}/drafts`);
      setDraftPosts(res.data);
    };
    fetchPosts();
  }, [user.username, draftPosts]);

  const confirmUserDelete = () => {
    confirmDialog({
      message: "Do you want to delete your account?",
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
      await axios.delete(`/users/${user._id}`, {
        data: { userId: user._id },
      });
      toast.success("User Successfully Deleted!!!");
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
      window.location.replace("/login");
    } catch (err) {
      toast.error("Something went wrong!!!");
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_START" });
    const updatedUser = {
      userId: user._id,
      username,
      email,
      bio,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      updatedUser.profilePicture = filename;
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      const res = await axios.put(`/users/${user._id}`, updatedUser);

      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
      window.location.reload();
      toast.success("Profile has been updated...");
    } catch (err) {
      toast.erroor("Something went wrong!!");
      dispatch({ type: "UPDATE_FAILURE" });
    }
  };
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span
            className="settingsUpdateTitle"
            onClick={() => setUpdateMode(!updateMode)}
          >
            Update Your Account
          </span>
          <span className="settingsDeleteTitle" onClick={confirmUserDelete}>
            Delete Your Account
          </span>
        </div>
        <form className="settingsForm" onSubmit={handleUpdate}>
          <div className="settingsProfilePic">
            <img
              className="settingsProfilePicImg"
              // src={file ? URL.createObjectURL(file) : PF + user.profilePicture}
              src={
                file
                  ? URL.createObjectURL(file)
                  : user?.profilePicture
                  ? PF + user.profilePicture
                  : Avatar
              }
              alt=""
            />
            {updateMode ? (
              <>
                <label
                  className="settingsUpdateProfileIcon"
                  htmlFor="fileInput"
                >
                  <i className="settingsProfilePicIcon fa fa-pencil"></i>
                </label>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </>
            ) : (
              ""
            )}
          </div>
          <div className="formDetails">
            <p className="userDetails">
              {user.username}
              {"     "}
              <i class="fa fa-info-circle" title="Username is not editable"></i>
            </p>

            {updateMode ? (
              <>
                {/* <label>Email</label> */}
                <input
                  type="email"
                  placeholder={user.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            ) : (
              <p className="userDetails">{user.email}</p>
            )}

            {updateMode ? (
              <>
                {/* <label>Your Bio</label> */}
                <textarea
                  rows="4"
                  cols="50"
                  maxlength="150"
                  placeholder={user.bio}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </>
            ) : (
              <p
                className="userBio"
                title={user.bio ? user.bio : "No Bio Available"}
              >
                {user.bio ? user.bio : "No Bio Available"}
              </p>
            )}
            {updateMode ? (
              <button className="settingsSubmit">Update</button>
            ) : (
              ""
            )}
            <ConfirmDialog />
          </div>
        </form>
        <div className="settingsPost">
          <div className="titleHeader">
            <Link to={`/${user.username}/published`} className="link">
              <div className="titleHeaderItem">
                <div
                  className={`cp-btn ${blogStatus === 0 ? "active" : ""}`}
                  onClick={() => setBlogStatus(0)}
                >
                  Published Blogs
                </div>
              </div>
            </Link>
            <Link to={`/${user.username}/drafts`} className="link">
              <div className="titleHeaderItem">
                <div
                  className={`cp-btn ${blogStatus === 1 ? "active" : ""}`}
                  onClick={() => setBlogStatus(1)}
                >
                  Drafts
                </div>
              </div>
            </Link>
          </div>
          {blogStatus === 0 ? (
            <Posts posts={publishedPosts} />
          ) : (
            <Posts posts={draftPosts} />
          )}
        </div>
      </div>
      {/* <SideBar /> */}
    </div>
  );
}
