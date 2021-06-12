"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Post);
      this.hasMany(models.Comment);
      this.belongsToMany(models.Post, { through: "Like", as: "Liked" });
      this.belongsToMany(this, {
        through: "Follow",
        as: "Followers",
        foreignKey: "FollowingId",
      });
      this.belongsToMany(this, {
        through: "Follow",
        as: "Followings", // 특정 user가 following 하는 사람들을 찾으려면, FollowerId를 찾아야함
        foreignKey: "FollowerId",
      });
    }
  }
  User.init(
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
  return User;
};
