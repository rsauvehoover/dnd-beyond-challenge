import request from "supertest";
import API from "../src/server";
import { Character } from "../src/models/character";
import { IDamagePayload } from "../src/db/characters";
import { numCharacters, briv } from "./util";

describe("Damage", () => {
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

  it("Damage with no defenses or temporary hp is correctly calculated", async () => {});

  it("Damage does not reduce hp below 0", async () => {});

  it("Damage with is removed from temporary hp first", async () => {});

  it("Damage immunity is correctly calculated", async () => {});

  it("Damage resistance is correctly calculated", async () => {});

  it("Multiple instances of damage are correctly calculated", async () => {});
});
