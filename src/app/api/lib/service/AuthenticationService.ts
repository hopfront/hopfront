import { AdminAuthToken } from '@/app/lib/model/AdminAuthToken';
import { sign, verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { TokenType } from '../utils/utils';

const generateAccessToken = (): AdminAuthToken => {
    const accessToken = sign({}, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' })

    return { accessToken }
}
export class AuthenticationService {
    public static isTokenValid = (token: string): boolean => {
        if (!token) {
            return false;
        }

        try {
            const secretKey = process.env.ACCESS_TOKEN_SECRET as string;
            verify(token, secretKey); // both checks integrity and expiration
            return true;
        } catch (e) {
            console.log('token is not valid', e);
            return false
        }
    }

    // Set HttpOnly cookies for accessToken. 
    // HttpOnly cookies are created, accessible and revokable only by backend.
    public static addCookieTokensToResponse(response: NextResponse): NextResponse {
        const tokens = generateAccessToken();

        response.cookies.set('accessToken', tokens.accessToken,
            {
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: 60 * 60 * 7, // 7h
                sameSite: 'strict'
            }
        );

        return response;
    }
}