const api = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}/`;

export default {
    get api() { return api;},
    uploads: {
        get images() { return `${api}uploads/images/`},
        get flags() { return `${api}uploads/flags/`}
    }
}