const express = require("express");

const { Post, Image, User, Comment } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = await Post.create({
      content: req.body.content,
      UserId: req.user.id, // 로그인 된 상태기 때문에,
    });
    const post = await Post.findOne({
      where: { id },
      attributes: { exclude: ["createdAt", "updateAt", "UserId"] },
      include: [
        {
          model: Image,
        },
        {
          model: User,
        },
        {
          model: Comment,
        },
      ],
    });
    console.log(post);
    return res.status(201).json(post);
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      wehre: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다");
    }
    const { id } = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id, // 로그인 된 상태기 때문에,
    });
    const commentWithUser = await Comment.findOne({
      where: { id },
      include: [{ model: User, attributes: ["id", "nickname"] }],
    });

    return res.status(201).json(commentWithUser);
  } catch (err) {
    console.error(error);
    next(error);
  }
});

router.patch("/:postId/like", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      res.status(403).send("게시글이 존재하지 않습니다.");
      return;
    } else {
      post.addLikers(req.user.id);
      res.status(200).json({ PostId: post.id, UserId: req.user.id });
      return;
    }
  } catch (error) {
    console.error(error);
    next(error);
    return;
  }
});

router.delete("/:postId/like", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      res.status(403).send("게시글이 존재하지 않습니다.");
      return;
    } else {
      post.removeLikers(req.user.id);
      res.status(200).json({ PostId: post.id, UserId: req.user.id });
      return;
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/", isLoggedIn, (req, res) => {
  res.json({ id: 1 });
});

module.exports = router;
