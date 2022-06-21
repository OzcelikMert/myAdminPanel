import {PostTypeDocument} from "../../modules/static";

const PostTypes: Array<PostTypeDocument> = [
    {id: 1, order: 1},
    {id: 2, order: 2},
    {id: 3, order: 3},
    {id: 4, order: 4},
    {id: 5, order: 5}
]

enum PostTypeId {
    Blog = 1,
    Portfolio,
    Page,
    Slider,
    Reference
}

export {PostTypes, PostTypeId};
