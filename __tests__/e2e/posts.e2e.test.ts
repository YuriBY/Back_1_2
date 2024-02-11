import request from "supertest";
import { HTTP_STATUS } from "../../src";
import { app } from "../../src/setting";
import { response } from "express";
import { db } from "../../src/db/db";

describe("/posts", () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  it("should return 200 and empty array", async () => {
    await request(app).get("/posts").expect(HTTP_STATUS.OK_200, []);
  });

  it("should return 404 for not existing videos", async () => {
    await request(app).get("/posts/-9999999").expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it("shouldn't create post with incorrect data", async () => {
    const login = "admin";
    const password = "qwerty";
    const authString = `${login}:${password}`;
    const encodedAuthString = Buffer.from(authString).toString("base64");
    await request(app)
      .post("/posts")
      .send({
        title: 23,
        shortDescription: "aaa",
        content: "a",
        blogId: "XXX",
      })
      .set("Authorization", `Basic ${encodedAuthString}`)
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it("should create post with correct data", async () => {
    const login = "admin";
    const password = "qwerty";
    db.blogs.push({
      id: "123",
      name: "555",
      description: "qnsvdlbvfl",
      websiteUrl: "https://google.com",
    });

    const res = await request(app)
      .post("/posts")
      .auth(login, password)
      .send({
        title: "23",
        shortDescription: "aaa",
        content: "a",
        blogId: "123",
      })
      .expect(HTTP_STATUS.CREATED_201);
  });

  it("shouldn't create post with incorrect title", async () => {
    const login = "admin";
    const password = "qwerty";

    // Формируем строку аутентификации в формате "логин:пароль"
    const authString = `${login}:${password}`;

    // Кодируем строку аутентификации в формате Base64
    const encodedAuthString = Buffer.from(authString).toString("base64");
    const res = await request(app)
      .post("/posts")
      .send({
        title: 23,
        shortDescription: "aaa",
        content: "a",
        blogId: "XXX",
      })
      .set("Authorization", `Basic ${encodedAuthString}`)
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });
});
