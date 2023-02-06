const { User } = require("../models /user");
const express = require("express");
const router = express.Router();
const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

router.get(`/me`, async (req, res) => {
  const usertoken = req.headers.authorization;
  const token = usertoken.split(" ");
  const id = jwt.verify(token[1], process.env.SECRET);
  const user = await User.findById(id.userID).select("-password");
  if (user.isLogged === false) {
    return res.status(404).send("Please login to continue ");
  }
  if (!user) {
    res.status(500).json({ success: false, msg: "No Records  Found" });
  }
  res.status(200).send(user);
});

router.post(
  "/signup",
  [
    check("name").not().isEmpty().trim().escape(),
    check("password").not().isEmpty().trim().escape().isLength({min:8}),
    check("email").isEmail().normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: "Form validation error.",
        errors: errors.array(),
      });
    }
    let user = await User.findOne({ email: req.body.email }).select(
      "-password"
    );
    if (!user) {
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bycrpt.hashSync(req.body.password, 10),
      });
      user = await user.save();
      return res.send({ msg: "Registration Successful", user: user });
    }
    if (user) {
      return res.status(404).send("User already  Exists ");
    }
  }
);

router.post(
  "/login",
  [   
    check("email").isEmail().normalizeEmail(),
    check("password").not().isEmpty().trim().escape().isLength({min:8}),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: "Form validation error.",
        errors: errors.array(),
      });
    }
    let user = await User.findOne({ email: req.body.email });
    const secret = process.env.SECRET;
    if (!user) {
      return res.send(400).send("Invalid Credentials ");
    }
    if (user && bycrpt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        {
          userID: user.id,
        },
        secret,
        {
          expiresIn: "1h",
        }
      );
      await User.findByIdAndUpdate(
        user.id,

        { isLogged: true }
      );

      return res.status(200).send({ user: user.email, token: token });
    } else {
      return res.status(400).send("Wrong Password");
    }
  }
);
router.post("/logout", async (req, res) => {
  const usertoken = req.headers.authorization;
  const token = usertoken.split(" ");
  const user = jwt.verify(token[1], process.env.SECRET);
  let loggeduser = await User.findById(user.userID);
  if (loggeduser.isLogged === false) {
    return res.status(400).send("Already logged out");
  }
  await User.findByIdAndUpdate(user.userID, { isLogged: false });
  return res.status(200).send("Logged Out");
});

module.exports = router;
