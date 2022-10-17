import {PostTermTypeId, PostTypeId} from "../../constants";

type SearchParamDocument = {
    postTypeId: PostTypeId,
    termTypeId: PostTermTypeId,
    termId: string,
    userId: string,
    postId: string,
    componentId: string
}


export default SearchParamDocument