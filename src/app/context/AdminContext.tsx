'use client'

import { createContext, useEffect, useState } from "react";
import { InstanceAdminStatus } from "../lib/dto/InstanceAdminStatus";
import useAdminStatus from "../hooks/useAdminStatus";

interface AdminContext {
    adminStatus?: InstanceAdminStatus
    isTokenExpired?: boolean
}

interface AdminContextProviderProps {
    children: React.ReactNode
}

export const AdminContext = createContext({} as AdminContext);

export const AdminContextProvider = ({ children }: AdminContextProviderProps) => {
    const { data, isLoading, error } = useAdminStatus();
    const [isTokenExpired, setIsTokenExpired] = useState<boolean | undefined>(undefined);
    const [adminStatus, setAdminStatus] = useState<InstanceAdminStatus | undefined>();

    useEffect(() => {
        if (data) {
            setAdminStatus(data);
        }
    }, [data])
    
    return (
        <AdminContext.Provider value={{ adminStatus, isTokenExpired }}>
            {children}
        </AdminContext.Provider>
    )
};