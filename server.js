if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const User = require("./models/user");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  res.render("registration", { user: new User() });
});
app.get("/success", (req, res) => {
  res.render("success");
});
app.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.render("list", { users: users });
  } catch (e) {
    console.log(e);
    res.render("/");
  }
});
app.get("/edit/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("edit", { user: user });
});
app.get("/preRegistered", (req, res) => {
  res.render("preRegistered");
});
app.put("/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  let count;
  try {
    user.first_name = req.body.firstname;
    user.last_name = req.body.lastname;
    user.email = req.body.email;
    if (user.contact != req.body.contact) {
      let existingUser = await User.findOne({ contact: req.body.contact });
      if (existingUser == null) {
        user.contact = req.body.contact;
      } else {
        res.redirect("/preRegistered");
        return;
      }
    }
    res.redirect("/all");
    user = await user.save();
  } catch (e) {
    console.log(e);
    res.redirect("/edit/id");
  }
});
app.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/all");
  } catch (e) {
    console.log(e);
    res.redirect("/all");
  }
});
app.post("/register", async (req, res) => {
  const contact = req.body.contact;
  try {
    let user = await User.findOne({ contact: contact });
    if (user == null) {
      let user = new User({
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        contact: req.body.contact,
      });
      try {
        user = await user.save();
        res.redirect("/success");
      } catch (e) {
        console.log(e);
        res.redirect("/register");
      }
    } else {
      res.redirect("/preRegistered");
    }
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
