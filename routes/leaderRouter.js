const express = require("express");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");

const Leaders = require("../models/leaders");

const leaderRouter = express.Router();

leaderRouter.use(express.json());

leaderRouter
  .route("/")
  .get((req, res, next) => {
    Leaders.find({}).then(
      (leaders) => {
        res.status(200).json(leaders);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body).then(
      (leader) => {
        console.log("Leader Created", leader);
        res.status(200).json(leader);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.status(403).send("PUT operation is not supported on /leaders");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.remove({}).then(
        (resp) => {
          res.status(200).json(resp);
        },
        (err) => next(err).catch((err) => next(err))
      );
    }
  );

leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId).then(
      (promotion) => {
        res.status(200).json(promotion);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res
      .status(403)
      .send(
        "POST operation is not supported on /leaders/" + req.params.leaderId
      );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate(
      req.params.leaderId,
      { $set: req.body },
      { new: true }
    ).then(
      (leader) => {
        res.status(200).json(leader);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.findByIdAndRemove(req.params.leaderId).then(
        (resp) => {
          res.status(200).json(resp);
        },
        (err) => next(err).catch((err) => next(err))
      );
    }
  );

module.exports = leaderRouter;
