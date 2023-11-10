import {OpenAPIRepository} from "@/app/api/lib/repository/OpenAPIRepository";
import {NextResponse} from "next/server";
import {problemResponse} from "@/app/api/lib/utils/utils";
import {Problem} from "@/app/lib/dto/Problem";

export interface ApiSpecSpecResponseBody {
    spec: string
}

export async function GET(req: Request): Promise<NextResponse<ApiSpecSpecResponseBody | Problem>> {
    const apiSpecId = req.url.split('/')[5];
    const documentSpec = OpenAPIRepository.getInstance().getDocumentSpec(apiSpecId);

    if (documentSpec) {
        return NextResponse.json({
            spec: documentSpec,
        });
    } else {
        return problemResponse({
            status: 404,
            title: `Could not find spec for api spec with id=${apiSpecId}`,
            detail: ''
        });
    }
}