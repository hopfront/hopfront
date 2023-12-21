'use client'

import { createContext, useEffect, useState } from "react";
import useAdminInfo from "../hooks/useAdminInfo";
import { InstanceAdminStatus } from "../lib/dto/InstanceAdminStatus";

interface AdminContext {
    adminStatus?: InstanceAdminStatus
    isAuthenticated?: boolean
}

interface AdminContextProviderProps {
    children: React.ReactNode
}

export const AdminContext = createContext({} as AdminContext);

export const AdminContextProvider = ({ children }: AdminContextProviderProps) => {
    const { data, isLoading, error } = useAdminInfo();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
    const [adminStatus, setAdminStatus] = useState<InstanceAdminStatus | undefined>();

    useEffect(() => {
        if (data) {
            setAdminStatus(data.adminStatus);
            setIsAuthenticated(data.isAuthenticated)
        }
    }, [data])

    return (
        <AdminContext.Provider value={{ adminStatus, isAuthenticated }}>
            {children}
        </AdminContext.Provider>
    )
};