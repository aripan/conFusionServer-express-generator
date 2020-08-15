const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");
const cors = require("./cors");

const router = express.Router();

router.use(express.json());

/* GET users listing. */

router.get(
  "/",
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    User.find({ users: req.body.users })
      .then(
        (users) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

// NEW USER SIGNUP
router.post("/signup", cors.corsWithOptions, (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.status(500).json(err);
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save((err, user) => {
          if (err) {
            res.status(500).json(err);

            return;
          }
          passport.authenticate("local")(req, res, () => {
            res
              .status(200)
              .json({ success: true, status: "Registration Successful!" });
          });
        });
      }
    }
  );
});

// EXISTING USER LOGIN
router.post(
  "/login",
  cors.corsWithOptions,
  passport.authenticate("local"),
  (req, res) => {
    let token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      token: token,
      status: "You are successfully logged in!",
    });
  }
);

router.get("/logout", cors.corsWithOptions, (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    let err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

// LOGIN WITH FACEBOOK
router.get(
  "/facebook/token",
  passport.authenticate("facebook-token"),
  (req, res) => {
    if (req.user) {
      let token = authenticate.getToken({ _id: req.user._id });
      res
        .status(200)
        .json({
          success: true,
          token: token,
          status: "You are successfully logged in!",
        });
    }
  }
);

module.exports = router;
