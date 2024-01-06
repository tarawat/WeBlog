import React, { useContext, useEffect, useState } from "react";
import "./write.css";
import axios from "axios";
import { Context } from "../../context/Context";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cats, setCats] = useState([]);
  const [categories, setCategories] = useState([]);
  const { user } = useContext(Context);

  useEffect(() => {
    const getCats = async () => {
      const resCats = await axios.get("/categories");
      setCats(resCats.data);
    };
    getCats();
  }, []);

  const handleCats = (e) => {
    e.preventDefault();
    if (e.target.style.backgroundColor === "lightskyblue") {
      e.target.style.backgroundColor = "#f0f0f0";
      e.target.style.color = "#797676";
      const ind = categories.indexOf(e.target.value);
      if (ind > -1) {
        categories.splice(ind, 1);
        console.log(categories);
      }
    } else {
      if (categories.length >= 4) {
        toast.info("You have selected maximum categories!");
      } else {
        e.target.style.backgroundColor = "lightskyblue";
        e.target.style.color = "white";
        setCategories((categories) => [...categories, e.target.value]);
      }
    }
  };

  const confirmPostPubish = () => {
    confirmDialog({
      message: "Do you want to Publish this post?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      accept: () => handlePublish(),
      reject: () => {
        toast.error("Post publishing Failed!");
      },
    });
  };

  const handlePublish = async (e) => {
    const newPost = {
      username: user.username,
      status: "published",
      title,
      desc,
      categories: categories,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.photo = filename;
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      const res = await axios.post("/posts", newPost);
      window.location.replace("/post/" + res.data._id);
      toast.success("Successfully published your post!");
    } catch (err) {
      toast.error("Something went Wrong");
    }
  };

  const handleDraft = async (e) => {
    e.preventDefault();
    const newPost = {
      username: user.username,
      status: "draft",
      title,
      desc,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.photo = filename;
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      await axios.post("/posts", newPost);
      window.location.replace(`${user.username}/drafts`);
      toast.success("Successfully drafted a post!");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="write">
      {file && (
        <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
      )}
      <form className="writeForm">
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />

          <input
            className="writeInput"
            autoFocus={true}
            type="text"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <CKEditor
          editor={ClassicEditor}
          data="<p>Start writing your blog...</p>"
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
        {/* <div className="writeFormGroup">
          <textarea
            placeholder="Tell Your Story.... "
            type="text"
            className="writeInput writeText"
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div> */}
        <div className="categoriesBox">
          {cats.map((cat) => (
            <button
              className="category"
              key={cat._id}
              value={cat.name}
              onClick={handleCats}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button type="button" className="writeDraft" onClick={handleDraft}>
          Draft
        </button>
        <button
          type="button"
          className="writeSubmit"
          onClick={confirmPostPubish}
        >
          Publish
        </button>
        <ConfirmDialog />
      </form>
    </div>
  );
}
