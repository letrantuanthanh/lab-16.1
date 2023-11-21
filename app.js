const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorRoutes = require("./routes/error");
const User = require("./models/user");
const isAuth = require("./middleware/is-auth");

const URL = "mongodb+srv://thanhle:546546@atlascluster.dzyzysn.mongodb.net/";

const app = express();
const store = new MongoDBStore({
  uri: URL,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");
app.use(
  session({
    secret: "testing",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  console.log(req.session);
  const userId = req.session.userId;
  if (userId) {
    User.findById(userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => console.log(err));
  } else {
    next();
  }
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.use("/admin", isAuth, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);

mongoose
  .connect(URL)
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
