import CORSSwitch from "@/app/api-specs/[apiSpecId]/settings/components/CorsSwitch";
import ShowMore from "@/app/components/typography/ShowMore";
import { Problem } from "@/app/lib/dto/Problem";
import { AuthLocalStorage } from "@/app/lib/localstorage/AuthLocalStorage";
import { ApiAuthenticationStatus } from "@/app/lib/model/ApiAuthenticationStatus";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { AuthService } from "@/app/lib/service/AuthService";
import { Close, Dangerous, Info, KeyOff, Settings, Warning } from "@mui/icons-material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Button, Link } from "@mui/joy";
import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import { SxProps } from "@mui/joy/styles/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WarningAlert } from "./WarningAlert";

const is4xx = (status: number) => {
    return status >= 400 && status < 500;
}

const getIcon = (status: number) => {
    if (status === 401) {
        return <KeyOff />;
    } else if (is4xx(status)) {
        return <Warning />;
    } else {
        return <Dangerous />;
    }
};

const getColor = (status: number) => {
    if (is4xx(status)) {
        return "warning";
    } else {
        return "danger";
    }
};

export interface AuthenticationContext {
    apiSpecId: string
    authenticationStatus: ApiAuthenticationStatus
}

export interface HttpResponseAlertProps {
    problem: Problem
    apiContext?: ApiContext
    onClose?: () => void
    sx?: SxProps
}

export const ProblemAlert = ({ problem, apiContext, onClose, sx }: HttpResponseAlertProps) => {
    const router = useRouter();
    const authStatus = apiContext ? AuthService.getApiAuthenticationStatus(apiContext) : undefined;
    const isCorsByPassed = apiContext?.config?.isCorsByPassed;
    const [doNotShowCorsWarningAgain, setDoNotShowCorsWarningAgain] = useState<boolean | undefined>(
        apiContext ? AuthLocalStorage.getDoNotShowAgainCorsWarning(apiContext.apiSpec.id) : undefined
    );

    const onDoNotShowCorsWarningAgainClicked = () => {
        if (apiContext) {
            AuthLocalStorage.setDoNotShowAgainCorsWarning(apiContext.apiSpec.id, true);
            setDoNotShowCorsWarningAgain(true);
        }
    }

    return (
        <>
            <Alert
                sx={{
                    ...sx,
                    mt: 1,
                    alignItems: 'flex-start'
                }}
                startDecorator={getIcon(problem.status)}
                variant="soft"
                color="warning"
                endDecorator={onClose &&
                    <IconButton variant="soft" size="sm" color={getColor(problem.status)} onClick={() => onClose()}>
                        <CloseRoundedIcon />
                    </IconButton>
                }>
                <Box>
                    <Box>
                        <ShowMore sx={{ opacity: 0.8 }} text={problem.title} level="body-sm" />
                    </Box>
                    {problem.status === 401 && apiContext && authStatus &&
                        (authStatus.isAuthenticationRequired
                            ? <Typography sx={{ mt: 1 }} startDecorator={<Info />}>Refresh the page (in browser) to trigger an authentication.</Typography>
                            : <Button
                                sx={{ mt: 1 }}
                                variant="outlined"
                                startDecorator={<Settings />}
                                onClick={() => router.push(`/api-specs/${apiContext.apiSpec.id}/settings`)}>
                                Configure Authentication</Button>)}
                    {problem.detail && <>
                        <Typography level="body-sm" color="warning">
                            <ShowMore sx={{ opacity: 0.8 }} text={problem.detail} level="body-sm" />
                        </Typography>
                    </>}
                </Box>
            </Alert>
            {(problem.status >= 500) && apiContext && !isCorsByPassed && !doNotShowCorsWarningAgain &&
                <Box sx={{ mt: 1 }}>
                    <WarningAlert
                        title={
                            <Typography>It seems we cannot reached your API</Typography>
                        }
                        headerActionButton={
                            <IconButton size="sm" onClick={onDoNotShowCorsWarningAgainClicked}>
                                <Close />
                            </IconButton>
                        }
                    >
                        <Typography level='body-sm'>
                            Sometimes it can be due to <Link underline='none' href="https://developer.mozilla.org/docs/Web/HTTP/CORS" target="_blank" rel="noreferrer">CORS</Link> errors when trying to reach your API when it has not been configured to explicitly trust HopFront. <br />
                            We recommend to configure your API to allow HopFront to query it, but if you&apos;d rather not modify your backend configuration, you can enable this option to route traffic through this HopFront instance&apos;s backend and bypass CORS issues. <br />
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                            <CORSSwitch apiSpecId={apiContext.apiSpec.id} />
                        </Box>
                    </WarningAlert>
                </Box>}
        </>
    );
}