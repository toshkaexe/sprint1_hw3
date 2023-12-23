import {db} from "../db/db"
import {blogRoute} from "../routes/blog-route";
import {BlogModel} from "../models/blogs/output";
import {PostModel} from "../models/posts/output";
import {UpdatePostModel} from "../models/posts/input";
import {Params} from "../models/common";

export class PostRepository {
    static getAllPosts() {
        return db.posts
    }

    static getPostById(id: string) {
        const post = db.posts.find((b) => b.id === id);
        if (!post) {
            return null;
        }
        return post;
    }

    static createBlog(cretePost: PostModel) {
        return db.posts.push(cretePost);

    }

    static createPost(createPost: PostModel) {
        return db.posts.push(createPost)
    }

    static removeAllPosts() {
        db.posts=[];
    }

    static updatePost(params: UpdatePostModel, p1: Params) {
        const postIndex = db.posts.findIndex(p => p.id === p1.id)
        const post = this.getPostById(p1.id)
        if (!post) {
            return false
        }
        const updatePost = {
            ...post,
            title: params.title,
            shortDescription: params.shortDescription,
            content: params.content,
            blogId: params.blogId
        }
        db.posts.splice(postIndex, 1, updatePost)
        return true;


    }
}