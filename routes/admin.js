var express = require("express");
var router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const config = require("../config");
const { verify } = require("jsonwebtoken");
const { createTokens, validateToken } = require("../JWT");

module.exports = router;

router.put("/edit-user/:id", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);

  if (token.role !== "admin") {
    res.json(400, { message: "Brak uprawnień" });
  }
  const { id } = req.params;

  const { name, email } = req.body;

  if (!id) {
    res.json(400, { message: "Błąd brak id usera?" });
  }
  if (!name || !email) {
    res.json(400, { message: "Proszę uzupełnić wszystkie pola" });
  }
  if (name.length < 2) {
    res.json(400, { message: "Nazwa jest za krótka" });
  }

  if (email.length < 5) {
    res.json(400, { message: "Email jest za krótki" });
  }

  const editUser = User.findByIdAndUpdate(
    { _id: id },
    { name: name, email: email, creation_date: undefined, editDate: Date.now() }
  );
  editUser.exec((err, editUser) => {
    if (err) {
      res.json(400, { message: "Błąd serwera" });
    }
    if (!editUser) {
      res.json(400, { message: "Nie ma takiego użytkownika" });
    }

    res.json(200, { message: "Edycja się powiodła" });
  });
});

router.get("/get-user-list", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  if (token.role !== "admin") {
    res.json(400, { message: "Brak uprawnień" });
  }

  userList = User.find();
  userList.sort({ date: -1 });
  userList.exec((err, userList) => {
    if (err) {
      res.json(400, err);
    }
    if (!userList) {
      res.json({ message: "Brak użytkowników", userList: [] });
    }
    res.json({ userList });
  });
});

router.get("/get-user/:id", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  if (token.role !== "admin") {
    res.json(400, { message: "Brak uprawnień" });
  }
  const { id } = req.params;

  const user = User.findOne({
    _id: id,
  }).then((user) => {
    if (!user) {
      res.json(400, { message: "Brak" });
    } else {
      const selectedUser = {
        name: user?.name || "",
        email: user?.email || "",
      };
      res.json(200, { user: selectedUser });
    }
  });
});

router.put("/edit-product", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  if (token.role !== "admin") {
    res.json(400, { message: "Brak uprawnień" });
  }

  const {
    _id,
    brand,
    main_category,
    secondary_category,
    product_short_name,
    product_description,
    product_capacity,
    unit_of_capacity,
    starting_date,
    endind_date,
    period_after_opening,
    expiration_date,
    final_expiration_date,
    product_price,
  } = req.body;

  if (!_id) {
    res.json(400, { message: "Błąd brak id produktu?" });
  }
  if (!brand || !main_category || !secondary_category || !product_short_name) {
    res.json(400, { message: "Proszę uzupełnić wszystkie pola" });
  }
  if (brand.length < 1) {
    res.json(400, { message: "Nazwa producenta jest za krótka" });
  }
  if (product_short_name.length < 3) {
    res.json(400, { message: "Nazwa produktu jest za krótka" });
  }

  const editProduct = Product.findByIdAndUpdate(
    {
      _id: _id,
    },
    {
      brand: brand,
      main_category: main_category,
      secondary_category: secondary_category,
      product_short_name: product_short_name,
      product_description: product_description,
      product_capacity: product_capacity,
      unit_of_capacity: unit_of_capacity,
      starting_date: starting_date,
      endind_date: endind_date,
      period_after_opening: period_after_opening,
      expiration_date: expiration_date,
      final_expiration_date: final_expiration_date,
      product_price: product_price,
      editDate: Date.now(),
    }
  );
  editProduct.exec((err, editProduct) => {
    if (err) {
      res.json(400, { message: "Błąd serwera" });
    }
    if (!editProduct) {
      res.json(400, { message: "Nie ma takiego produktu" });
    }
    res.json(200, { message: "Produkt został pomyślnie zedytowany" });
  });
});

router.get("/get-product-list/:id", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  if (token.role !== "admin") {
    res.json(400, { message: "Brak uprawnień" });
  }
  const { id } = req.params;

  productList = Product.find({
    user: id,
  });
  productList.sort({ date: -1 });
  productListList.exec((err, productList) => {
    if (err) {
      res.json(400, err);
    }
    if (!productListList) {
      res.json({ message: "Brak produktów" });
    }
    res.json({ productListList });
  });
});

router.delete("/delete-user-product/:id", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  if (token.role !== "admin") {
    res.json(400, { message: "Brak uprawnień" });
  }
  const { id } = req.params;

  const product = Product.findByIdAndDelete({
    _id: id,
  }).then((product) => {
    if (!product) {
      res.json(400, { message: "Brak produktu do usuniecia" });
    } else {
      res.json(200, { message: "Produkt został pomyślnie usunięty" });
    }
  });
});
