import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(): Promise<Response> {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return new NextResponse(null, { status: 403 })
    }
    
    InstanceRepository.saveInstanceAdminAuth({
        from: 'local',
        password: ''
    })

    const response = new NextResponse(null, { status: 204 });

    response.cookies.set('accessToken', '',
        {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 0, // remove token validity
            sameSite: 'strict'
        }
    )

    return response;
}