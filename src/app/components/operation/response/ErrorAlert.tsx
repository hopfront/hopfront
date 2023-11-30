import { ProblemAlert } from "@/app/components/alert/ProblemAlert";
import { Problem } from "@/app/lib/dto/Problem";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { SxProps } from "@mui/joy/styles/types";

export interface ErrorAlertProps {
    error: any | undefined,
    apiContext?: ApiContext
    onClose?: () => void
    sx?: SxProps
}

export const ErrorAlert = ({ error, apiContext, onClose, sx }: ErrorAlertProps) => {
    if (!error) {
        return null;
    }

    if (error.hasOwnProperty('title') && error.hasOwnProperty('status')) {
        return <ProblemAlert problem={error as Problem} apiContext={apiContext} onClose={onClose} sx={{...sx, mt: 2}}/>;
    } else if (error.hasOwnProperty('message')) {
        return <ProblemAlert onClose={onClose} apiContext={apiContext} problem={{
            title: error['message'],
            status: 500,
        }}
        sx={{mt: 2}}/>;
    } else {
        return <ProblemAlert onClose={onClose} apiContext={apiContext} problem={{
            title: '',
            detail: JSON.stringify(error),
            status: -1
        }}
        sx={{...sx, mt: 2}}/>;
    }
}