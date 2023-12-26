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
    RequestWithParamsAndBody, StatusCode
} from "../models/common";
import {randomUUID} from "crypto";
import {blogRoute} from "./blog-route";
import {CreatePostModel} from "../models/posts/input";
import {postValidation} from "../validators/post-validation";
import {db} from "../db/db";

export const postRoute = Router({})

postRoute.get('/', async (req, res) => {

    const posts = await PostRepository.getAllPosts();

    res.status(StatusCode.OK_200).json(posts);
})


postRoute.get('/:id', async (req, res) => {
    const id = req.params.id
    const post = await PostRepository.getPostById(id);

    if (!post) {
        res.sendStatus(404)
        return

    }
    res.status(StatusCode.OK_200).json(post);
})

postRoute.post(
    '/',
    authMiddleware,
    postValidation(),
    async (req: RequestWithBody<CreatePostModel>, res: Response) => {

        const createData = req.body;
        const postId = await PostRepository.createPost(createData);
        if (postId) {
            const newPost = await PostRepository.getPostById(postId);
            if (newPost) {
                res.status(201).json(newPost);
            }
        }
        return res.sendStatus(404);

    });


postRoute.put('/:id',
    authMiddleware,
    postValidation(),
    async (req: RequestWithParamsAndBody<Params, PostBody>, res: Response) => {
        const id = req.params.id;
        const updateData = req.body;
        const isUpdated = await PostRepository.updatePost({id: id}, updateData);

        if (!isUpdated) {
            res.sendStatus(StatusCode.NoContent_204);
            return
        }
        res.sendStatus(StatusCode.NotFound_404)


    });


postRoute.delete('/:id',
    authMiddleware,
    async (req: RequestWithParams<Params>, res: Response) => {

        const isDeleted = await PostRepository.deletePost({id: req.params.id});
        if (isDeleted) res.sendStatus(StatusCode.NoContent_204)
        else res.sendStatus(StatusCode.NotFound_404)
    })