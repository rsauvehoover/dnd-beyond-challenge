import request from "supertest";
import API from "../src/server";
import { Character } from "../src/models/character";
import { IDamagePayload } from "../src/db/characters";
import { numCharacters, briv } from "./util";

describe("Heal", () => {
  let server: API;

  beforeAll(async () => {
    server = new API();
    await server.start();
  });

  beforeEach(async () => {
    await server.dbm.initCharacterCollection();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("Heal correctly heals damage", async () => {});

  it("Heal does not raise hp over max hp", async () => {});

  it("Heal does not heal temporary hp", async () => {});
});
