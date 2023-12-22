
import { AuthenticationService } from "@/app/api/lib/service/AuthenticationService";
import { InstanceAdminInfoResponse } from "@/app/lib/dto/admin/InstanceAdminInfoResponse";
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";
import { InstanceRepository } from "../../../lib/repository/InstanceRepository";

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