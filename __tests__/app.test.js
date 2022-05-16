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