import {Snackbar} from "@mui/joy";
import {useState} from "react";
import * as React from "react";
import {Check, Error, Warning} from "@mui/icons-material";

export enum EventType {
    Success= 'success',
    Warning = 'warning',
    Error = 'danger'
}

export const useSnackbar = () => {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<EventType | undefined>();
    const [message, setMessage] = useState<string | undefined>();

    const show = (type: EventType, message: string) => {
        setType(type);
        setMessage(message);
        setOpen(true);
    };

    const getStartDecorator = (): React.ReactNode => {
        switch (type) {
            case EventType.Success: return <Check/>;
            case EventType.Warning: return <Warning/>;
            case EventType.Error: return <Error/>;
            default: return undefined;
        }
    }

    const snackbar = (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={open}
                autoHideDuration={3000}
                color={type}
                startDecorator={getStartDecorator()}
                onClose={() => setOpen(false)}
            >
                {message}
            </Snackbar>
        </>
    );

    return {
        showSnackbar: show,
        Snackbar: snackbar
    };
}