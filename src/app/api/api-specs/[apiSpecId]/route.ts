import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import { problemResponse } from "@/app/api/lib/utils/utils";
import { InstanceRepository } from "../../lib/repository/InstanceRepository";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request): Promise<Response> {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return new NextResponse(null, { status: 403 })
    }
    
    const apiSpecId = req.url.split('/')[5];

    try {
        OpenAPIRepository.getInstance().deleteApiSpec(apiSpecId);
    } catch (e: any) {
        return problemResponse({
                status: 500,
                title: `Could not delete api spec with id=${apiSpecId}`,
                detail: e.message
            })
    }

    return new Response(null, {status: 204});
}