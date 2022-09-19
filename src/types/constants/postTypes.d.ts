import {PostTypeId} from "../../constants";
import LanguageKeys from "../app/languages";

interface PostTypeDocument {
    id: PostTypeId,
    order: number,
    langKey: LanguageKeys
}

export {
    PostTypeDocument
}
