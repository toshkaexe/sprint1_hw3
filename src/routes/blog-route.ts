import {Router, Request, Response} from 'express';
import {BlogRepository} from "../repositories/blog-repository";
import {authMiddleware} from "../middlewares_validation/auth-middlewares";
import {blogValidation, nameValidation} from "../validators/blog-validation";
import {randomUUID} from "crypto";
import {db} from '../db/db'
import {
    BlogBody,
    Params,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, StatusCode
} from "../models/common";
import {CreateBlogModel} from "../models/blogs/input";
import {ObjectId} from "mongodb";


export const blogRoute = Router({})

blogRoute.get('/', async (req, res) => {
    const blogs = await BlogRepository.getAllBlogs();
    res.status(200).send(blogs);
});


blogRoute.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return;

    }


    const blog = await BlogRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(StatusCode.NotFound_404)
        return

    } else {

        res.status(StatusCode.OK_200).send(blog)
    }
})


blogRoute.post(
    '/',
    authMiddleware,
    blogValidation(),
    async (req: RequestWithBody<CreateBlogModel>, res: Response) => {

        const createDate = req.body;
        const blogId = await BlogRepository.createBlog(createDate);
        if (!blogId){
           res.sendStatus(404);
            return;
        }
        const newBlog = await BlogRepository.getBlogById(blogId.toString());
        if (newBlog) {
            res.status(StatusCode.Created_201).json(newBlog);
            return
        }
        res.sendStatus(404);
    });


blogRoute.put(
    '/:id',
    authMiddleware,
    blogValidation(),
    async (req: RequestWithParamsAndBody<Params, BlogBody>, res: Response) => {

        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            res.sendStatus(404)
            return;
        }


        let {name, description, websiteUrl} = req.body;
        let isBlogUpdated = await BlogRepository.updateBlog(id, {name, description, websiteUrl});
        console.log(isBlogUpdated)

        if (!isBlogUpdated) {
            res.sendStatus(404);
            return;
        }


        return res.sendStatus(204);

    });


blogRoute.delete('/:id',
    authMiddleware,
    async (req: RequestWithParams<Params>, res: Response) => {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            res.sendStatus(404)
            return;

        }

        const isDeleted = await BlogRepository.deleteBlogById(id);

        if (!isDeleted) {
            return res.sendStatus(StatusCode.NotFound_404)
        } else {
            return res.sendStatus(StatusCode.NoContent_204)
        }
    })