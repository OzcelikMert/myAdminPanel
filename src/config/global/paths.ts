const GlobalPaths = {
    get api() { return `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}/`},
    uploads: {
        get images() { return `${GlobalPaths.api}uploads/images/`},
        get flags() { return `${GlobalPaths.api}uploads/flags/`}
    }
}

export default GlobalPaths;