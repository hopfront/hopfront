'use client'

import { SuccessAlert } from "@/app/components/alert/SuccessAlert"
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal"
import { Button, Stack, Typography } from "@mui/joy"
import { useRouter } from "next/navigation"

interface UpdateSucceededModalProps {
    open: boolean
    onClose: () => void
}

export const UpdateSucceededModal = ({ open, onClose }: UpdateSucceededModalProps) => {
    const router = useRouter();

    return (
        <ResponsiveModal
            open={open}
            onClose={onClose}>
            <Stack direction={'column'} gap={1} alignItems={'center'}>
                <SuccessAlert title="Your API was successfully updated" />
                <Button onClick={() => { router.push('/browse'); onClose() }}>
                    Go to Browse
                </Button>
            </Stack>

        </ResponsiveModal>
    )
}