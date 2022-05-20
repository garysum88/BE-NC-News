process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const { string } = require("pg-format");


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

        return request(app).
        get("/api/articles/1").
        expect(200).then(({body}) => {
            expect(body.article).toEqual(
                expect.objectContaining({
            author: 'butter_bridge',
            title: 'Living in the shadow of a great man',
            article_id: 1,
            body: 'I find this existence challenging',
            topic: 'mitch',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100
                })
            );
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

        return request(app)
        .patch("/api/articles/1")
        .send(obj)
        .expect(200).then(({body}) => {
            expect(body.article).toEqual(
                expect.objectContaining({
                    author: 'butter_bridge',
                    title: 'Living in the shadow of a great man',
                    article_id: 1,
                    body: 'I find this existence challenging',
                    topic: 'mitch',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 110
                })
            )
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

describe("7. GET /api/articles/:article_id (comment count)", () => {
    test("returns status 200 and an article object with the count of comment", () => {

        return request(app)
        .get("/api/articles/1")
        .expect(200).then(({body}) => {
            expect(body.article).toEqual(
                expect.objectContaining({
                    author: 'butter_bridge',
                    title: 'Living in the shadow of a great man',
                    article_id: 1,
                    body: 'I find this existence challenging',
                    topic: 'mitch',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 100,
                    comment_count: 11
                }
                )
            )

        })
    })
})

describe("8. GET /api/articles", () => {
    test("returns an articles array of article objects", () => {

        return request(app)
        .get("/api/articles")
        .expect(200).then(({body : {articles}}) => {

            expect(articles).toHaveLength(12)

            articles.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        author : expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                )
            })
        })
        })

        test("returns an articles array of article objects that is sorted by date in descending order", () => {

            return request(app)
            .get("/api/articles")
            .expect(200).then(({body : {articles}}) => {
    
            expect(articles).toBeSortedBy('created_at',{descending : true})
            })
            })
    })


    describe("9. GET/api/articles/article_id/comments", () => {

        test("returns status 200 and an array of comment objects", () => {
            return request(app).
            get("/api/articles/1/comments").
            expect(200).then(({body:{comments}}) => {
                expect(comments).toHaveLength(11)

                comments.forEach((comment)=> {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id : expect.any(Number),
                            votes: expect.any(Number),
                            created_at : expect.any(String),
                            author : expect.any(String),
                            body : expect.any(String)
                        })
                    )
                })
            })
        })
    
        test("returns status 200 and an empty array when passed an article id which exists but has no associated comment", () => {

            return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({body}) => {
            expect(body).toEqual({comments:[]})

            })
        })

        test("returns status 404 with passed an article id which does not exist", () => {

            return request(app)
            .get("/api/articles/2000/comments")
            .expect(404)
            .then(({body}) => {
            expect(body.message).toEqual("The article id does not exist")

            })
        })

        test("returns status 400 with passed an invalid article id", () => {

            return request(app)
            .get("/api/articles/NeverLand/comments")
            .expect(400)
            .then(({body}) => {
            expect(body.message).toEqual("Bad request")

            })
        })
    })



    describe("10. POST /api/articles/:article_id/comments", () => {
    
        test("returns status 201 and newly added comment object when passed an article id and the object in the request", () => {

            const reqObj = { username : "icellusedkars", body: "It only ends once. Everything that happens before that is just progress"}

            return request(app)
            .post("/api/articles/1/comments")
            .send(reqObj)
            .expect(201)
            .then(({body}) => {
            expect(body.comment).toEqual(expect.objectContaining({
                author : "icellusedkars",
                body: "It only ends once. Everything that happens before that is just progress",
                article_id : 1,
                votes : 0,
                created_at: expect.any(String)
            }))

            })
        })

        test("returns status 400 when passed an empty object", () => {

            const reqObj = {}

            return request(app)
            .post("/api/articles/1/comments")
            .send(reqObj)
            .expect(400)
            .then(({body}) => {
            expect(body.message)
            .toEqual("You have not sent a valid username and/or body.")
        })

    })

    test("returns status 400 when passed an invalid object", () => {

        const reqObj = {popstar : "Jason Mraz", favSong : "I'm Yours"}

        return request(app)
        .post("/api/articles/1/comments")
        .send(reqObj)
        .expect(400)
        .then(({body}) => {
        expect(body.message)
        .toEqual("You have not sent a valid username and/or body.")
    })
})


test("returns status 404 when passed a request to an non-existing article", () => {
 
    const reqObj = { username : "icellusedkars", body: "It only ends once. Everything that happens before that is just progress"}

    return request(app)
    .post("/api/articles/1000/comments")
    .send(reqObj)
    .expect(404)
    .then(({body}) => {
    expect(body.message)
    .toEqual("Not found")
})
})

test("returns status 404 when passed an request object with a non-existing username (author) in the users database", () => {

    const reqObj = { username : "garysum", body: "They fight. They destroy. They corrupt. It always ends the same"}

    return request(app)
    .post("/api/articles/1/comments")
    .send(reqObj)
    .expect(404)
    .then(({body}) => {
    expect(body.message)
    .toEqual("Not found")
})
})

test("returns status 400 when passed not an object", () => {

    const reqObj = "I am passing a string instead of an object"

    return request(app)
    .post("/api/articles/1/comments")
    .send(reqObj)
    .expect(400)
    .then(({body}) => {
    expect(body.message)
    .toEqual("You have not sent a valid username and/or body.")
})
})

test("returns status 400 when passed not an object", () => {

    const reqObj = { username : "icellusedkars", body: "We shall never surrender!"}

    return request(app)
    .post("/api/articles/DarkestHour/comments")
    .send(reqObj)
    .expect(400)
    .then(({body}) => {
    expect(body.message)
    .toEqual("Bad request")
})
})

})



