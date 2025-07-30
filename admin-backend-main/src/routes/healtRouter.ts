import express from "express";

const healtRouter = express.Router();

healtRouter.get("/", (req, res) => {
  res.json({ status: "OK" });
});
export default healtRouter;