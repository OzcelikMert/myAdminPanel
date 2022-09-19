import {StatusId} from "../../constants";
import LanguageKeys from "../app/languages";

interface StatusDocument {
    id: StatusId,
    order: number,
    langKey: LanguageKeys
}

export {
    StatusDocument
}
