import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { NextResponse } from "next/server";

export async function POST(): Promise<Response> {
    InstanceRepository.saveInstanceAdminAuth({
        from: 'local',
        password: ''
    })
    
    const response = new NextResponse(null, { status: 200 });

    response.cookies.set('accessToken', '',
        {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 0, // remove token validity
            sameSite: 'strict'
        }
    )
    response.cookies.set('refreshToken', '',
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