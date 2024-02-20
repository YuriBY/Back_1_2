import request from "supertest";
import { app } from "../../src/index";
import { HTTP_STATUS } from "../../src/status/status1";

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
    const authString = `${login}:${password}`;
    const encodedAuthString = Buffer.from(authString).toString("base64");

    const res = await request(app)
      .post("/posts")
      .send({
        id: "123",
        name: "555",
        description: "qnsvdlbvfl",
        websiteUrl: "https://google.com",
      })
      .set("Authorization", `Basic ${encodedAuthString}`)
      .expect(HTTP_STATUS.BAD_REQUEST_400);
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
        id: 123,
        name: "555",
        description: "qnsvdlbvfl",
        websiteUrl: "https://google.com",
      })
      .set("Authorization", `Basic ${encodedAuthString}`)
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });
});
