const db = require("./models");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const port = 4000;

const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const passportConfig = require("./passport");

db.sequelize
  .sync()
  .then(() => console.log("db 연결됨"))
  .catch(console.err);

passportConfig();

let corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json()); // json 형식을 req body에
app.use(express.urlencoded({ extended: true })); // form 형식을 받을 때,

app.use("/posts", postsRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
