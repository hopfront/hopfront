import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import { NextResponse } from "next/server";
import { OpenAPIV3 } from "openapi-types";
import ServerObject = OpenAPIV3.ServerObject;
import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return new NextResponse(null, { status: 403 })
    }
    
    const apiSpecId = req.url.split('/')[5];
    const body: ServerObject[] = await req.json()
    OpenAPIRepository.getInstance().saveServersExtension(apiSpecId, body);
    return NextResponse.json({});
}