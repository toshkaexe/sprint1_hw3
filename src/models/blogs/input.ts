//то, что приходит от клинта

export type CreateBlogModel = {
    name: string,
    description: string,
    websiteUrl: string
}

export type UpdateBlogModel = {
    name: string,
    description: string,
    websiteUrl: string
}