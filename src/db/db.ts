import {DBType} from "../models/db/db";

export let db:DBType = {
    blogs: [
        {
            id: "12345",
            name: "string",
            description: "eins, zwei, drei",
            websiteUrl: "www.yandex.ru"
        },
        {
            id: "1",
            name: "hello",
            description: "vier, fünf, sechs",
            websiteUrl: "www.google.com"
        }

    ],
    posts: [
        {
            id: "90",
            title: "test post title",
            shortDescription: "short test Description",
            content: "test content",
            blogId: "12345",
            blogName: "string"
        }
    ]
}

