
import request from 'supertest';
import {app} from "../src/settings";


import {StatusCode} from "../src/models/common";


const routerName = "/posts/";

describe(routerName, () => {
    //clear DB before testing
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    })

    it("01  - GET /posts", async () => {
        await request(app)
            .get('/posts')
            .expect(200);
    });


    it("02  - GET /posts/:id with wrong id", async () => {
        //const {postId} = expect.getState()
        const postId = 99999999999999;
        await request(app)
            .get(`/posts/${postId}`)
            .expect(404);
    });


    it("02  - GET /posts/:id with wrong id\"", async () => {
        await request(app)
            .get('/posts')
            .expect(200);
    });

    it("01  - GET /posts", async () => {
        await request(app)
            .get('/posts')
            .expect(200);
    });

})