import {db, postCollection} from "../db/db"
import {blogRoute} from "../routes/blog-route";
import {OutputBlogType} from "../models/blogs/output";
import {PostType} from "../models/posts/output";
import {CreatePostModel, UpdatePostModel} from "../models/posts/input";
import {Params} from "../models/common";
import {ObjectId, WithId} from "mongodb";

import {BlogRepository} from "./blog-repository";
import {inflate} from "zlib";
import {postMapper} from "../models/posts/mappers/mapper";

export class PostRepository {
    static async getAllPosts() {
        const posts = await postCollection.find({}).toArray();
        return posts.map(postMapper);

    }

    static async getPostById(id: string) {
        try {
            const post = await postCollection.findOne({_id: new ObjectId(id)});
            if (!post) {
                return null;
            }
            return postMapper(post);

        } catch (err) {
            return null;
        }

    }

    static async createPost(data: CreatePostModel) {
        const createdAt = new Date();
        const blogName = await BlogRepository.getBlogById(data.blogId);

        if (blogName) {
            const newPost = {
                ...data,
                blogName: blogName.name,
                createdAt: createdAt.toISOString()
            }
            const result = await postCollection.insertOne(newPost);
            return result.insertedId.toString();
        } else {
            return null;
        }
    }

    static async updatePost(p1: Params, params: UpdatePostModel) {
        const blog = await BlogRepository.getBlogById(params.blogId);
        const result = await postCollection.updateOne({_id: new ObjectId(p1.id)},
            {
                $set: {
                    title: params.title,
                    shortDescription: params.shortDescription,
                    content: params.content,
                    blogId: params.blogId,
                    blogName: blog!.name
                }
            });
        return result.matchedCount === 1;
    }

    static async deletePost(p: Params) {
        try {
            const result = await postCollection.deleteOne({_id: new ObjectId(p.id)});
            return result.deletedCount === 1;
        } catch (err) {
            return false
        }
    }
}