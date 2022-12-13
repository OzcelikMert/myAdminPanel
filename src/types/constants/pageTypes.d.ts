import {PageTypeId} from "constants/index";
import LanguageKeys from "../app/languages";

interface PageTypeDocument {
    id: PageTypeId,
    order: number,
    langKey: LanguageKeys
}

export {
    PageTypeDocument
}
