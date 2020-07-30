const express = require("express");

const leaderRouter = express.Router();

leaderRouter.use(express.json());

leaderRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.send("Will send all the details of leaders to you!");
  })
  .post((req, res, next) => {
    res.status(403).send("POST operation is not supported on /leaders");
  })
  .put((req, res, next) => {
    res.send(
      "Will add the leader: " +
        req.body.name +
        " with details: " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.send("Deleting all the leaders!");
  });

leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    res.send(
      "Will send details of the leader: " + req.params.leaderId + " to you!"
    );
  })
  .post((req, res, next) => {
    res
      .status(403)
      .send(
        "POST operation is not supported on /leaders/" + req.params.leaderId
      );
  })
  .put((req, res, next) => {
    res.write("Updating the leader: " + req.params.leaderId + "\n");
    res.end(
      "Will update the leader: " +
        req.body.name +
        " with details: " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.send("Deleting the leader: " + req.params.leaderId);
  });

module.exports = leaderRouter;
