const express = require("express");
const router = express.Router();
const sha512 = require("js-sha512");
const config = require("../config");
// const Product = require("../models/product");
const { verify } = require("jsonwebtoken");
const { createTokens, validateToken } = require("../JWT");
const User = require("../models/user");

// router.get("/my-product", (req, res) => {
//   productList = Product.find();
//   productList.sort({ date: -1 });
//   productList.exec((err, productList) => {
//     if (err) {
//       res.json(400, { err });
//     }
//     if (!productListList) {
//       res.json(200, { message: "Brak produktów" });
//     }
//     res.json(200, { productListList });
//   });
// });
router.get("/", (req, res) => {
  res.json(200, { message: "server responding" });
});
// router.get("/get-product/:id", (req, res) => {
//   const { id } = req.params;

//   const product = Product.findOne({
//     _id: id,
//   }).then((product) => {
//     if (!product) {
//       res.json(400, { message: "Error Brak produktu" });
//     } else {
//       res.json(200, { product });
//     }
//   });
// });

router.post("/register", (req, res) => {
  const { email, firstName, sex, password, confirmPassword, rules } = req.body;

  if (!email || !password || !confirmPassword || !rules || !sex || !firstName) {
    res.json(400, { message: "Proszę uzupełnić wymagane pola" });
  }
  if (password.length < 6)
    res.json(400, { message: "Hasło musi się składać z minimum 5 znaków" });

  if (password !== confirmPassword)
    res.json(400, { message: "Hasła się różnią" });

  if (email.length > 30)
    res.json(400, { message: "Email może zawierać maksymalnie 30 znaków" });

  if (!rules) res.json(400, { message: "Zgody są wymagane" });

  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.json(400, { message: "Ten email jest już w użyciu." });
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
  res.json(200, { message: "Zostałeś/aś poprawnie wylogowany/na" });
});

router.post("/session", validateToken, (req, res) => {
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
