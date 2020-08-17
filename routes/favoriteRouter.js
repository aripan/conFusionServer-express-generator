const express = require("express");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorites = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter.use(express.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus = 200;
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .then(
        (favorites) => {
          res.status(200).json(favorites);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }, (err, favorite) => {
      if (err) {
        return next(err);
      }

      if (!favorite) {
        Favorites.create({ user: req.user._id })
          .then((favorite) => {
            for (i = 0; i < req.body.length; i++) {
              if (favorite.dishes.indexOf(req.body[i]._id) < 0)
                favorite.dishes.push(req.body[i]);
            }
            favorite
              .save()
              .then((favorite) => {
                Favorites.findById(favorite._id)
                  .populate("user")
                  .populate("dishes")
                  .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                  });
              })
              .catch((err) => {
                return next(err);
              });
          })
          .catch((err) => {
            return next(err);
          });
      } else {
        for (i = 0; i < req.body.length; i++) {
          if (favorite.dishes.indexOf(req.body[i]._id) < 0)
            favorite.dishes.push(req.body[i]);
        }
        favorite
          .save()
          .then((favorite) => {
            Favorites.findById(favorite._id)
              .populate("user")
              .populate("dishes")
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              });
          })
          .catch((err) => {
            return next(err);
          });
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({ user: req.user._id }, (err, resp) => {
      if (err) return next(err);
      res.status(200).json(resp);
    });
  });

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus = 200;
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        (favorites) => {
          if (!favorites) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({ exists: false, favorites: favorites });
          } else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: false, favorites: favorites });
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: true, favorites: favorites });
            }
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }, (err, favorite) => {
      if (err) return next(err);

      if (!favorite) {
        Favorites.create({ user: req.user._id })
          .then((favorite) => {
            favorite.dishes.push({ _id: req.params.dishId });
            favorite
              .save()
              .then((favorite) => {
                Favorites.findById(favorite._id)
                  .populate("user")
                  .populate("dishes")
                  .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                  });
              })
              .catch((err) => {
                return next(err);
              });
          })
          .catch((err) => {
            return next(err);
          });
      } else {
        if (favorite.dishes.indexOf(req.params.dishId) < 0) {
          favorite.dishes.push(req.body);
          favorite
            .save()
            .then((favorite) => {
              Favorites.findById(favorite._id)
                .populate("user")
                .populate("dishes")
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorite);
                });
            })
            .catch((err) => {
              return next(err);
            });
        } else {
          res.status(403).end("Dish" + req.params.dishId + "already selected");
        }
      }
    });
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites/" + req.params.dishId);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }, (err, favorite) => {
      if (err) return next(err);
      let index = favorite.dishes.indexOf(req.params.dishId);
      if (index >= 0) {
        favorite.dishes.splice(index, 1);
        favorite
          .save()
          .then((favorite) => {
            Favorites.findById(favorite._id)
              .populate("user")
              .populate("dishes")
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              });
          })
          .catch((err) => {
            return next(err);
          });
      } else {
        res.status(404).end("Dish" + req.params._id + "not in your list");
      }
    });
  });
module.exports = favoriteRouter;
