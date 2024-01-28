var express = require("express");
var router = express.Router();
const Product = require("../models/product");
const config = require("../config");
const { verify } = require("jsonwebtoken");
const { createTokens, validateToken } = require("../JWT");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

router.put("/edit-product/:id", validateToken, (req, res) => {
  //sciagam tokena z headera
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);

  console.log("co leci z frontu??", req.body);
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
    ending_date,
    period_after_opening,
    expiration_date,
    final_expiration_date,
    product_price,
  } = req.body;
  //jesli doi number jest czymkolwiek wtedy
  if (!_id) {
    res.json(400, { message: "Błąd brak id artykułu?" });
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
      user: token.id,
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
      ending_date: ending_date,
      period_after_opening: period_after_opening,
      expiration_date: expiration_date,
      final_expiration_date: final_expiration_date,
      product_price: product_price,
      edit_date: Date.now(),
    }
  );
  editProduct.exec((err, editProduct) => {
    if (err) {
      console.log("błąd serwera", err);
      res.json(400, { message: "Błąd serwera" });
    }
    if (!editProduct) {
      res.json(400, { message: "Nie ma takiego produkty" });
    }
    res.json(200, { message: "Produkt został pomyślnie zedytowany" });
  });
});
//++

const statusHelper = (starting_date, ending_date) => {
  if (!starting_date && !ending_date) {
    return "unused";
  }
  if (starting_date && !ending_date) {
    return "open";
  }
  return "used";
};

router.post("/add-product", validateToken, (req, res) => {
  //sciagam tokena z headera
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);

  console.log("bedzie dodane nowe produkty", token);
  const {
    brand,
    main_category,
    secondary_category,
    product_short_name,
    product_description,
    product_capacity,
    unit_of_capacity,
    starting_date,
    ending_date,
    period_after_opening,
    expiration_date,
    final_expiration_date,
    product_price,
  } = req.body;

  if (!brand || !main_category || !secondary_category || !product_short_name) {
    res.json(400, { message: "Proszę uzupełnić wymagane pola" });
  }
  if (brand.length < 1) {
    res.json(400, { message: "Nazwa producenta jest za krótka" });
  }
  if (product_short_name.length < 3) {
    res.json(400, { message: "Nazwa produktu jest za krótka" });
  }

  const newStatus = statusHelper(starting_date, ending_date);
  console.log("status", newStatus);
  const newProduct = new Product({
    brand: brand,
    main_category: main_category,
    secondary_category: secondary_category,
    product_short_name: product_short_name,
    product_description: product_description,
    product_capacity: product_capacity,
    unit_of_capacity: unit_of_capacity,
    starting_date: starting_date,
    ending_date: ending_date,
    period_after_opening: period_after_opening,
    expiration_date: expiration_date,
    final_expiration_date: final_expiration_date,
    product_price: product_price,
    creationDate: Date.now(),
    user: token.id,
    status: newStatus,
  });

  newProduct.save((err) => {
    if (!err) {
      console.log("Produkt zostal dodany pomyślnie");
      res.json(200, { message: "Produkt zostal dodany pomyślnie" });
    } else {
      console.log("error:", err);
      res.json(400, err);
    }
  });
});

//++

router.get("/get-product-list", validateToken, (req, res) => {
  console.log("pobieram liste produktow", req?.query || "brak query");
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  // 'name.last': 'Ghost',
  const {
    brand,
    main_category,
    secondary_category,
    product_short_name,
    status,
  } = req.query;

  // productList = Product.find({
  //   user: token.id,
  //   $brand: { $search: `"${brand}"` },
  // });

  productList = Product.find({
    $and: [
      {
        $and: [
          {
            brand: { $regex: brand || "", $options: "i" },
          },
          {
            product_short_name: {
              $regex: product_short_name || "",
              $options: "i",
            },
          },
          {
            main_category: { $regex: main_category || "", $options: "i" },
          },
          {
            secondary_category: {
              $regex: secondary_category || "",
              $options: "i",
            },
          },
          {
            status: { $regex: status || "", $options: "i" },
          },
        ],
      },
      {
        user: token.id,
      },
    ],
  });
  productList.sort({ date: -1 });
  productList.exec((err, list) => {
    if (err) {
      res.json(400, err);
    }
    if (!list) {
      res.json({ message: "Brak produktów" });
    }
    res.json({ productList: list });
  });
});

//POBIERZ JEDEN ARTYKUL
router.get("/get-product/:id", validateToken, (req, res) => {
  // const accessToken = req.headers["x-access-token"];
  // const token = verify(accessToken, config.JWT_SECRET);
  const { id } = req.params;

  const product = Product.findOne({
    _id: id,
  }).then((product) => {
    if (!product) {
      res.json(400, { message: "Error Brak produktu" });
    } else {
      res.json(200, { product });
    }
  });
});

router.delete("/delete-product/:id", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);

  const { id } = req.params;

  console.log("błąd 1");
  const product = Product.findByIdAndDelete({
    _id: id,
  }).then((product) => {
    if (!product) {
      console.log("błąd 2");
      res.json(400, { message: "Brak produktu do usuniecia" });
    } else {
      console.log("błąd 3");
      res.json(200, { message: "Produkt został pomyślnie usunięty" });
    }
  });
});
