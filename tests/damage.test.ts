import request from "supertest";
import API from "../src/server";
import { Character } from "../src/models/character";
import { ITempHpPayload, IDamagePayload } from "../src/db/characters";
import { DamageType } from "../src/models/damage";
import { briv } from "./util";

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

  it("Damage with no defenses or temporary hp is correctly calculated", async () => {
    const res = await request(server.app)
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
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints - 10);
    expect((res.body as Character).temporaryHitPoints).toBe(0);
  });

  it("Damage does not reduce hp below 0", async () => {
    const res = await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.acid,
            roll: briv.hitPoints + 10
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(0);
    expect((res.body as Character).temporaryHitPoints).toBe(0);
  });

  it("Damage is removed from temporary hp first", async () => {
    await request(server.app)
      .post("/characters/addTemporaryHp")
      .send({
        name: briv.name,
        value: 10
      } as ITempHpPayload)
      .expect("Content-Type", /json/)
      .expect(200);

    const res = await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.acid,
            roll: 15
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints - 5);
    expect((res.body as Character).temporaryHitPoints).toBe(0);
  });

  it("Damage less than tempHp is not taken to hp", async () => {
    await request(server.app)
      .post("/characters/addTemporaryHp")
      .send({
        name: briv.name,
        value: 20
      } as ITempHpPayload)
      .expect("Content-Type", /json/)
      .expect(200);

    const res = await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.acid,
            roll: 15
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints);
    expect((res.body as Character).temporaryHitPoints).toBe(5);
  });

  it("Damage immunity is correctly calculated", async () => {
    let res = await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.fire,
            roll: briv.hitPoints + 10
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints);
    expect((res.body as Character).temporaryHitPoints).toBe(0);

    // ensure behaviour is the same with tempHp
    await request(server.app)
      .post("/characters/addTemporaryHp")
      .send({
        name: briv.name,
        value: 20
      } as ITempHpPayload)
      .expect("Content-Type", /json/)
      .expect(200);

    res = await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.fire,
            roll: briv.hitPoints + 10
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints);
    expect((res.body as Character).temporaryHitPoints).toBe(20);
  });

  it("Damage resistance is correctly calculated", async () => {
    let res = await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.slashing,
            roll: 10
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints - 5);
    expect((res.body as Character).temporaryHitPoints).toBe(0);
  });

  it("Damage resistance is correctly calculated with temporary hp", async () => {
    await request(server.app)
      .post("/characters/addTemporaryHp")
      .send({
        name: briv.name,
        value: 20
      } as ITempHpPayload)
      .expect("Content-Type", /json/)
      .expect(200);

    const res = await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.slashing,
            roll: 10
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints);
    expect((res.body as Character).temporaryHitPoints).toBe(20 - 5);
  });

  it("Damage resistance is correctly calculated with odd values", async () => {
    const res = await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.slashing,
            roll: 9
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints - 4);
    expect((res.body as Character).temporaryHitPoints).toBe(0);
  });

  it("Damage resistance is correctly calculated with odd values and temporary hp", async () => {
    await request(server.app)
      .post("/characters/addTemporaryHp")
      .send({
        name: briv.name,
        value: 20
      } as ITempHpPayload)
      .expect("Content-Type", /json/)
      .expect(200);

    const res = await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.slashing,
            roll: 9
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints);
    expect((res.body as Character).temporaryHitPoints).toBe(20 - 4);
  });

  it("Multiple instances of damage are correctly calculated", async () => {
    let res = await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.acid,
            roll: 10
          },
          {
            type: DamageType.acid,
            roll: 10
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints - 20);
    expect((res.body as Character).temporaryHitPoints).toBe(0);
  });

  it("Multiple instances of damage are correctly calculated with defenses", async () => {
    let res = await request(server.app)
      .post("/characters/dealDamage")
      .send({
        name: briv.name,
        damageInstances: [
          {
            type: DamageType.acid,
            roll: 10
          },
          {
            type: DamageType.slashing,
            roll: 9
          },
          {
            type: DamageType.fire,
            roll: 8
          }
        ]
      } as IDamagePayload)
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints - 14);
    expect((res.body as Character).temporaryHitPoints).toBe(0);
  });

  it("Database is saving correctly between instances", async () => {
    let res = await request(server.app)
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
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints - 10);
    expect((res.body as Character).temporaryHitPoints).toBe(0);

    res = await request(server.app)
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
    expect((res.body as Character).hitPoints).toBe(briv.hitPoints - 20);
    expect((res.body as Character).temporaryHitPoints).toBe(0);
  });
});
