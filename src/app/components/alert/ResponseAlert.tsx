import Alert from "@mui/joy/Alert";
import * as React from "react";
import {Check, Dangerous} from "@mui/icons-material";
import Typography from "@mui/joy/Typography";
import {OpenAPIV3} from "openapi-types";
import {OverridableStringUnion} from "@mui/types";
import {ColorPaletteProp} from "@mui/joy/styles/types";
import {AlertPropsColorOverrides} from "@mui/joy/Alert/AlertProps";
import ResponseObject = OpenAPIV3.ResponseObject;

export interface ResponseAlertProps {
    response: Response
    operation: OpenAPIV3.OperationObject
}

const getAlertColor = (response: Response): OverridableStringUnion<ColorPaletteProp, AlertPropsColorOverrides> => {
    if (response.status >= 200 && response.status < 400) {
        return "success";
    } else {
        return "danger";
    }
}

const getIcon = (response: Response): React.JSX.Element => {
    if (response.status >= 200 && response.status < 400) {
        return <Check/>;
    } else {
        return <Dangerous/>
    }
}

const getTitle = (response: Response, operation: OpenAPIV3.OperationObject): string => {
    const responseObject = operation.responses[response.status] as ResponseObject;

    if (responseObject) {
        return responseObject.description;
    } else if (response.statusText) {
        return response.statusText;
    } else {
        return "HTTP " + response.status;
    }
}

export const ResponseAlert = ({response, operation}: ResponseAlertProps) => {
    if (!response) {
        return null;
    }

    let title = getTitle(response, operation);
    let alertColor = getAlertColor(response);
    let icon = getIcon(response);

    return (
        <Alert
            sx={{alignItems: 'flex-start'}}
            startDecorator={React.cloneElement(icon, {
                sx: {mt: '2px', mx: '4px'},
                fontSize: 'xl2',
            })}
            variant="soft"
            color={alertColor}
        >
            {operation && <div>
                <Typography fontWeight="lg" mt={0.25}>
                    {title}
                </Typography>
            </div>}
            {!operation && <div>
                <Typography fontWeight="lg" mt={0.25}>
                    Operation succeeded
                </Typography>
            </div>}
        </Alert>
    );
}