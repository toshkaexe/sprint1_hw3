import {WithId} from "mongodb";
import {BlogDBType} from "../../db/db";
import {OutputBlogType} from "../output";

export const blogMapper = (blogDb: WithId<BlogDBType>): OutputBlogType => {
    return {
        id: blogDb._id.toString(),
        name: blogDb.name,
        description: blogDb.description,
        websiteUrl: blogDb.websiteUrl,
        isMembership: blogDb.isMembership,
        createdAt: blogDb.createdAt

    }
}