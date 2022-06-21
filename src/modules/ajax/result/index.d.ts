interface ResultDocument<T> {
    data: T;
    customData: any;
    status: boolean;
    message: string;
    errorCode: number;
    statusCode: number;
    source: string | any;
}

export {
    ResultDocument
}