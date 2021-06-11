const express = require("express");
const app = express();
const port = 3000;

const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");

app.get("/", (req, res) => {
  res.send("hi");
});
// app.use("/posts", postsRouter);
app.use("/post", postRouter);
// app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
