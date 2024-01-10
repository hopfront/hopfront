import { AdminAuthToken } from '@/app/lib/model/AdminAuthToken';
import { sign, verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { InstanceRepository } from '../repository/InstanceRepository';
import * as crypto from 'crypto'

const generateAccessToken = (): AdminAuthToken => {
    const accessToken = sign({}, InstanceRepository.getAccessTokenSecret(), { expiresIn: '7h' })

    return { accessToken }
}
export class AuthenticationService {
    public static isTokenValid = (token: string): boolean => {
        if (!token) {
            return false;
        }

        try {
            const secretKey = InstanceRepository.getAccessTokenSecret();
            verify(token, secretKey); // both checks integrity and expiration
            return true;
        } catch (e) {
            console.log('token is not valid', e);
            return false
        }
    }

    // Set HttpOnly cookies for accessToken. 
    // HttpOnly cookies are created, accessible and revokable only by backend.
    public static addCookieTokenToResponse(response: NextResponse): NextResponse {
        const tokens = generateAccessToken();

        response.cookies.set('accessToken', tokens.accessToken,
            {
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: 60 * 60 * 12, // 12h
                sameSite: 'strict'
            }
        );

        return response;
    }

    public static removeCookieTokenFromResponse(response: NextResponse): NextResponse {
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

    public static generateRandomPrivateKey(): string {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let secret = ''
        const randomBytes = crypto.randomBytes(128);
        randomBytes.forEach((byte) => {
            const index = byte % charset.length;
            secret += charset[index]
        })
        return secret;
    }
}