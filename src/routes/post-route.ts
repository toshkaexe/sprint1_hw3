import {Router, Request, Response} from 'express';
import {BlogRepository} from "../repositories/blog-repository";
import {authMiddleware} from "../middlewares_validation/auth-middlewares";
import {blogValidation, nameValidation} from "../validators/blog-validation";
import {PostRepository} from "../repositories/post-repository";

import {
    BlogBody,
    Params,
    PostBody,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody
} from "../models/common";
import {randomUUID} from "crypto";
import {blogRoute} from "./blog-route";
import {CreatePostModel} from "../models/posts/input";
import {postValidation} from "../validators/post-validation";
import {db} from "../db/db";

export const postRoute = Router({})

postRoute.get('/', (req, res) => {

    const blogs = PostRepository.getAllPosts()
    res.send(blogs)
})


postRoute.get('/:id', (req, res) => {
    const id = req.params.id
    const blog = PostRepository.getPostById(id)

    if (!blog) {
        res.sendStatus(404)
        return

    }
    res.send(blog)
})

postRoute.post(
    '/',
    authMiddleware,
    postValidation(),
    (req: RequestWithBody<CreatePostModel>, res: Response) => {

        let {
            title,
            shortDescription,
            content,
            blogId
        } = req.body;

        const newPost = {
            id: randomUUID(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: ""
        }
        PostRepository.createPost(newPost);
        return res.status(201).send(newPost);
    });


postRoute.put('/:id',
    authMiddleware,
    postValidation(),

    (req: RequestWithParamsAndBody<Params,PostBody>, res: Response) => {
        const id = req.params.id;

        let {title,
            shortDescription,
            content,
            blogId} = req.body;

        const updatedPost = PostRepository.getPostById(id);
        if (!updatedPost) {
            res.sendStatus(404);
            return
        }
        const postIndex = db.posts.findIndex((p) => p.id == id);
        if (postIndex == -1) {
            res.sendStatus(404);
            return;
        }
        updatedPost.content = content;
        updatedPost.shortDescription = shortDescription;
        updatedPost.title = title;
        updatedPost.blogId = blogId;

        // db.posts.splice(postIndex, 1);
        res.status(204).send(updatedPost);
    });

postRoute.delete('/:id',
    authMiddleware,

    (req: RequestWithParams<Params>, res: Response) => {
        const id = req.params.id;
        const post = PostRepository.getPostById(id);
        if (!post) {
            res.sendStatus(404);
            return
        }
        const postIndex = db.posts.findIndex((p) => p.id == id);
        if (postIndex == -1) {
            res.sendStatus(404);
            return;
        }
        db.posts.splice(postIndex, 1);
        res.sendStatus(204);
    })