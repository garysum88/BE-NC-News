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

describe("3. GET /api/topics", () => {
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
        expect(200).then(({body}) => {
            expect(body.article).toEqual(expected);
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


describe("5. PATCH /api/articles/:article_id", () => {
    test("returns status 202 and the updated object", () => {

        const obj = { inc_votes: 10 }
        const expected =  {
            author: 'butter_bridge',
            title: 'Living in the shadow of a great man',
            article_id: 1,
            body: 'I find this existence challenging',
            topic: 'mitch',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 110
          }

        return request(app)
        .patch("/api/articles/1")
        .send(obj)
        .expect(202).then(({body}) => {
            expect(body.article).toEqual(expected)
        })
    })

    test("returns status 400 when passed an empty object,", () => {

        return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400).then(({body}) => {
            expect(body).toEqual({message : "Bad request"})
        })

    })

    test("returns status 400 when passed an object which does not have a key name 'inc_votes'", () => {

        return request(app)
        .patch("/api/articles/1")
        .send({superhero:100})
        .expect(400).then(({body}) => {
            expect(body).toEqual({message : "Bad request"})
        })
    })

    test("returns status 400 when passed an object with non-numberirc value in 'inc_votes'", () => {

        const obj = { inc_votes: "ten votes" }

        return request(app)
        .patch("/api/articles/1")
        .send(obj)
        .expect(400).then(({body}) => {
            expect(body).toEqual({message : "You should enter a number in inc_votes"})
        })
    })

    test("returns status 404 when the article_id does not exist", () => {

        const obj = { inc_votes: 10 }

        return request(app)
        .patch("/api/articles/1989604")
        .send(obj)
        .expect(404).then(({body}) => {
            expect(body.message).toBe("Article with that article_id does not exist")
        })
    })
})



describe("6. GET /api/users", () => {
    test("returns status 200 and an array of objects (with username property", () => {

        return request(app)
        .get("/api/users")
        .expect(200).then(({body : {users}}) => {
            expect(users).toHaveLength(4)

            users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username : expect.any(String)
                    })
                )
            })

        })
    })
})

