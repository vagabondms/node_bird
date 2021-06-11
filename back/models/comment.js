"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
      this.belongsTo(models.Post);
    }
  }
  Comment.init(
    {
      // id가 기본적으로 들어있다.
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // UserId: 1
      // PostId: 3
    },
    {
      modelName: "Comment",
      tableName: "comments",
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", // 이모티콘 저장
      sequelize,
    }
  );
  return comment;
};
