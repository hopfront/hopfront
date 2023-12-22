import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository"
import { AuthenticationService } from "@/app/api/lib/service/AuthenticationService";
import { NextResponse } from "next/server"

export async function POST(req: Request): Promise<Response> {
    const body = await req.json() as InstanceAdminPasswordRequest

    if (InstanceRepository.isAdminPasswordValid(body.password)) {
        const response = new NextResponse(null, { status: 200 });
        return AuthenticationService.addCookieTokensToResponse(response);
    } else {
        return NextResponse.json({ message: 'Wrong credentials' }, { status: 403 });
    }
}