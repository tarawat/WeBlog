import React from "react";
import "./posts.css";
import Post from "../post/Post";

export default function Posts({ posts }) {
  return (
    <div className="posts">
      {posts.length > 0 ? (
        posts
          .slice(0)
          .reverse()
          .map((post) => <Post post={post} key={post._id} />)
      ) : (
        <h2 className="noPostsTitle">No Posts Found</h2>
      )}
    </div>
  );
}
