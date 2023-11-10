import { mutateApiContext } from "@/app/lib/api/utils";
import { ApiConfig } from "../dto/ApiConfig";

export class ApiConfigApi {
    public static async saveApiConfig(apiSpecId: string, config: ApiConfig): Promise<Response> {
        await fetch(`/api/api-specs/${apiSpecId}/config`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config),
        });
        return await mutateApiContext(apiSpecId);
    }
}