import { NextResponse } from "next/server";
import { DashboardCreationPayload } from "@/app/lib/dto/DashboardCreationPayload";
import { DashboardRepository } from "@/app/api/lib/repository/DashboardRepository";
import { Problem } from "@/app/lib/dto/Problem";
import { Dashboard } from "@/app/lib/model/dashboard/Dashboard";
import { DashboardList } from "@/app/lib/dto/DashboardList";
import { InstanceRepository } from "../lib/repository/InstanceRepository";
import { cookies } from "next/headers";

export async function POST(request: Request): Promise<NextResponse<Dashboard | Problem>> {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return new NextResponse(null, { status: 403 })
    }

    const body: DashboardCreationPayload = await request.json()
    const createdDashboard = DashboardRepository.createDashboard(body.title);
    return NextResponse.json(createdDashboard);
}

export async function GET(): Promise<NextResponse<DashboardList | Problem>> {
    return NextResponse.json({
        dashboards: DashboardRepository.listDashboards()
    });
}