import {Dangerous, KeyOff, Warning} from "@mui/icons-material";
import Alert from "@mui/joy/Alert";
import React from "react";
import IconButton from "@mui/joy/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ShowMore from "@/app/components/typography/ShowMore";
import Typography from "@mui/joy/Typography";
import {Problem} from "@/app/lib/dto/Problem";
import {SxProps} from "@mui/joy/styles/types";

const is4xx = (status: number) => {
    return status >= 400 && status < 500;
}

const getIcon = (status: number) => {
    if (status === 401) {
        return <KeyOff/>;
    } else if (is4xx(status)) {
        return <Warning/>;
    } else {
        return <Dangerous/>;
    }
};

const getColor = (status: number) => {
    if (is4xx(status)) {
        return "warning";
    } else {
        return "danger";
    }
};

export interface HttpResponseAlertProps {
    problem: Problem
    onClose?: () => void
    sx?: SxProps
}

export const ProblemAlert = ({problem, onClose, sx}: HttpResponseAlertProps) => {
    return (
        <Alert
            sx={{
                ...sx,
                mt: 1,
                alignItems: 'flex-start'
            }}
            startDecorator={getIcon(problem.status)}
            variant="soft"
            color="warning"
            endDecorator={onClose
                ?
                <IconButton variant="soft" size="sm" color={getColor(problem.status)} onClick={() => onClose()}>
                    <CloseRoundedIcon/>
                </IconButton>
                : undefined
            }>
            <div>
                <div><ShowMore sx={{opacity: 0.8}} text={problem.title} level="body-sm"/></div>
                {problem.detail && <Typography level="body-sm" color="warning">
                    <ShowMore sx={{opacity: 0.8}} text={problem.detail} level="body-sm"/>
                </Typography>}
            </div>
        </Alert>
    );
}