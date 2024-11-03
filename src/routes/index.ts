import express from "express";
import CharacterRouter from "./character.router"

const router = express.Router();

router.use("/characters", CharacterRouter);

export default router;
