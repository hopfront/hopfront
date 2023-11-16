import {OpenAPIRepository} from "@/app/api/lib/repository/OpenAPIRepository";
import {OperationExtension} from "@/app/lib/dto/OpenApiExtensions";
import {NextResponse} from "next/server";

export async function PUT(req: Request) {
    const apiSpecId = req.url.split('/')[5];
    const body: OperationExtension = await req.json()
    OpenAPIRepository.getInstance().saveOperationExtension(apiSpecId, body);
    return NextResponse.json({});
}