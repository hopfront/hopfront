export interface OAuthProvider {
    id: string
    alias: string
    clientId: string // 'hopfront-mbo-desktop'
    authorizationEndpoint: string // 'http://localhost:8080/realms/hopfront-mbo-local/protocol/openid-connect/auth',
    tokenEndpoint: string // 'http://localhost:8080/realms/hopfront-mbo-local/protocol/openid-connect/token',
    scope: string // 'email profile'
}