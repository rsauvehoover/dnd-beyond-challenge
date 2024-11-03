import express from "express";
import CharacterController from "../controllers/characters.controller";

const router = express.Router();

router.get("/", async (_, res) => {
  const controller = new CharacterController();
  const response = await controller.getCharacters();
  return res.send(response);
});

router.get("/:name", async (req, res) => {
  const controller = new CharacterController();
  const response = await controller.getCharacter(req.params.name);
  if (!response) res.status(404).send({ message: `Character ${req.params.name} not found` })
  return res.send(response);
});

export default router;

