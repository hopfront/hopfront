import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import { NextResponse } from "next/server";
import { OpenAPIV3 } from "openapi-types";
import ServerObject = OpenAPIV3.ServerObject;

export async function PUT(req: Request) {
    const apiSpecId = req.url.split('/')[5];
    const body: ServerObject[] = await req.json()
    OpenAPIRepository.getInstance().saveServersExtension(apiSpecId, body);
    return NextResponse.json({});
}