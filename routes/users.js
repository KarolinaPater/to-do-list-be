var express = require("express");
var router = express.Router();
const Article = require("../models/article");
const config = require("../config");
const { verify } = require("jsonwebtoken");
const { createTokens, validateToken } = require("../JWT");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

router.put("/edit-article", (req, res) => {
  console.log("konsollog w edit article");
  //sciagam tokena z headera
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);

  const { _id, doi_number, article_theme, authors, sources, summary } =
    req.body;
  //jesli doi number jest czymkolwiek wtedy
  if (!_id) {
    res.json(400, { message: "Błąd brak id artykułu?" });
  }
  if (!doi_number || !article_theme || !authors || !sources || !summary) {
    res.json(400, { message: "Proszę uzupełnić wszystkie pola" });
  }
  if (doi_number.length < 3) {
    res.json(400, { message: "Numer doi jest za krótki" });
  }
  if (article_theme.length < 3) {
    res.json(400, { message: "Tytul artykułu jest za krótki" });
  }
  if (authors.length < 3) {
    res.json(400, { message: "Pole autorzy jest za krótkie" });
  }
  if (sources.length < 3) {
    res.json(400, { message: "Pole zasoby jest za krótkie" });
  }
  if (summary.length < 3) {
    res.json(400, { message: "Pole podsumowanie jest za krótkie" });
  }

  const editArticle = Article.findByIdAndUpdate(
    {
      _id: _id,
      user: token.id,
    },
    {
      doi_number: doi_number,
      article_theme: article_theme,
      authors: authors,
      sources: sources,
      summary: summary,
      editDate: Date.now(),
    }
  );
  editArticle.exec((err, editArticle) => {
    if (err) {
      console.log("błąd serwera", err);
      res.json(400, { message: "Błąd serwera" });
    }
    if (!editArticle) {
      res.json(400, { message: "Nie ma takiego artykułu" });
    }
    res.json(200, { message: "Artykuł został pomyślnie zedytowany" });
  });
});

router.post("/add-article", (req, res) => {
  //sciagam tokena z headera
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);

  const { doi_number, article_theme, authors, sources, summary } = req.body;
  //jesli doi number jest czymkolwiek wtedy

  if (!doi_number || !article_theme || !authors || !sources || !summary) {
    res.json(400, { message: "Proszę uzupełnić wszystkie pola" });
  }
  if (doi_number.length < 3) {
    res.json(400, { message: "Numer doi jest za krótki" });
  }
  if (article_theme.length < 3) {
    res.json(400, { message: "Tytul artykułu jest za krótki" });
  }
  if (authors.length < 3) {
    res.json(400, { message: "Pole autorzy jest za krótkie" });
  }
  if (sources.length < 3) {
    res.json(400, { message: "Pole zasoby jest za krótkie" });
  }
  if (summary.length < 3) {
    res.json(400, { message: "Pole podsumowanie jest za krótkie" });
  }

  const newArticle = new Article({
    doi_number: doi_number,
    article_theme: article_theme,
    authors: authors,
    sources: sources,
    summary: summary,
    user: token.id,
  });
  //############################################################
  //TODO doac usera do artykuly i obs;luzyc blad i sukces dodania
  // newArticle.save;

  newArticle.save((err) => {
    if (!err) {
      console.log("Artykul zostal dodany pomyślnie");
      res.json(200, { message: "Artykul zostal dodany pomyślnie" });
    } else {
      console.log("error:", err);
      res.json(400, err);
    }
  });
});

//POBIERZ LISTE ARTYKULOW

router.get("/get-article-list", (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);

  articleList = Article.find({
    user: token.id,
  });
  articleList.sort({ date: -1 });
  articleList.exec((err, articleList) => {
    if (err) {
      res.json(400, err);
    }
    if (!articleList) {
      res.json({ message: "Brak artykułów" });
    }
    res.json({ articleList });
  });
});

//POBIERZ JEDEN ARTYKUL
router.get("/get-article/:id", (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  const { id } = req.params;

  const article = Article.findOne({
    user: token.id,
    _id: id,
  }).then((article) => {
    if (!article) {
      res.json(400, { message: "Error Brak artykułu" });
    } else {
      res.json(200, { article });
    }
  });
});
