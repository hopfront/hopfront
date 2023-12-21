import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import { ApiConfig } from "@/app/lib/dto/ApiConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req: Request): Promise<Response> {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return new NextResponse(null, { status: 403 })
    }

    const apiSpecId = req.url.split('/')[5];
    const body = await req.json() as ApiConfig;

    OpenAPIRepository.getInstance().saveApiConfig(apiSpecId, body);
    return new Response(null, { status: 204 });
}