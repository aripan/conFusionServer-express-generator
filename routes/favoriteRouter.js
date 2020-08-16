const express = require("express");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorite = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter.use(express.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .then(
        (favorite) => {
          res.status(200).json(favorite);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      let favArray = req.body.map((favorite) => favorite._id);
      if (!favorite) {
        let newFav = {
          user: req.user._id,
          dishes: favArray,
        };

        Favorite.create(newFav)
          .then(
            (favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      } else {
        favArray.forEach((fav) => {
          if (favorite.dishes.indexOf(fav) === -1) favorite.dishes.push(fav);
        });
        favorite
          .save()
          .then(
            (fav) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(fav);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      }
    });
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      Favorite.findByIdAndDelete(favorite._id)
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    });
  });

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })

  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorites/${req.params.dishId}`);
  })

  .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      const favDishId = req.params.dishId;
      if (!favorite) {
        let newFav = {
          user: req.user._id,
          dishes: favDishId,
        };

        Favorite.create(newFav)
          .then(
            (favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      } else {
        if (favorite.dishes.indexOf(favDishId) === -1)
          favorite.dishes.push(favDishId);

        favorite
          .save()
          .then(
            (fav) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(fav);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      }
    });
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.dishId}`);
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        favorite.dishes = favorite.dishes.filter(
          (dishId) => dishId != req.params.dishId
        );
        favorite.save().then(
          (fav) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(fav);
          },
          (err) => next(err)
        );
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
