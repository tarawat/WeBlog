import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./topbar.css";
import Avatar from "../../avatar.jpg";
import Logo from "./../../Logo2.png"
import Modal from "react-modal";
import axios from "axios";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import { toast } from "react-toastify";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function TopBar() {
  const PF = "http://localhost:5000/images/";
  const { user, dispatch } = useContext(Context);
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState("");

  const confirmLogout = () => {
    confirmDialog({
      message: "Do you want to Logout?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      accept: () => handleLogout(),
      reject: () => {
        toast.error("Logout Failed!");
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    
    dispatch({ type: "LOGOUT" });
    window.location.replace("/login");
    toast.success("Logout Successfull!!");
  };

  const toggleShow = () => {
    setShow(!show);
  };

  const handleCategory = async (e) => {
    e.preventDefault();
    const cat = {
      name: category,
    };
    try {
      await axios.post("/categories", cat);
      toast.success("You have Successfully added a Category!");
    } catch (err) {
      toast.error("Something went Wrong!");
      console.log(err);
    }
    setShow(!show);
  };

  return (
    <div className="top">
      <div className="topLeft">
        <img className="brandLogo" src={Logo} alt="" />
      </div>
      <div className="topCenter">
        <ul className="topList">
          <li className="topListItem">
            <Link className="link" to="/">
              Home
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/write">
              Write
            </Link>
          </li>
          <li className="topListItem" onClick={toggleShow}>
            {user && "Add Category"}
          </li>
          <Modal
            isOpen={show}
            onRequestClose={toggleShow}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div style={{ position: "relative" }}>
              <h2 className="catHeading">Add Category</h2>
              <button className="closeBTN" onClick={toggleShow}>
                <i class="fa-solid fa-xmark"></i>
              </button>
              <form className="catForm">
                <input
                  type="text"
                  placeholder="Category"
                  autoFocus
                  onChange={(e) => setCategory(e.target.value)}
                />
                <button className="catSubmit" onClick={handleCategory}>
                  Submit
                </button>
              </form>
            </div>
          </Modal>
          <li className="topListItem" onClick={confirmLogout}>
            {user && "Logout"}
          </li>
        </ul>
      </div>
      <div className="topRight">
        {user ? (
          <Link to={`/${user.username}`}>
            <img
              className="topImage"
              // src={PF + user.profilePicture}
              src={user?.profilePicture ? PF + user.profilePicture : Avatar}
              alt=""
            />
          </Link>
        ) : (
          <ul className="topList">
            <li className="topListItem">
              <Link className="link" to="/login">
                Login
              </Link>
            </li>
            <li className="topListItem">
              <Link className="link" to="/register">
                Register
              </Link>
            </li>
          </ul>
        )}
        <ConfirmDialog />
        <i className="topSearchIcon fas fa-search"></i>
      </div>
    </div>
  );
}
