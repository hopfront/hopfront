import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import {ForeignKey} from "@/app/lib/dto/OpenApiExtensions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const apiSpecId = req.url.split('/')[5];
    const operationId = req.url.split('/')[8];
    const parameterName = req.url.split('/')[10];

    const foreignKey: ForeignKey = await req.json()

    OpenAPIRepository.getInstance().addOperationParameterExtensionForeignKey(
        apiSpecId, operationId, parameterName, foreignKey);

    return NextResponse.json({});
}