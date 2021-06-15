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
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id, // 로그인 된 상태기 때문에,
    });
    return res.status(201).json(comment);
  } catch (err) {
    console.error(error);
    next(error);
  }
});

router.delete("/", isLoggedIn, (req, res) => {
  res.json({ id: 1 });
});

module.exports = router;
