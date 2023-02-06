const express = require("express");
const { User } = require("../models /user");
const router = express.Router();
var request = require("request");
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res) => {
  const usertoken = req.headers.authorization;
  const token = usertoken.split(" ");
  const user = jwt.verify(token[1], process.env.SECRET);
  let loggeduser = await User.findById(user.userID);
  if (loggeduser.isLogged === false) {
    return res.status(400).send("Please ogin to Continue ");
  }

  request(
    "https://api.chucknorris.io/jokes/random",
    function (error, response, body) {
      if (error) {
        res.send("An erorr occured");
      } else {
        let joke = JSON.parse(body);
        res.send({ joke: joke.value });
      }
    }
  );
});

module.exports = router;
