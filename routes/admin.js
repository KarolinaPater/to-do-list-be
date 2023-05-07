var express = require("express");
var router = express.Router();
const User = require("../models/user");
const Article = require("../models/article");
const config = require("../config");
const { verify } = require("jsonwebtoken");
const { createTokens, validateToken } = require("../JWT");

module.exports = router;

router.put("/edit-user/:id", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  console.log(token.role, token);
  if (token.role !== "admin") {
    res.json(400, { message: "Brak uprawnień" });
  }
  //sciagam tokena z headera
  const { id } = req.params;
  // const accessToken = req.headers["x-access-token"];
  // const token = verify(accessToken, config.JWT_SECRET);
  const { name, last_name, email, orcid_number, affiliation } = req.body;
  //jesli doi number jest czymkolwiek wtedy
  if (!id) {
    res.json(400, { message: "Błąd brak id usera?" });
  }
  if (!name || !last_name || !email) {
    res.json(400, { message: "Proszę uzupełnić wszystkie pola" });
  }
  if (name.length < 2) {
    res.json(400, { message: "Imię jest za krótkie" });
  }
  if (last_name.length < 3) {
    res.json(400, { message: "Nazwisko jest za krótkie" });
  }
  if (email.length < 5) {
    res.json(400, { message: "Email jest za krótki" });
  }

  const editUser = User.findByIdAndUpdate(
    { _id: id },
    {
      name: name,
      last_name: last_name,
      email: email,
      orcid_number: orcid_number,
      affiliation: affiliation,
      creation_date: undefined,
      editDate: Date.now(),
    }
  );
  editUser.exec((err, editUser) => {
    if (err) {
      console.log("błąd serwera", err);
      res.json(400, { message: "Błąd serwera" });
    }
    if (!editUser) {
      console.log("błąd serwera", err);
      res.json(400, { message: "Nie ma takiego użytkownika" });
    }
    console.log("błąd serwera", err);
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

//POBIERZ JEDEN usera
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
        last_name: user?.last_name || "",
        email: user?.email || "",
        orcid_number: user?.orcid_number || "",
        affiliation: user?.affiliation || "",
      };
      res.json(200, { user: selectedUser });
    }
  });
});

router.put("/edit-article", validateToken, (req, res) => {
  console.log("konsollog w edit article");
  //sciagam tokena z headera
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  if (token.role !== "admin") {
    res.json(400, { message: "Brak uprawnień" });
  }

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

router.get("/get-article-list/:id", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  if (token.role !== "admin") {
    res.json(400, { message: "Brak uprawnień" });
  }
  const { id } = req.params;

  articleList = Article.find({
    user: id,
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

router.delete("/delete-user-article/:id", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  if (token.role !== "admin") {
    res.json(400, { message: "Brak uprawnień" });
  }
  const { id } = req.params;
  console.log("błąd 1");
  const article = Article.findByIdAndDelete({
    _id: id,
  }).then((article) => {
    if (!article) {
      console.log("błąd 2");
      res.json(400, { message: "Brak artykułu do usuniecia" });
    } else {
      console.log("błąd 3");
      res.json(200, { message: "Artykuł został pomyślnie usunięty" });
    }
  });
});
