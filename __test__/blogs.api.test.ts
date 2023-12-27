import {app} from "../src/settings";
import request from "supertest";


const routerName = "/blogs/";

describe(routerName, () => {
    //clear DB before testing
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    })

    it("01 POST new blog", async () => {
        await request(app).post("/blogs/")
            .auth("admin", "qwerty")
            .expect(400, []);
    })


    it("02 GET new blog ", async () => {
        await request(app).get("/blogs/")
            .expect(200, []);
    })


})