import { NextResponse } from "next/server";
import {InstanceSetup} from "@/app/lib/model/InstanceProperties";
import {HopFrontPropertiesRepository} from "@/app/api/lib/repository/HopFrontPropertiesRepository";

export async function POST(req: Request) {
    const setup: InstanceSetup = await req.json()
    HopFrontPropertiesRepository.addInstancePropertySetup(setup);
    return NextResponse.json({});
}