import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { InstanceSetup } from "@/app/lib/model/InstanceProperties";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const setup: InstanceSetup = await req.json()
    InstanceRepository.addInstancePropertySetup(setup);
    return NextResponse.json({});
}