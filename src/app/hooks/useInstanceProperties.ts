import {InstanceProperties} from "@/app/lib/model/InstanceProperties";
import {fetcher} from "@/app/lib/api/utils";
import useSWRImmutable from "swr/immutable";

export const useInstanceProperties = () => {
    return useSWRImmutable<InstanceProperties>('/api/instance/properties', fetcher);
}