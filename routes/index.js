const express = require("express");
const router = express.Router();
const sha512 = require("js-sha512");
const config = require("../config");
const Article = require("../models/article");
const { verify } = require("jsonwebtoken");
const { createTokens, validateToken } = require("../JWT");
const User = require("../models/user");

router.get("/article", (req, res) => {
  console.log("pobiera artykuly");
  articleList = Article.find();
  articleList.sort({ date: -1 });
  articleList.exec((err, articleList) => {
    if (err) {
      console.log("error skad blad", err);
      res.json(400, { err });
    }
    if (!articleList) {
      console.log("brak artykulow");
      res.json(200, { message: "Brak artykułów" });
    }
    res.json(200, { articleList });
  });
});

router.get("/get-article/:id", (req, res) => {
  const { id } = req.params;
  console.log("pobieram 1 artyukl po id:", id);
  const article = Article.findOne({
    _id: id,
  }).then((article) => {
    if (!article) {
      res.json(400, { message: "Error Brak artykułu" });
    } else {
      res.json(200, { article });
    }
  });
});

router.post("/register", (req, res) => {
  const { name, last_name, email, password, orcid_number, affiliation } =
    req.body;

  if (!name || !last_name || !email || !password) {
    res.json(400, { message: "Proszę uzupełnić wymagane pola" });
  }
  if (password.length < 8)
    res.json(400, { message: "Hasło musi się składać z minimum 8 znaków" });
  if (email.length > 30)
    res.json(400, { message: "Email może zawierać maksymalnie 30 znaków" });

  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.json(400, { message: "Ten email jest już w użyciu." });
    } else {
      const newUser = new User({
        name,
        last_name,
        email: email.toLowerCase(),
        password,
        orcid_number,
        affiliation,
      });
      newUser.password = sha512(newUser.password);
      newUser
        .save()
        .then((user) => {
          res.json({
            message: "Rejestracja powiodła się",
          });
        })
        .catch((err) => res.json(400, err));
    }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const hashpassword = sha512(password);
  if (!email || !password)
    res.json(400, { message: "Proszę uzupełnić wymagane pola" });
  User.findOne({
    email: email.toLowerCase(),
    password: hashpassword,
  }).then((user) => {
    if (!user) {
      res.json(400, { message: "Niewłasciwy email lub hasło" });
    } else {
      const accessToken = createTokens(user);
      res.json(200, {
        message: "Zostałeś prawidłowo zalogowany",
        is_logged: true,
        accessToken,
        user: {
          name: user.name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
        },
      });
    }
  });
});

router.post("/logout", validateToken, (req, res) => {
  console.log("wylgoggowywuje");
  res.json(200, { message: "Zostałeś/aś poprawnie wylogowany/na" });
});

router.post("/session", validateToken, (req, res) => {
  console.log("sprawdzam sesje");
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  const user = User.findOne({
    email: token?.email?.toLowerCase(),
    _id: token?.id,
  }).then((user) => {
    if (!user) {
      res.json(400, { message: "Brak użytkownika" });
    } else {
      const accessToken = createTokens(user);
      res.json(200, {
        message: "sesja odswiezona",
        is_logged: true,
        accessToken,
        user: {
          name: user.name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
        },
      });
    }
  });
});

module.exports = router;
