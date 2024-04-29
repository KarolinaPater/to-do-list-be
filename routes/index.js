const express = require("express");
const router = express.Router();
const sha512 = require("js-sha512");
const config = require("../config");

const { verify } = require("jsonwebtoken");
const { createTokens, validateToken } = require("../JWT");
const User = require("../models/user");

router.get("/", (req, res) => {
  res.json(200, { message: "server responding" });
});

router.post("/register", (req, res) => {
  const { email, firstName, sex, password, confirmPassword, rules } = req.body;

  if (!email || !password || !confirmPassword || !rules || !sex || !firstName) {
    res.status(400).json({ message: "Proszę uzupełnić wymagane pola" });
  }
  if (password.length < 6)
    res
      .status(400)
      .json({ message: "Hasło musi się składać z minimum 5 znaków" });

  if (password !== confirmPassword)
    res.status(400).json({ message: "Hasła się różnią" });

  if (email.length > 30)
    res
      .status(400)
      .json({ message: "Email może zawierać maksymalnie 30 znaków" });

  if (!rules) res.status(400).json({ message: "Zgody są wymagane" });

  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.status(400).json({ message: "Ten email jest już w użyciu." });
    } else {
      const newUser = new User({
        firstName,
        sex,
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
        .catch((err) => res.status(400).json(err));
    }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const hashpassword = sha512(password);
  if (!email || !password)
    res.status(400).json({ message: "Proszę uzupełnić wymagane pola" });
  User.findOne({
    email: email.toLowerCase(),
    password: hashpassword,
  }).then((user) => {
    if (!user) {
      res.status(400).json({ message: "Niewłasciwy email lub hasło" });
    } else {
      const accessToken = createTokens(user);
      res.status(200).json({
        message: "Zostałeś prawidłowo zalogowany",
        isLogged: true,
        accessToken,
        user: {
          firstName: user.firstName,
          email: user.email,
          sex: user.sex,
        },
      });
    }
  });
});

router.post("/logout", validateToken, (req, res) => {
  res.status(200).json({ message: "Zostałeś/aś poprawnie wylogowany/na" });
});

router.post("/session", validateToken, (req, res) => {
  const accessToken = req?.headers["x-access-token"];

  const token = verify(accessToken, config.JWT_SECRET);

  const user = User.findOne({
    email: token?.email?.toLowerCase(),
    _id: token?.id,
  }).then((user) => {
    if (!user) {
      res.status(400).json({ message: "Brak użytkownika" });
    } else {
      const accessToken = createTokens(user);
      res.status(200).json({
        message: "sesja odswiezona",
        isLogged: true,
        accessToken,
        user: {
          firstName: user.firstName,
          email: user.email,
          sex: user.sex,
        },
      });
    }
  });
});

module.exports = router;
