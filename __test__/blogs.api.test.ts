import request from 'supertest';
import {describe, it} from "node:test";
import {app} from "../src/settings";


const routerName = "/blogs/";

describe(routerName, () =>{
    //clear DB before testing
    beforeAll(async ()=>{
         await request(app).delete("/testing/all-data");
    })

it("01  - should be return 200 and empty array", async ()=>{
    await request(app).get(routerName).expect(200, []);


})

})