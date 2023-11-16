import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { NextResponse } from "next/server";

export interface ApiSpecListResponseBody {
    apiSpecs: ApiSpec[]
}

export async function GET(request: Request): Promise<NextResponse<ApiSpecListResponseBody>> {
    if (request.url) {
        // Using the "request: Request" param is a way to disable NextJS cache, even though it's not useful here.
        // NextJS chose to cache this query because it's a GET that doesn't use any input.
    }

    return NextResponse.json({
        apiSpecs: OpenAPIRepository.getInstance().getApiSpecs()
    });
}