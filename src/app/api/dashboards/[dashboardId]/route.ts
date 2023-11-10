import {NextResponse} from "next/server";
import {DashboardRepository} from "@/app/api/lib/repository/DashboardRepository";
import {Problem} from "@/app/lib/dto/Problem";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import {problemResponse} from "@/app/api/lib/utils/utils";

function parseDashboardId(request: Request) {
    return request.url.split('/')[5];
}

export async function GET(request: Request): Promise<NextResponse<Dashboard | Problem>> {
    const dashboardId = parseDashboardId(request);
    const dashboard = DashboardRepository.getDashboard(dashboardId);

    if (!dashboard) {
        return problemResponse({
            title: 'Dashboard not found',
            detail: `Dashboard with id=${dashboardId} does not exist.`,
            status: 404,
        })
    }

    return NextResponse.json(dashboard);
}

export async function PUT(request: Request) {
    const dashboardId = parseDashboardId(request);
    const body: Dashboard = await request.json()
    DashboardRepository.saveDashboard(dashboardId, body);
    return NextResponse.json({});
}

export async function DELETE(request: Request) {
    const dashboardId = parseDashboardId(request);
    DashboardRepository.deleteDashboard(dashboardId);
    return NextResponse.json({});
}