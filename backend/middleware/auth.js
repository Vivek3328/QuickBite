const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

function fetchOwner(req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.owner = data.owner;
    next();
  } catch {
    return res
      .status(401)
      .json({ error: "Please authenticate using a valid token" });
  }
}

function fetchUser(req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ error: "Please authenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    return res
      .status(401)
      .json({ error: "Please authenticate using valid token" });
  }
}

module.exports = { fetchOwner, fetchUser };
