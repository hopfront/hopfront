import { NextResponse } from "next/server";
import {InstanceProperties} from "@/app/lib/model/InstanceProperties";
import {HopFrontPropertiesRepository} from "@/app/api/lib/repository/HopFrontPropertiesRepository";

export async function GET(request: Request): Promise<NextResponse<InstanceProperties>> {
    if (request.url) {
        // Using the "request: Request" param is a way to disable NextJS cache, even though it's not useful here.
        // NextJS chose to cache this query because it's a GET that doesn't use any input.
    }

    return NextResponse.json(HopFrontPropertiesRepository.getInstanceProperties());
}