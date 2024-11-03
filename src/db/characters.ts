import mongoose from "mongoose";
import { CharacterModel, Character } from "../models/character";

export async function getCharacters(): Promise<Character[]> {
  return await CharacterModel.find({})
}
