"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User); // post.addUser, post.getUser, post.setUser
      this.belongsToMany(models.Hashtag, { through: "PostHashtag" }); // post.addHashtags
      this.hasMany(models.Comment); // post.addComments, post.getComments
      this.hasMany(models.Image); // post.addImages, post.getImages
      this.belongsToMany(models.User, { through: "Like", as: "Likers" }); // post.addLikers, post.removeLikers
      this.belongsTo(this, { as: "Retweet" }); // post.addRetweet
    }
  }
  Post.init(
    {
      // id가 기본적으로 들어있다.
      email: {
        type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
    },
    {
      modelName: "User",
      tableName: "users",
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
      sequelize,
    }
  );
  return comment;
};
