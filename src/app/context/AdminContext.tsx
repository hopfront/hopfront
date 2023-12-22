'use client'

import { createContext, useEffect, useState } from "react";
import useAdminInfo from "../hooks/useAdminInfo";
import { InstanceAdminStatus } from "../lib/dto/InstanceAdminStatus";

interface AdminContext {
    adminStatus?: InstanceAdminStatus
    isAuthenticated?: boolean,
    isLoading: boolean
}

interface AdminContextProviderProps {
    children: React.ReactNode
}

export const AdminContext = createContext({ isLoading: true } as AdminContext);

export const shouldShowAdminContent = (adminContext: AdminContext): boolean => {
    return adminContext.adminStatus?.isEnabled === false ||
        (adminContext.adminStatus?.isEnabled === true && adminContext.isAuthenticated === true);
}

export const AdminContextProvider = ({ children }: AdminContextProviderProps) => {
    const { data, isLoading: isAdminInfoLoading, error } = useAdminInfo();

    const [adminInfo, setAdminInfo] = useState<AdminContext>({ isLoading: true })

    useEffect(() => {
        if (data) {
            setAdminInfo({ adminStatus: data.adminStatus, isAuthenticated: data.isAuthenticated, isLoading: false })
        } else if (error) {
            setAdminInfo({ isLoading: false })
        } else if (isAdminInfoLoading) {
            setAdminInfo({ isLoading: true })
        }
    }, [data])

    return (
        <AdminContext.Provider value={adminInfo}>
            {children}
        </AdminContext.Provider>
    )
};