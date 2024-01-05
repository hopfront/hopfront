'use client'

import { Box, Button, Typography } from "@mui/joy";
import Image from "next/image";
import { useContext, useState } from "react";
import { AdminAuthentication } from "../components/base/sidebar/AdminAuthentication";
import { AdminContext } from "../context/AdminContext";
import StartBuildingSvg from '../onboarding/assets/start_building.svg';

export interface WelcomeOnboardingStepProps {
    visibility: boolean
    onNextClicked: () => void
}

export default function WelcomeOnboardingStep(
    {
        visibility: isVisible,
        onNextClicked
    }: WelcomeOnboardingStepProps
) {
    const adminContext = useContext(AdminContext);
    const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

    const checkAdminStatus = () => {
        if (adminContext.adminStatus?.isEnabled === true && !adminContext.isAuthenticated) {
            setShowAdminLoginModal(true);
        } else {
            onNextClicked();
        }
    }

    return (
        <>
            {isVisible && <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Box sx={{
                    width: '100%',
                    height: '45vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <Image src={StartBuildingSvg} alt='Welcome image' layout='fill' objectFit="contain" />
                </Box>
                <Typography level='h3' sx={{ mt: 4 }}>Welcome to HopFront</Typography>
                <Typography level='body-lg' fontWeight={600} sx={{ mt: 1 }}>Your instance is ready to be
                    configured</Typography>
                <Button sx={{ mt: 4 }} size="lg" onClick={checkAdminStatus}>Let&apos;s get started!</Button>
                <AdminAuthentication
                    open={showAdminLoginModal}
                    onClose={() => setShowAdminLoginModal(false)}
                    onLoginSucceeded={() => onNextClicked()}
                />
            </Box>}
        </>
    )
}