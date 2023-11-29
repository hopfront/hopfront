import { XHRFrontRequest } from "@/app/lib/dto/XHRFrontRequest";
import { getHopFrontVersion } from "@/app/lib/openapi/utils";

export async function POST(req: Request): Promise<Response> {
    const request: XHRFrontRequest = await req.json()

    if (!request) {
        throw Error('no request found');
    }

    let result: Response;

    console.log('Using proxy to send request to:', request.path);
    console.log('Method:', request.method);
    const headers = request.headers;
    console.log('Headers:', headers);

    if (headers) {
        // @ts-ignore
        headers['User-Agent'] = `hopfront/${(getHopFrontVersion())}`;
    }

    try {
        if (request.method === 'GET') {
            result = await fetch(request.path, {
                method: 'GET',
                headers: headers
            });
        } else if (request.method === 'POST' || request.method === 'PUT') {
            result = await fetch(request.path, {
                method: request.method,
                headers: headers,
                body: request.body
            })
        } else if (request.method === 'DELETE') {
            result = await fetch(request.path, {
                method: 'DELETE',
                headers: headers
            })
        } else {
            throw Error('Unknown method: ' + request.method);
        }
    } catch (e) {
        if (e instanceof Error && e.cause?.toString()?.includes('ENOTFOUND')) {
            return new Response('Could not connect to host', { status: 503 })
        }
        throw e;
    }

    const responseHeaders = new Headers(result.headers)
    responseHeaders.delete('content-encoding') // fetch decompressed the response body, we don't want the client to do it again
    return new Response(result.body, {
        status: result.status,
        headers: responseHeaders
    });
}