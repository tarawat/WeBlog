import React from "react";
import "./post.css";
import { Link } from "react-router-dom";
import Dummy from "./../../dummy.png";

export default function Post({ post }) {
  const PF = "http://localhost:5000/images/";
  return (
    <Link to={`/post/${post._id}`} className="link">
      <div className="post">
        {/* {post.photo && <img className="postImg" src={PF + post.photo} alt="" />} */}
        <img
          className="postImg"
          src={post?.photo ? PF + post.photo : Dummy}
          alt=""
        />
        <div className="postInfo">
          <div className="postCats">
            {post.categories.length !== 0 ? (
              post.categories.map((cat) => (
                <span className="postCat">{cat}</span>
              ))
            ) : (
              <span>{"  "}</span>
            )}
          </div>
          <span className="postTitle">{post.title}</span>
          <div className="authorAnddate">
            <span className="postAuthor">By: {post.username}</span>
            <span className="postDate">
              {new Date(post.createdAt).toDateString() +
                " " +
                new Date(post.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
        {/* <p className="postDesc">{post.desc}</p> */}
        <div
          className="postDesc"
          style={{ wordWrap: "break-word", display: "inline-block" }}
        ></div>
        <div
          className="postDesc editor"
          dangerouslySetInnerHTML={{ __html: post.desc }}
        />
      </div>
    </Link>
  );
}
