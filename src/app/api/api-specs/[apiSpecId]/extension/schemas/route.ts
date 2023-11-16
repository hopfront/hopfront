import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import { SchemaExtension } from "@/app/lib/dto/OpenApiExtensions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const apiSpecId = req.url.split('/')[5];
    const body: SchemaExtension = await req.json()
    OpenAPIRepository.getInstance().saveSchemaExtension(apiSpecId, body);
    return NextResponse.json({});
}