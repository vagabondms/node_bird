require("dotenv").config();

const db = require("./models");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");

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

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(morgan("dev"));
app.use(express.json("nodebirdsecret")); // json 형식을 req body에
app.use(express.urlencoded({ extended: true })); // form 형식을 받을 때,

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/posts", postsRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
