import request from "supertest";
import server from "../server";
import mongoose from "mongoose";

describe("GET Endpoints", () => {
  it("should return characters", async () => {
    const app = await server();
    const res = await request(app).get("/characters").expect('Content-Type', /json/).expect(200);
    expect(res.body.length).toEqual(3);
  });
});
