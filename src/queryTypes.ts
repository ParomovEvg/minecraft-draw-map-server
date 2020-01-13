export enum CLIENT_FROM_SERVER {
    AUTH_ERROR = "AUTH_ERROR",
    SRC_CONNECTED = "SRC_CONNECTED",
    SRC_DISCONNECTED = "SRC_DISCONNECTED",
    SET_IMG = "SET_IMG",
    USER_CREATED = "USER_CREATED",
    USER_CLOSED = "USER_CLOSED"
}

export enum CLIENT_FROM_CLIENT {
    CREATE= "CREATE",
    SET_PARAMS = "SET_PARAMS"
}

export interface ISetParams {

}

export interface ICreateClientQuery {
    id:string,
    pass:string,
    type: CLIENT_FROM_CLIENT.CREATE,
}

export enum SRC_FROM_SERVER {
    AUTH_ERROR = "AUTH_ERROR",
    AUTH_NOT_YET = "AUTH_NOT_YET",
    AUTH_BAD_PASS = "AUTH_BAD_PASS",
    SET_PARAMS = "SET_PARAMS",
}

export enum SRC_FROM_CLIENT {
    CREATE = "CREATE",
    SET_IMG = "SET_IMG",
}

export interface ICreateSrcQuery {
    id:string,
    pass:string,
    type: SRC_FROM_CLIENT.CREATE,
}

export interface IFromClientQuery {
    body?: any,
    type?: CLIENT_FROM_CLIENT
}

export interface IFromSrcQuery {
    body?: any,
    type?: SRC_FROM_CLIENT
}




