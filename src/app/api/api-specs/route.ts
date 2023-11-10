import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { NextResponse } from "next/server";
import {buildApiSpecId} from "@/app/lib/openapi/utils";

export interface ApiSpecListResponseBody {
    apiSpecs: ApiSpec[]
}

export async function GET(request: Request): Promise<NextResponse<ApiSpecListResponseBody>> {
    const documents = OpenAPIRepository.getInstance().getDocuments();

    if (request.url) {
        // Using the "request: Request" param is a way to disable NextJS cache, even though it's not useful here.
        // NextJS chose to cache this query because it's a GET that doesn't use any input.
    }

    return NextResponse.json({
        apiSpecs: documents.map(document => {
            return {
                id: buildApiSpecId(document),
                document: document
            }
        })
    });
}