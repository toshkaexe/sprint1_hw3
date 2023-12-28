import {db, postCollection} from "../db/db"
import {blogRoute} from "../routes/blog-route";
import {OutputBlogType} from "../models/blogs/output";
import {PostType} from "../models/posts/output";
import {CreatePostModel, UpdatePostModel} from "../models/posts/input";
import {Params} from "../models/common";
import {ObjectId, WithId} from "mongodb";

import {BlogRepository} from "./blog-repository";
import {inflate} from "zlib";
import {PostMapper} from "../models/posts/mappers/mapper";

export class PostRepository {
    static async getAllPosts() {
        const posts = await postCollection.find({}).toArray();
        return posts.map(PostMapper);

    }

    static async getPostById(id: string) {
        try {
            const post = await postCollection.findOne({_id: new ObjectId(id)});
            if (!post) {
                return null;
            }
            return PostMapper(post);

        } catch (err) {
            return null;
        }

    }

    static async createPost(data: CreatePostModel) {
        const createdAt = new Date();
        const blog = await BlogRepository.getBlogById(data.blogId);

        if (blog) {
            const newPost = {
                ...data,
                blogName: blog.name,
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
        if (!blog){return  false;}
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