import { ApiAuthenticationConfig } from "./ApiAuthenticationConfig"

export interface ApiConfig {
    authenticationConfig?: ApiAuthenticationConfig | undefined
    isCorsByPassed?: boolean
}