const router = require("express").Router();
const Post = require("../models/Post");

// Create post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted!");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can Delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all published posts

router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username: username, status: "published" });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
        status: "published",
      });
    } else {
      posts = await Post.find({ status: "published" });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all published post of a user

router.get("/:username/published", async (req, res) => {
  try {
    let posts;
    posts = await Post.find({
      username: req.params.username,
      status: "published",
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json("published post error", err);
  }
});

// get all drafted post of a user

router.get("/:username/drafts", async (req, res) => {
  try {
    let posts;
    posts = await Post.find({
      username: req.params.username,
      status: "draft",
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json("Drafted post error", err);
  }
});

module.exports = router;
