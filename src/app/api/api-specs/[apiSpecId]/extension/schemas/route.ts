import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import { SchemaExtension } from "@/app/lib/dto/OpenApiExtensions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return new NextResponse(null, { status: 403 })
    }

    const apiSpecId = req.url.split('/')[5];
    const body: SchemaExtension = await req.json()
    OpenAPIRepository.getInstance().saveSchemaExtension(apiSpecId, body);
    return NextResponse.json({});
}