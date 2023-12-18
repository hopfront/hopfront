
import { InstanceAdminStatus } from "@/app/lib/dto/InstanceAdminStatus";
import { NextResponse } from "next/server";
import { InstanceRepository } from "../../lib/repository/InstanceRepository";

export async function GET(): Promise<NextResponse<InstanceAdminStatus>> {
    return NextResponse.json(InstanceRepository.getInstanceAdminStatus());
}