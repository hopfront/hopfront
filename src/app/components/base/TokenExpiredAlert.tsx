'use client'

import { InstanceLocalStorage } from "@/app/lib/localstorage/InstanceLocalStorage"
import { Info } from "@mui/icons-material"
import { Alert, Box, Button, Stack, Typography } from "@mui/joy"
import { useState } from "react"
import { AdminAuthenticationModal } from "./sidebar/AdminAuthenticationModal"

export const TokenExpiredAlert = () => {
    const [isDismissed, setIsDismissed] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const onDismissClicked = () => {
        InstanceLocalStorage.setShouldShowAlertOnTokenExpired(false);
        setIsDismissed(true);
    }

    const onLoginClicked = () => {
        setShowLoginModal(true);
    }

    const onLoginSucceeded = () => {
        InstanceLocalStorage.setShouldShowAlertOnTokenExpired(false);
        setShowLoginModal(false);
        setIsDismissed(true);
    }

    return (
        <Box>
            {!isDismissed && <Alert
                sx={{
                    alignItems: 'flex-start',
                    position: 'absolute',
                    right: 24,
                    bottom: 24
                }}
                variant="soft"
                color="primary">
                <Box>
                    <Stack direction={'row'} gap={1} justifyContent={'space-between'} alignItems={'center'}>
                        <Info />
                        <Typography level="title-sm">Your admin session has expired.</Typography>
                        <Button
                            onClick={onLoginClicked}
                            size="sm">
                            Log in
                        </Button>
                        <Button
                            onClick={onDismissClicked}
                            size='sm'
                            variant="outlined">
                            Dismiss
                        </Button>
                    </Stack>
                </Box>
            </Alert>}
            <AdminAuthenticationModal
                open={showLoginModal}
                onClose={() => { setShowLoginModal(false) }}
                onLoginSucceeded={onLoginSucceeded} />
        </Box>
    )
}