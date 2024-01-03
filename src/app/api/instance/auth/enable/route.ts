import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { AuthenticationService } from "@/app/api/lib/service/AuthenticationService";
import { NextResponse } from "next/server";

export async function PUT(req: Request): Promise<Response> {
    const envPassword = InstanceRepository.getAdminPasswordEnvironmentVariable();

    if (envPassword && envPassword.length > 0) {
        return new Response(
            JSON.stringify({ message: 'Cannot change admin password when HOPFRONT_ADMIN_PASSWORD environment variable is set.' }),
            { status: 409 }
        );
    }

    if (InstanceRepository.getInstanceAdminStatus().isEnabled) {
        return new Response(
            JSON.stringify({ message: 'Admin role is already enabled.' }),
            { status: 409 }
        );
    }

    const body = await req.json() as EnableAdminRoleRequest;
    InstanceRepository.saveInstanceAdminAuth('local', body.password);

    const response = new NextResponse(null, { status: 204 });

    return AuthenticationService.addCookieTokenToResponse(response);
}