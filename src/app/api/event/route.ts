export async function POST(req: Request): Promise<Response> {
    const eventBody: any = await req.json();
    const eventBodyString = JSON.stringify(eventBody);

    return fetch('https://plausible.io/api/event', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Content-Length': eventBodyString.length.toString(),
        },
        body: eventBodyString,
    });
}