const express = require("express");
const router = express.Router();
const sha512 = require("js-sha512");
const config = require("../config");
const { verify } = require("jsonwebtoken");
const { createTokens, validateToken } = require("../JWT");

const User = require("../models/user");

router.get("/", function (req, res, next) {
  res.json({ title: "uzytkownik" });
});

router.post("/register", (req, res) => {
  const { name, last_name, email, password } = req.body;

  if (!name || !last_name || !email || !password) {
    res.json(400, { message: "Prosze uzupełnić wymagane pola" });
  }
  if (password.length < 8)
    res.json(400, { message: "Hasło musi sie składać z minimum 8 znaków" });
  if (email.length > 250)
    res.json(400, { message: "Email może zawierac maksymalnie 60 znaków" });

  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.json(400, { message: "Ten email jest już w użyciu." });
    } else {
      const newUser = new User({
        name,
        last_name,
        email: email.toLowerCase(),
        password,
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

  if (!email) res.json(400, { message: "Prosze uzupełnić email" });
  if (!password) res.json(400, { message: "Prosze uzupełnić hasło" });

  const user = User.findOne({
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
    email: token.email.toLowerCase(),
    _id: token.id,
  }).then((user) => {
    if (!user) {
      res.json(400, { message: "Niewłasciwy email lub id" });
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
        },
      });
    }
  });
});

module.exports = router;
