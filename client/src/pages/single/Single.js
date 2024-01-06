import React from "react";
import SideBar from "../../components/sidebar/SideBar";
import SinglePost from "../../components/singlePost/SinglePost";
import "./single.css";

export default function single() {
  return (
    <div className="single">
      <SinglePost />
      <SideBar />
    </div>
  );
}
