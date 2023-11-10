import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import { ApiConfig } from "@/app/lib/dto/ApiConfig";

export async function PUT(req: Request): Promise<Response> {
    const apiSpecId = req.url.split('/')[5];
    const body = await req.json() as ApiConfig;

    OpenAPIRepository.getInstance().saveApiConfig(apiSpecId, body);
    return new Response(null, { status: 204 });
}