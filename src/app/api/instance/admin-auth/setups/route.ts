import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";

export async function PUT(req: Request): Promise<Response> {
    const envPassword = InstanceRepository.getAdminPasswordEnvironmentVariable();

    if (envPassword && envPassword.length > 0) {
        return new Response(
            JSON.stringify({ message: 'Cannot change admin password when HOPFRONT_ADMIN_PASSWORD environment variable is set' }),
            { status: 404 }
        );
    }

    const body = await req.json() as InstanceAdminPasswordRequest;
    InstanceRepository.saveInstanceAdminAuth({
        from: 'local',
        password: body.password,
    });

    return new Response(null, { status: 204 });
}