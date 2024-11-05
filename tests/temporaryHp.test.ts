import request from "supertest";
import API from "../src/server";
import { Character } from "../src/models/character";
import { ITempHpPayload } from "../src/db/characters";
import { briv } from "./util";

describe("Temporary hp", () => {
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

  it("Adds temporary hp", async () => {
    const res = await request(server.app)
      .post("/characters/addTemporaryHp")
      .send({
        name: briv.name,
        value: 100
      } as ITempHpPayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(expect.objectContaining({ ...briv, temporaryHitPoints: 100 }));
  });

  it("Temporary hp is overwritten by larger value", async () => {
    let res = await request(server.app)
      .post("/characters/addTemporaryHp")
      .send({
        name: briv.name,
        value: 50
      } as ITempHpPayload)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(expect.objectContaining({ ...briv, temporaryHitPoints: 50 }));
    expect((res.body as Character).temporaryHitPoints).toBe(50);

    res = await request(server.app)
      .post("/characters/addTemporaryHp")
      .send({
        name: briv.name,
        value: 60
      } as ITempHpPayload)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(expect.objectContaining({ ...briv, temporaryHitPoints: 60 }));
    expect((res.body as Character).temporaryHitPoints).toBe(60);
  });

  it("Temporary hp is not overwritten by smaller value", async () => {
    let res = await request(server.app)
      .post("/characters/addTemporaryHp")
      .send({
        name: briv.name,
        value: 50
      } as ITempHpPayload)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(expect.objectContaining({ ...briv, temporaryHitPoints: 50 }));
    expect((res.body as Character).temporaryHitPoints).toBe(50);

    res = await request(server.app)
      .post("/characters/addTemporaryHp")
      .send({
        name: briv.name,
        value: 40
      } as ITempHpPayload)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(expect.objectContaining({ ...briv, temporaryHitPoints: 50 }));
    expect((res.body as Character).temporaryHitPoints).toBe(50);
  });
});
