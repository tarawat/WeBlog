import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import SideBar from "../../components/sidebar/SideBar";
import Posts from "../../components/posts/Posts";
import "./home.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { search } = useLocation();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("/posts" + search);
      setPosts(res.data);
    };
    fetchPosts();
  }, [search]);

 
  return (
    <>
      <Header />
      <div className="home">
        {posts.length === 0 ? (
          <>
            <h2 className="noPostsTitle">No Posts Found</h2>
            {/* <PropagateLoader color="#f4709c" className="spin" size={30} /> */}
            <SideBar />
          </>
        ) : (
          <>
            <Posts posts={posts} />
            <SideBar />
          </>
        )}
      </div>
    </>
  );
}
