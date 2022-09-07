import {StatusDocument} from "../types/constants";

const Status: Array<StatusDocument> = [
    {id: 1, order: 1},
    {id: 2, order: 2},
    {id: 3, order: 3},
    {id: 4, order: 4},
    {id: 5, order: 5},
    {id: 6, order: 6}
]

enum StatusId {
    Active = 1,
    InProgress,
    Pending,
    Disabled,
    Banned,
    Deleted
}

export {Status, StatusId};
