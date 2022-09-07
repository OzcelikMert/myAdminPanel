import {PostTermTypeDocument} from "../types/constants";

const PostTermTypes: Array<PostTermTypeDocument> = [
    {id: 1, order: 1},
    {id: 2, order: 2},
]

enum PostTermTypeId {
    Category = 1,
    Tag
}

export {PostTermTypes, PostTermTypeId};
