import { AdminAuthResponse } from '@/app/lib/dto/AdminAuthResponse';
import { sign, verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { TokenType } from '../utils/utils';

export class AuthenticationService {
    public static isTokenValid = (token: string, type: TokenType): boolean => {
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

    // Set HttpOnly cookies for accessToken and refreshToken. 
    // HttpOnly cookies are created, accessible and revokable only by backend.
    public static addCookieTokensToResponse(response: NextResponse): NextResponse {
        const tokens = this.generateTokens();

        response.cookies.set('accessToken', tokens.accessToken,
            {
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: 60 * 15, // 15m
                sameSite: 'strict'
            }
        );
        response.cookies.set('refreshToken', tokens.refreshToken,
            {
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: 60 * 60 * 24, // 24h
                sameSite: 'strict'
            });

        return response;
    }

    public static generateTokens = (): AdminAuthResponse => {
        const accessToken = sign({}, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' })
        const refreshToken = sign({}, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '24h' })

        return { accessToken, refreshToken }
    }
}