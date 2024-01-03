export interface InstanceAdminAuth {
    from: InstanceAdminAuthOrigin
    hash: string
}

export type InstanceAdminAuthOrigin = 'env' | 'local'