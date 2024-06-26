import {PostTermTypeId} from "constants/index";
import LanguageKeys from "../app/languages";

interface PostTermTypeDocument {
    id: PostTermTypeId,
    order: number,
    langKey: LanguageKeys
}

export {
    PostTermTypeDocument
}
