import request from "supertest";
import API from "../src/server";
import { Character } from "../src/models/character";
import { IDamagePayload, IHealPayload, ITempHpPayload } from "../src/db/characters";
import { briv } from "./util";
import { DamageType } from "../src/models/damage";

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

  it("Heal correctly heals damage", async () => {
    await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.acid,
            roll: 10
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);

    const res = await request(server.app)
      .post("/characters/heal")
      .send({
        name: briv.name,
        value: 5
      } as IHealPayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints - 5);
    expect((res.body as Character).temporaryHitPoints).toBe(0);
  });

  it("Heal does not raise hp over max hp", async () => {
    const res = await request(server.app)
      .post("/characters/heal")
      .send({
        name: briv.name,
        value: 5
      } as IHealPayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints);
    expect((res.body as Character).temporaryHitPoints).toBe(0);
  });

  it("Heal does not raise temporary hp", async () => {
    await request(server.app)
      .post("/characters/addTemporaryHp")
      .send({
        name: briv.name,
        value: 10
      } as ITempHpPayload)
      .expect("Content-Type", /json/)
      .expect(200);

    const res = await request(server.app)
      .post("/characters/heal")
      .send({
        name: briv.name,
        value: 5
      } as IHealPayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints);
    expect((res.body as Character).temporaryHitPoints).toBe(10);
  });

  it("Heal does not heal temporary hp", async () => {
    await request(server.app)
      .post("/characters/addTemporaryHp")
      .send({
        name: briv.name,
        value: 10
      } as ITempHpPayload)
      .expect("Content-Type", /json/)
      .expect(200);

    await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.acid,
            roll: 5
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);

    const res = await request(server.app)
      .post("/characters/heal")
      .send({
        name: briv.name,
        value: 3
      } as IHealPayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints);
    expect((res.body as Character).temporaryHitPoints).toBe(5);
  });
});
