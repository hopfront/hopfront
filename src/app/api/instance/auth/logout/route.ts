import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { AuthenticationService } from "@/app/api/lib/service/AuthenticationService";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return NextResponse.json({ 'message': 'Access forbidden' }, { status: 403 })
    }

    const response = new NextResponse(null, { status: 204 })

    return AuthenticationService.removeCookieTokenFromResponse(response);
}