describe("11. GET /api/articles (queries)", () => {

        test("returns an articles array of article objects | HAPPY PATH |  ?sort_by=topic", () => {

            return request(app)
            .get("/api/articles?sort_by=topic")
            .expect(200).then(({body : {articles}}) => {
    
                expect(articles).toHaveLength(12)
                expect(articles).toBeSortedBy('topic',{descending : true})
    
                articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            author : expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)
                        })
                    )
                })
            })
            })

            test("returns an articles array of article objects | HAPPY PATH | ?sort_by=author&order=ASC", () => {

                return request(app)
                .get("/api/articles?sort_by=author&order=ASC")
                .expect(200).then(({body : {articles}}) => {
        
                    expect(articles).toHaveLength(12)
                    expect(articles).toBeSortedBy('author',{descending : false})
        
                    articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                author : expect.any(String),
                                title: expect.any(String),
                                article_id: expect.any(Number),
                                topic: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number)
                            })
                        )
                    })
                })
                })

                test("returns an articles array of article objects | HAPPY PATH |  ?topic=cats&order=DSC", () => {

                    return request(app)
                    .get("/api/articles?topic=cats&order=ASC")
                    .expect(200).then(({body : {articles}}) => {
            
                        expect(articles).toHaveLength(1)
                        expect(articles).toBeSortedBy('author',{descending : true})
            
                        articles.forEach((article) => {
                            expect(article).toEqual(
                                expect.objectContaining({
                                    author : expect.any(String),
                                    title: expect.any(String),
                                    article_id: expect.any(Number),
                                    topic: expect.any(String),
                                    created_at: expect.any(String),
                                    votes: expect.any(Number),
                                    comment_count: expect.any(Number)
                                })
                            )
                        })
                    })
                    })

                    test("returns an articles array of article objects | HAPPY PATH | existing topic but no article ?topic=paper", () => {

                        return request(app)
                        .get("/api/articles?topic=paper")
                        .expect(200).then(({body}) => {

                            expect(body.articles).toEqual([])
                           
                            })
                        })


                test("returns an articles array of article objects | SAD PATH | non-exist topic ?topic=dogs", () => {

                    return request(app)
                    .get("/api/articles?topic=dogs")
                    .expect(400).then(({body}) => {
            
                        expect(body.message).toEqual("The topic you have entered does not exist")
                       
            
                        })
                    })


                    test("returns an articles array of article objects | SAD PATH | INVALID sort_by (then default sort by time) ?sort_by=hello", () => {

                        return request(app)
                        .get("/api/articles?sort_by=hello")
                        .expect(400).then(({body}) => {
                
                        expect(body.message).toEqual("Bad request - invalid sort_by")

                        })
                        })
                        
                        test("returns an articles array of article objects | SAD PATH | INVALID order (then default desc, while default sort by time when not specified) ?order=yummyfood", () => {

                            return request(app)
                            .get("/api/articles?order=yummyfood")
                            .expect(400).then(({body}) => {
                                expect(body.message).toEqual("Bad request - invalid order (neither asc nor desc)")
                            })
                            })
      
                    test("returns status 404 and an error message  | SAD PATH | INVALID TOPIC ?topic=1234567", () => {

                        return request(app)
                        .get("/api/articles?topic=1234567")
                        .expect(400)
                        .then(({body}) => {
                        expect(body.message)
                        .toEqual("The topic you have entered does not exist")
                        })
                        })

                        
                    })


                    describe("12. DELETE /api/comments/:comment_id", () => {

                        test("returns status 204 and return no content upon successful deletion", () => {
                            return request(app).
                            delete("/api/comments/1").
                            expect(204)
                        })
                    
                        test("returns status 400 when passed an invalid comment_id", () => {
                            return request(app).
                            delete("/api/comments/katherine").
                            expect(400).then(({body}) => {
                                expect(body.message).toEqual("Bad request");
                            })
                        })
                    
                        test("returns status 404 when passed a non-exist comment_id", () => {
                            return request(app).
                            delete("/api/comments/721").
                            expect(404).then(({body}) => {
                                expect(body.message).toEqual("The comment_id you entered does not exist");
                            })
                        })
                    
                    })

