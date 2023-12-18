import useSWR, { mutate } from "swr";
import { fetcher } from "../lib/api/utils";
import { InstanceAdminStatus } from "../lib/dto/InstanceAdminStatus";

export const mutateAdminStatus = () => {
    return mutate(`/api/instance/admin-status`);
}

export default function useAdminStatus() {
    return useSWR<InstanceAdminStatus>('/api/instance/admin-status', fetcher);
}