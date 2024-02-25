import request from "supertest";
import { app } from "../../src/index";
import { HTTP_STATUS } from "../../src/status/status1";

describe("/blogs", () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  afterAll((done) => done());

  it("should return 200 and empty array", async () => {
    await request(app).get("/blogs").expect(HTTP_STATUS.OK_200, []);
  });

  it("should return 404 for not existing blogs", async () => {
    await request(app).get("/blogs/-9999999").expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it("shouldn't create blog with incorrect data", async () => {
    const login = "admin";
    const password = "qwerty";

    // Формируем строку аутентификации в формате "логин:пароль"
    const authString = `${login}:${password}`;

    // Кодируем строку аутентификации в формате Base64
    const encodedAuthString = Buffer.from(authString).toString("base64");

    await request(app)
      .post("/blogs")
      .send({
        name: "55",
        description: "q",
        websiteUrl: "https:getPositionOfLineAndCharacter.com",
      })
      // Добавляем заголовок Authorization с закодированной строкой аутентификации
      .set("Authorization", `Basic ${encodedAuthString}`)
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it("should create blog with correct data", async () => {
    const login = "admin";
    const password = "qwerty";

    const res = await request(app).post("/blogs").auth(login, password).send({
      name: "5",
      description: "qnsvdlbvfl",
      websiteUrl: "https://google.com",
    });
    //.expect(HTTP_STATUS.CREATED_201);
    console.log(res.body);
  });

  it("shouldn't create blog with incorrect title", async () => {
    const login = "admin";
    const password = "qwerty";

    // Формируем строку аутентификации в формате "логин:пароль"
    const authString = `${login}:${password}`;

    // Кодируем строку аутентификации в формате Base64
    const encodedAuthString = Buffer.from(authString).toString("base64");
    const res = await request(app)
      .post("/blogs")
      .send({
        title: 23,
        shortDescription: "aaa",
        content: "a",
        blogId: "XXX",
      })
      .set("Authorization", `Basic ${encodedAuthString}`)
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it("shouldn't create post to blog with incorrect blogId", async () => {
    const login = "admin";
    const password = "qwerty";
    const blogId = "12233245";

    // Формируем строку аутентификации в формате "логин:пароль"
    const authString = `${login}:${password}`;

    // Кодируем строку аутентификации в формате Base64
    const encodedAuthString = Buffer.from(authString).toString("base64");
    const res = await request(app)
      .post(
        `/blogs/${blogId}/posts?pageNumber=1&pageSize=10&sortBy=createdAt&sortDirection=desc`
      )
      .send({
        title: 23,
        shortDescription: "aaa",
        content: "a",
        blogId: "XXX",
      })
      .set("Authorization", `Basic ${encodedAuthString}`)
      .expect(HTTP_STATUS.NOT_FOUND_404);
  });
});
