import {OutputBlogType} from '../blogs/output';
import {PostType} from "../posts/output";

export type DBType = {
    blogs: OutputBlogType[],
    posts: PostType[]
}

export type BlogDBType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type PostDBType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}