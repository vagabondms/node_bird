const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Post, Image, User, Comment } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 생성");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      done(null, basename + "_" + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, // 로그인 된 상태기 때문에,
    });
    if (req.body.image) {
      let images;
      if (Array.isArray(req.body.Image)) {
        // Image가 여러개면 배열로 들어옴.
        images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
      } else {
        images = await Image.create({ src: req.body.image });
      }
      await post.addImages(images);
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      attributes: { exclude: ["createdAt", "updateAt"] },
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
        { model: User, as: "Likers", attributes: ["id"] },
      ],
    });

    return res.status(201).json(fullPost);
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

router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
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

router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
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

router.delete("/:postId", isLoggedIn, async (req, res) => {
  try {
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });
    res.status(200).send({ PostId: Number(req.params.postId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post(
  "/images",
  isLoggedIn,
  upload.array("image"), // upload까지 진행되면 req.files에 업로드된 파일들의 정보가 들어있다.
  async (req, res, next) => {
    try {
      console.log(req.files);
      res.json(req.files.map((el) => el.filename));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;
