'use client'

import { InfoAlert } from "@/app/components/alert/InfoAlert";
import { Box, Link, Typography } from "@mui/joy";
import CORSSwitch from "./CorsSwitch";
import {WarningAlert} from "@/app/components/alert/WarningAlert";

interface CorsSettingsProps {
    specId: string,
    onSwitch?: (isChecked: boolean) => void
}

export default function CorsSettings({ specId, onSwitch }: CorsSettingsProps) {
    return (
        <>
            <WarningAlert title={<Typography>You may encounter <Link underline='none' href="https://developer.mozilla.org/docs/Web/HTTP/CORS" target="_blank" rel="noreferrer">CORS</Link> errors when trying to reach your API when it has not been configured to explicitly trust HopFront.</Typography>}>
                <Typography level='body-sm'>
                    We recommend to configure your API to allow HopFront to query it, but if you&apos;d rather not modify your backend configuration, you can enable this option to route traffic through this HopFront instance&apos;s backend and bypass CORS issues. <br />
                </Typography>

                <Box sx={{mt: 1}}><CORSSwitch apiSpecId={specId} onSwitch={onSwitch}/></Box>
            </WarningAlert>
        </>
    )
}