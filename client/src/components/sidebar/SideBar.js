import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./sidebar.css";
import Avatar from "./../../avatar.jpg";

export default function SideBar() {
  const [cats, setCats] = useState([]);
  const { user } = useContext(Context);
  const PF = "http://localhost:5000/images/";
  useEffect(() => {
    const getCats = async () => {
      const res = await axios.get("/categories");
      setCats(res.data);
    };
    getCats();
  }, []);
  return (
    <div className="sidebar">
      <div className="sidebarItem">
        <span className="sidebarTitle">ABOUT ME</span>
        <img
          // src={user?.profilePicture && PF + user.profilePicture}
          src={user?.profilePicture ? PF + user.profilePicture : Avatar}
          alt=""
        />
        <p className="sidebarUsername">{user ? user.username : "Hey Guest"}</p>
        {user ? (
          <p className="sidebarBio">
            {user.bio ? user.bio : "No Bio Available"}
          </p>
        ) : (
          <p>No Bio Available</p>
        )}
      </div>
      <div className="sidebarItem">
        <span className="sidebarTitle">CATEGORIES</span>
        <ul className="sidebarList">
          {cats.slice(0, 12).map((cat) => (
            <Link to={`/?cat=${cat.name}`} className="link">
              <li className="sidebarListItem">{cat.name}</li>
            </Link>
          ))}
        </ul>
      </div>
      <div className="sidebarItem">
        <span className="sidebarTitle">FOLLOW US</span>
        <div className="sidebarSocial">
          <i className="sidebarIcon fa-brands fa-facebook-square"></i>
          <i className="sidebarIcon fa-brands fa-twitter-square"></i>
          <i className="sidebarIcon fa-brands fa-instagram-square"></i>
        </div>
      </div>
    </div>
  );
}
