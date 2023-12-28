import {blogCollection, db} from "../db/db"
import {blogRoute} from "../routes/blog-route";
import {OutputBlogType} from "../models/blogs/output";
import {UpdatePostModel} from "../models/posts/input";
import {Params} from "../models/common";
import {CreateBlogModel, UpdateBlogModel} from "../models/blogs/input";
import {blogMapper} from "../models/blogs/mappers/mapper";
import {ObjectId} from "mongodb";
import {BlogDBType} from "../models/db/db";

export class BlogRepository {
    static async getAllBlogs(): Promise<OutputBlogType[]> {
        const blogs =
            await blogCollection.find({}).toArray();
        return blogs.map(blogMapper)
    }

    static async getBlogById(id: string): Promise<OutputBlogType | null> {
        if (id == null) return null;
        try {
            const blog = await blogCollection.findOne({_id: new ObjectId(id)});
            if (!blog) {
                return null
            }
            return blogMapper(blog)
        } catch (err) {
            return null;
        }
    }


    static async createBlog(createdData: CreateBlogModel): Promise<String | null> {
        const createdAt = new Date();

        try {
            const newBlog: BlogDBType = {
                ...createdData,
                createdAt: createdAt.toISOString(),
                isMembership: false
            }
            const blog = await blogCollection.insertOne(newBlog)

            return blog.insertedId.toString();
        } catch (err) {
            return null;
        }
    }


    static async updateBlog(id: string, updatedData: UpdateBlogModel): Promise<boolean> {
        try {
            const blog = await blogCollection.updateOne({_id: new ObjectId(id)},
                {
                    $set: {
                        name: updatedData.name,
                        description: updatedData.description,
                        websiteUrl: updatedData.websiteUrl
                    }
                })
            return !!blog.matchedCount;
        } catch (err) {
            return false;
        }
    }

    static async deleteBlogById(id: string): Promise<boolean> {
        try {
            const blog = await blogCollection.deleteOne({_id: new ObjectId(id)})
            return !!blog.deletedCount;
        } catch (err) {
            return false;
        }
    }
}