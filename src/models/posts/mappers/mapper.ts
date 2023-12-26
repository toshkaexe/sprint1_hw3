import {WithId} from "mongodb";
import {PostType, OutputPostType} from "../output";

export const PostMapper = (post: WithId<PostType>): OutputPostType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt

    }
}
