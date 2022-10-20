const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  // const token = authHeader && authHeader.split(" ")[1];

  const token = req.cookies.access_token;

  if (token === null || token == undefined) return res.send(false);

  jwt.verify(token, process.env.SECRATE_TOKEN, (err, user) => {
    if (err) return res.send(false);

    req.user = user;

    next();
  });
}

module.exports = authenticateUser;
