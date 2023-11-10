export type XHRFrontRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'TRACE';

export interface XHRFrontRequest {
    method: XHRFrontRequestMethod,
    headers?: {},
    path: string,
    body?: any
}