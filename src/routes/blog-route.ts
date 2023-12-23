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


export const blogRoute = Router({})

blogRoute.get('/', (req, res) => {
    const blogs = BlogRepository.getAllBlogs();
    res.send(blogs);
});


blogRoute.get('/:id', (req: Request, res: Response) => {

    const id = req.params.id

    const blog = BlogRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(404)
        return

    }

    res.status(200).send(blog)

})



blogRoute.post(
    '/',
    authMiddleware,
    blogValidation(),
    (req: RequestWithBody<CreateBlogModel>, res: Response) => {

        let {
            name,
            description,
            websiteUrl
        } = req.body;

        const newBlog = {
            id: randomUUID(),
            name,
            description,
            websiteUrl
        }
        BlogRepository.createBlog(newBlog);
        return res.status(201).send(newBlog);
    });


blogRoute.put(
    '/:id',
    authMiddleware,
    blogValidation(),
    (req: RequestWithParamsAndBody<Params, BlogBody>, res: Response) => {

        const id = req.params.id;
        let updatedBlog = BlogRepository.getBlogById(id);
        console.log(updatedBlog)

        let {name, description, websiteUrl} = req.body;

        if (!updatedBlog) {
            res.sendStatus(404);
            return;
        }

        updatedBlog.name = name;
        updatedBlog.description = description;
        updatedBlog.websiteUrl = websiteUrl;

        return res.status(204).send(updatedBlog)

    });


blogRoute.delete('/:id',
    authMiddleware,
    (req: RequestWithParams<Params>, res: Response) => {
        const id = req.params.id;
        const blog = BlogRepository.getBlogById(id);
        if (!blog) {
            res.sendStatus(404);
            return;
        }
        const blogIndex = db.blogs.findIndex((item) => item.id == id)
        if (blogIndex == -1) {
            res.sendStatus(404)
            return
        }
        db.blogs.splice(blogIndex, 1)
        return res.sendStatus(204)
    })