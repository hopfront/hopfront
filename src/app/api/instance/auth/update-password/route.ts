import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { AuthenticationService } from "@/app/api/lib/service/AuthenticationService";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return new NextResponse(null, { status: 403 })
    }

    const envPassword = InstanceRepository.getAdminPasswordEnvironmentVariable();
    if (envPassword && envPassword.length > 0) {
        return new Response(
            JSON.stringify({ message: 'Cannot change admin password when HOPFRONT_ADMIN_PASSWORD environment variable is set.' }),
            { status: 409 }
        );
    }

    const body = await req.json() as UpdateAdminPasswordRequest

    if (InstanceRepository.isAdminPasswordValid(body.oldPassword)) {
        InstanceRepository.saveInstanceAdminAuth({ from: 'local', password: body.newPassword });

        const response = new NextResponse(null, { status: 200 });

        return AuthenticationService.addCookieTokenToResponse(response);
    } else {
        return NextResponse.json({ message: 'Wrong credentials' }, { status: 401 });
    }
}