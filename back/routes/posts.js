const express = require("express");

const { Post, User, Image, Comment } = require("../models");
const { Op } = require("sequelize");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const where = {};
    if (Number(req.query.lastId)) {
      //초기 로딩이 아닐 때
      where.id = { [Op.lt]: Number(req.query.lastId) };
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        { model: Image },
        {
          model: Comment,
          include: { model: User, attributes: ["id", "nickname"] },
        },
        { model: User, as: "Likers", attributes: ["id"] },
      ],
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
