const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const LoginRegister = require("./routes/LoginRegisterRouter");
const NewPhotoRouter = require("./routes/NewPhotoRouter")
const path = require('path');
// const CommentRouter = require("./routes/CommentRouter");

dbConnect();
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use("/images", express.static(path.join(__dirname+"/images")))

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
  }),
);
app.use(cors(corsOptions));
app.use(express.json());
app.use("/admin", LoginRegister);
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/api/photos", NewPhotoRouter);
app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
