import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository"
import { AdminAuthResponse } from "@/app/lib/dto/AdminAuthResponse"
import { sign } from 'jsonwebtoken'
import { NextResponse } from "next/server"

const generateTokens = (): AdminAuthResponse => {
    const accessToken = sign({}, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' })
    const refreshToken = sign({}, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '24h' })

    return { accessToken, refreshToken }
}

export async function POST(req: Request): Promise<Response> {
    const body = await req.json() as InstanceAdminPasswordRequest

    if (InstanceRepository.isAdminPasswordValid(body.password)) {
        return NextResponse.json(generateTokens())
    } else {
        return new Response(JSON.stringify({ message: 'Wrong credentials' }), { status: 403 })
    }
}