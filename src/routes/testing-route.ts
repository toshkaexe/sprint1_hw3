import {Router, Request, Response} from 'express';
import {StatusCode} from "../models/common";
import {blogCollection, database, db, postCollection} from "../db/db";

export const testingRoute = Router({})

testingRoute.delete('/all-data', async (req: Request, res: Response) => {
    await blogCollection.deleteMany({});
    await postCollection.deleteMany({});
    //await database.dropDatabase();
    res.sendStatus(StatusCode.NoContent_204)


});