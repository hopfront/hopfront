import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { AuthenticationService } from "@/app/api/lib/service/AuthenticationService";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request): Promise<Response> {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return NextResponse.json({ 'message': 'Access forbidden' }, { status: 403 })
    }

    const body = await req.json() as DisableAdminRoleRequest
    if (!InstanceRepository.isAdminPasswordValid(body.password)) {
        return NextResponse.json({ 'message': 'Access forbidden' }, { status: 403 })
    }

    InstanceRepository.deleteInstanceAdminAuth();

    const response = new NextResponse(null, { status: 204 });

    return AuthenticationService.removeCookieTokenFromResponse(response);
}