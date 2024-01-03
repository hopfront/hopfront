import { InfoAlert } from "@/app/components/alert/InfoAlert"
import { ProblemAlert } from "@/app/components/alert/ProblemAlert"
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal"
import { mutateAdminInfo } from "@/app/hooks/useAdminInfo"
import { InstanceApi } from "@/app/lib/api/InstanceApi"
import { extractErrorMessage } from "@/app/lib/api/utils"
import { Problem } from "@/app/lib/dto/Problem"
import { Button, FormControl, FormLabel, Input, Link, Typography } from "@mui/joy"
import { ChangeEvent, useState } from "react"

interface UpdateAdminPasswordModalProps {
    open: boolean
    onClose: () => void
}

export const UpdateAdminPasswordModal = ({ open, onClose }: UpdateAdminPasswordModalProps) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [updatePasswordError, setUpdatePasswordError] = useState<Problem | undefined>();
    const [isUpdateOngoing, setIsUpdateOngoing] = useState(false);

    const updatePassword = (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsUpdateOngoing(true);
        setUpdatePasswordError(undefined);

        if (!(oldPassword.trim().length > 0) || !(newPassword.trim().length > 0)) {
            setUpdatePasswordError({
                title: 'Passwords must not be emptied or blank',
                status: -1
            })
            return;
        };

        InstanceApi.updateAdminPassword({ oldPassword: oldPassword, newPassword: newPassword })
            .then(async (response) => {
                if (response.ok) {
                    mutateAdminInfo();
                    onClose();
                } else {
                    setUpdatePasswordError({
                        title: 'We couldn\'t update your password',
                        status: response.status,
                        detail: await extractErrorMessage(response)
                    })
                }
            })
            .catch((e) => {
                setUpdatePasswordError({
                    title: 'An unknown error has occurred',
                    status: -1,
                    detail: e?.message
                })
            })
            .finally(() => {
                setIsUpdateOngoing(false);
            })
    }

    return (
        <ResponsiveModal open={open} onClose={onClose}>
            <Typography level="h3">Update password</Typography>
            <form style={{ marginTop: '16px' }} onSubmit={updatePassword}>
                <FormControl>
                    <FormLabel>
                        Old password
                    </FormLabel>
                    <Input
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        type="password"
                        required
                        placeholder="Old password" />
                    <FormLabel sx={{ mt: 2 }}>
                        New password
                    </FormLabel>
                    <Input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                        required
                        placeholder="New password" />
                </FormControl>
                <Button
                    type="submit"
                    loading={isUpdateOngoing}
                    disabled={isUpdateOngoing}
                    sx={{ mt: 2 }}>
                    Update password
                </Button>
            </form>
            {updatePasswordError &&
                <ProblemAlert problem={updatePasswordError} onClose={() => setUpdatePasswordError(undefined)} />}
        </ResponsiveModal>
    )
}