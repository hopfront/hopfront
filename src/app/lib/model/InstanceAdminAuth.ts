interface InstanceAdminAuth {
    from: InstanceAdminAuthOrigin
    password: string
}

type InstanceAdminAuthOrigin = 'env' | 'local'