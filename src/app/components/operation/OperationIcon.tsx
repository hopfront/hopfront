import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import {Delete, Launch} from "@mui/icons-material";

export interface OperationIconProps {
    operation: StandaloneOperation
}

export const OperationIcon = ({ operation }: OperationIconProps) => {
    switch (operation.method) {
        case "delete":
            return <Delete />;
        default:
            return <Launch />;
    }
}