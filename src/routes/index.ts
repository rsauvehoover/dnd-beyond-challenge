import express from "express";
import CharacterController from "../controllers/characters.controller";

const router = express.Router();

router.get("/characters", async (_req, res) => {
  const controller = new CharacterController();
  const response = await controller.getCharacters();
  return res.send(response);
});
export default router;

