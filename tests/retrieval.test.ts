import request from "supertest";
import API from "../src/server";
import { Character } from "../src/models/character";
import { numCharacters, briv } from "./util";

describe("Character retrieval endpoints", () => {
  let server: API;

  beforeAll(async () => {
    server = new API();
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("Should return all characters", async () => {
    const res = await request(server.app)
      .get("/characters")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.length).toBe(numCharacters);
  });

  it("Should return specific character", async () => {
    const res = await request(server.app)
      .get(`/characters/${briv.name}`)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).name).toBe(briv.name);
  });

  it("Should return at least all properties of original character", async () => {
    const res = await request(server.app)
      .get("/characters/briv")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(expect.objectContaining(briv));
  });
});
