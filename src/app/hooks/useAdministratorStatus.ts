import useSWR, { mutate } from "swr";
import { InstanceAdminStatus } from "../lib/model/InstanceAdminStatus";
import { fetcher } from "../lib/api/utils";

export const mutateAdministratorStatus = () => {
    return mutate(`/api/instance/admin-status`);
}

export default function useAdministratorStatus() {
    return useSWR<InstanceAdminStatus>('/api/instance/admin-status', fetcher);
}