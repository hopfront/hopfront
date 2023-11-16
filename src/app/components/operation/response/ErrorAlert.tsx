import { Problem } from "@/app/lib/dto/Problem";
import {SxProps} from "@mui/joy/styles/types";
import React from "react";
import {AuthenticationContext, ProblemAlert} from "@/app/components/alert/ProblemAlert";

export interface ErrorAlertProps {
    error: any | undefined,
    authenticationContext?: AuthenticationContext
    onClose?: () => void
    sx?: SxProps
}

export const ErrorAlert = ({ error, authenticationContext, onClose, sx }: ErrorAlertProps) => {
    if (!error) {
        return null;
    }

    if (error.hasOwnProperty('title') && error.hasOwnProperty('status')) {
        return <ProblemAlert problem={error as Problem} authenticationContext={authenticationContext} onClose={onClose} sx={{...sx, mt: 2}}/>;
    } else if (error.hasOwnProperty('message')) {
        return <ProblemAlert onClose={onClose} authenticationContext={authenticationContext} problem={{
            title: error['message'],
            status: 500,
        }}
        sx={{mt: 2}}/>;
    } else {
        return <ProblemAlert onClose={onClose} authenticationContext={authenticationContext} problem={{
            title: '',
            detail: JSON.stringify(error),
            status: -1
        }}
        sx={{...sx, mt: 2}}/>;
    }
}