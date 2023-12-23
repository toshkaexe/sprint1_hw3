import {db} from "../db/db"
import {blogRoute} from "../routes/blog-route";
import {BlogModel} from "../models/blogs/output";
import {UpdatePostModel} from "../models/posts/input";
import {Params} from "../models/common";
import {CreateBlogModel, UpdateBlogModel} from "../models/blogs/input";

export class BlogRepository {
    static getAllBlogs() {
        return db.blogs
    }

    static getBlogById(id: string) {
        const blog = db.blogs.find((b: { id: string }) => b.id === id);
        if (!blog) {
            return null;
        }
        return blog;
    }

    static createBlog(creteBlog: BlogModel) {
        return db.blogs.push(creteBlog);

    }


    static removeAllBlogs() {
        db.blogs=[];
    }


    static updateBlog(params: UpdateBlogModel, p1: Params) {
        const blogIndex = db.blogs
            .findIndex(p => p.id === p1.id)
        const blog = this.getBlogById(p1.id)
        if (!blog) {
            return false
        }
        const updateBlog = {
            ...blog,
            name: params.name,
            description: params.description,
            websiteUrl: params.websiteUrl
        }
        db.blogs.splice(blogIndex, 1, updateBlog)
        return true;


    }
}