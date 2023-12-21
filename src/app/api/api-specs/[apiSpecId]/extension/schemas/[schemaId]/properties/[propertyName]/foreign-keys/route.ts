import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import {ForeignKey} from "@/app/lib/dto/OpenApiExtensions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const schemaRefFromSchemaId = (schemaId: string): string => {
    return atob(schemaId);
}

export async function POST(req: Request) {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return new NextResponse(null, { status: 403 })
    }
    
    const apiSpecId = req.url.split('/')[5];
    const schemaId = req.url.split('/')[8];
    const propertyName = req.url.split('/')[10];

    const foreignKey: ForeignKey = await req.json()

    OpenAPIRepository.getInstance().addSchemaPropertyExtensionForeignKey(
        apiSpecId, schemaRefFromSchemaId(schemaId), propertyName, foreignKey);

    return NextResponse.json({});
}