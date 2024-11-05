import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { Character, CharacterModel } from "../models/character";
import { getAllCharacters } from "./utils";

// Local mongodb database to avoid setup since we don't need a fully working instance given this api's lifetime
// but it's still nice to interface with a mock db in the meantime to allow for easier future development

export default class DBManager {
  server: MongoMemoryServer | null = null;

  async start() {
    this.server = await MongoMemoryServer.create();
    await mongoose.connect(this.server.getUri());
  }

  // Initialize the character collection to hold all the characters described in the data directory
  async initCharacterCollection() {
    await CharacterModel.deleteMany({});
    const characters = await getAllCharacters();
    await CharacterModel.create(characters);
  }

  async stop() {
    await mongoose.disconnect();
    if (this.server) this.server.stop();
  }
}
