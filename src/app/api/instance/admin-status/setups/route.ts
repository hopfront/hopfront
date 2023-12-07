import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { InstanceAdminStatus } from "@/app/lib/model/InstanceAdminStatus";

export async function PUT(req: Request): Promise<Response> {
    const envPassword = InstanceRepository.getAdminPasswordEnvironmentVariable();

    if (envPassword && envPassword.length > 0) {
        throw new Error(`Cannot change admin password when environment variable ${envPassword} is set`);
    }

    const body = await req.json() as InstanceAdminStatus;
    InstanceRepository.saveInstanceAdminStatus(body);

    return new Response(null, { status: 204 });
}