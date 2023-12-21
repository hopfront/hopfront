import { Problem } from "@/app/lib/dto/Problem";
import { verify } from 'jsonwebtoken';
import { NextResponse } from "next/server";

export type TokenType = 'access_token' | 'refresh_token'

export const problemResponse = (problem: Problem): NextResponse<Problem> => {
    return NextResponse.json(problem, {
        status: problem.status
    })
}

export const isTokenValid = (token: string, type: TokenType): boolean => {
    if (!token) {
        return false;
    }

    try {
        const secretKey = (type === 'access_token' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET) as string;
        verify(token, secretKey); // both checks integrity and expiration
        return true;
    } catch (e) {
        console.log('token is not valid', e);
        return false
    }
}