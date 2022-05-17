process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data")


beforeEach(() => seed(data));

afterAll( () =>  db.end())

describe("Error Handling", () => {

    test("returns status 404 for non-existing path", () => {
        return request(app).
        get("/api/404test").
        expect(404).then((response) => {
            expect(response.body).toEqual({ message: "Endpoint not found" });
        })
    })

})

describe("3-GET /api/topics", () => {
    test("returns status 200, object that contains all topics from the db (with the property of slug and description", () => {
        return request(app).
        get("/api/topics").
        expect(200).then(({body : {topics}}) => {
            expect(topics).toHaveLength(3)

            topics.forEach((topic) => {
                expect(topic).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description : expect.any(String)
                    })
                )
            })
        })
    })

})

describe("4. GET /api/articles/:article_id", () => {

    test("returns status 200 with the article specified in the param", () => {

        const expected =  {
            author: 'butter_bridge',
            title: 'Living in the shadow of a great man',
            article_id: 1,
            body: 'I find this existence challenging',
            topic: 'mitch',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100
          }
        return request(app).
        get("/api/articles/1").
        expect(200).then((article) => {
            expect(article.body).toEqual(expected);
        })
    })

    test("returns status 404 with a non-existing article id. with a customised error message", () => {

        return request(app).
        get("/api/articles/1000").
        expect(404).then((response) => {
            expect(response.body.message).toEqual("Article with that article_id does not exist");
        })
    })

    test("returns status 400 with an invalid article_id (e.g not a number)", () => {

        return request(app).
        get("/api/articles/helloworld").
        expect(400).then((response) => {
            expect(response.body.message).toEqual("Bad request");
        })
    })
})