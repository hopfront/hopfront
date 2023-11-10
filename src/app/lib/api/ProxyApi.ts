import {XHRFrontRequest} from "@/app/lib/dto/XHRFrontRequest";

export class ProxyApi {

    public static async queryProxy(request: XHRFrontRequest, timeout: number = 30000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        return fetch('/api/proxy', {
            method: 'POST',
            body: JSON.stringify(request as XHRFrontRequest),
            signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));
    }
}