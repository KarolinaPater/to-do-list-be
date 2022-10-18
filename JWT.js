const config = require("./config");

const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    { fullname: user.fullname, id: user.id },
    config.JWT_SECRET,
    { expiresIn: 2400 }
  );
  return accessToken;
};
const validateToken = (req, res, next) => {
  const accessToken = req.headers["x-access-token"];

  if (!accessToken) {
    console.log("Uzytkownik nie posiada autoryzacji");
    return res.json({ error: "Uzytkownik nie posiada autoryzacji" });
  }
  try {
    const validToken = verify(accessToken, config.JWT_SECRET);
    if (validToken) {
      console.log("autoryzacja powiodla sie!");
      return next();
    }
  } catch (err) {
    return res.json({ error: "Uzytkownik nie posiada autoryzacji" });
  }
};
module.exports = { createTokens, validateToken };
