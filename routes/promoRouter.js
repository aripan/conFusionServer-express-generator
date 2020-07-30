const express = require("express");

const promoRouter = express.Router();

promoRouter.use(express.json());

promoRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.send("Will send all the promotions to you!");
  })
  .post((req, res, next) => {
    res.status(403).send("PosT operation is not supported on /promotions");
  })
  .put((req, res, next) => {
    res.send(
      "Will add the promotion: " +
        req.body.name +
        " with details: " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.send("Deleting all the promotions!");
  });

promoRouter
  .route("/:promoId")
  .get((req, res, next) => {
    res.send(
      "Will send details of the promotion: " + req.params.promoId + " to you!"
    );
  })
  .post((req, res, next) => {
    res
      .status(403)
      .send(
        "POST operation is not supported on /promotions/" + req.params.promoId
      );
  })
  .put((req, res, next) => {
    res.write("Updating the promotion: " + req.params.promoId + "\n");
    res.end(
      "Will update the promotion: " +
        req.body.name +
        " with details: " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.send("Deleting the promotion: " + req.params.promoId);
  });

module.exports = promoRouter;
