const express = require("express");
const mongoose = require("mongoose");

const Dishes = require("../models/dishes");

const dishRouter = express.Router();

dishRouter.use(express.json());

dishRouter
  .route("/")
  .get((req, res, next) => {
    Dishes.find({}).then(
      (dishes) => {
        res.status(200).json(dishes);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })

  .post((req, res, next) => {
    Dishes.create(req.body).then(
      (dish) => {
        console.log("Dish Created", dish);
        res.status(200).json(dish);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })

  .put((req, res, next) => {
    res.status(403).send("PUT operation is not supported on /dishes");
  })

  .delete((req, res, next) => {
    Dishes.remove({}).then(
      (resp) => {
        res.status(200).json(resp);
      },
      (err) => next(err).catch((err) => next(err))
    );
  });

dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId).then(
      (dish) => {
        res.status(200).json(dish);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })

  .post((req, res, next) => {
    res
      .status(403)
      .send("POST operation is not supported on /dishes/" + req.params.dishId);
  })

  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      { $set: req.body },
      { new: true }
    ).then(
      (dish) => {
        res.status(200).json(dish);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })

  .delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId).then(
      (resp) => {
        res.status(200).json(resp);
      },
      (err) => next(err).catch((err) => next(err))
    );
  });

module.exports = dishRouter;
