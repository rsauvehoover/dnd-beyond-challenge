import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from "mongoose";
import { CharacterModel } from '../models/character';
import { getAllCharacters, loadCharacter } from './utils';

// Local mongodb database to avoid setup since we don't need a fully working instance given this api's lifetime
// but it's still nice to interface with a mock db in the meantime to allow for easier future development

export default class DBManager {
  server: MongoMemoryServer | null = null;

  async start() {
    this.server = await MongoMemoryServer.create();
    // this.conn = await MongoClient.connect(this.server.getUri(), {});
    // this.db = this.conn.db(this.server.instanceInfo!.dbName);
  }

  async stop() {
    if (this.server) this.server.stop();
  }

  // Initialize the character collection to hold all the characters described in the data directory
  async initCharacterCollection() {
    if (!this.server) return;
    await mongoose.connect(this.server.getUri());

    const characters = await getAllCharacters()
    await CharacterModel.create(characters);
  }
}

