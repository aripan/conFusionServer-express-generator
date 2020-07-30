const express = require("express");

const dishRouter = express.Router();

dishRouter.use(express.json());

dishRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.send("Will send all the dishes to you!");
  })
  .post((req, res, next) => {
    res.send(
      "Will add the dish: " +
        req.body.name +
        "with details: " +
        req.body.description
    );
  })
  .put((req, res, next) => {
    res.status(403).send("PUT operation is not supported on /dishes");
  })
  .delete((req, res, next) => {
    res.send("Deleting all the dishes!");
  });

dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    res.send(
      "Will send details of the dish: " + req.params.dishId + " to you!"
    );
  })
  .post((req, res, next) => {
    res
      .status(403)
      .send("POST operation is not supported on /dishes/" + req.params.dishId);
  })
  .put((req, res, next) => {
    res.write("Updating the dish: " + req.params.dishId + "\n");
    res.end(
      "Will update the dish: " +
        req.body.name +
        " with details: " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.send("Deleting the dish: " + req.params.dishId);
  });

module.exports = dishRouter;
