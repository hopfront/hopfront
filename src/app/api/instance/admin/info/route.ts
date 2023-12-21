
import { InstanceAdminInfoResponse } from "@/app/lib/dto/InstanceAdminInfoResponse";
import { NextResponse } from "next/server";
import { InstanceRepository } from "../../../lib/repository/InstanceRepository";
import { cookies } from 'next/headers'
import { AuthenticationService } from "@/app/api/lib/service/AuthenticationService";

export async function GET(): Promise<NextResponse<InstanceAdminInfoResponse>> {
    const adminStatus = InstanceRepository.getInstanceAdminStatus();
    const cookieStore = cookies();

    const accessToken = cookieStore.get('accessToken')?.value
    const isAuthenticated = accessToken && AuthenticationService.isTokenValid(accessToken, 'access_token');

    return NextResponse.json({
        adminStatus: adminStatus,
        isAuthenticated: isAuthenticated
    } as InstanceAdminInfoResponse);
}