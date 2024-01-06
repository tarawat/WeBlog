import React from "react";
import "./header.css";
import HeaderImage from "./../../bannerImage.jpeg";
import HeaderImage2 from "./../../1657228477878.jfif";

export default function Header() {
  return (
    <div className="header">
      <div className="headerTitles">
        <span className="headerTitleLg">WEBLOG</span>
        <span className="headerTitleSm">Dream. Explore. Discover.</span>
      </div>
      {/* <img className="headerImage" src={HeaderImage2} alt="" /> */}
    </div>
  );
}
