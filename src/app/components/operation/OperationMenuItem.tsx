import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { getOperationButtonColor } from "@/app/lib/openapi/utils";
import { OperationIcon } from "@/app/components/operation/OperationIcon";
import { MenuItem } from "@mui/joy";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import React from "react";
import {OperationLabel} from "@/app/components/typography/OperationLabel";
import {OverridableStringUnion} from "@mui/types";
import {VariantProp} from "@mui/joy/styles/types";
import {ListItemButtonPropsVariantOverrides} from "@mui/joy/ListItemButton/ListItemButtonProps";

const getOperationButtonVariant = (operation: StandaloneOperation): OverridableStringUnion<VariantProp, ListItemButtonPropsVariantOverrides> => {
    switch (operation.method) {
        case "delete":
            return "soft";
        default:
            return "plain";
    }
}


export interface OperationMenuItemProps {
    operation: StandaloneOperation
    onClick: (event: React.MouseEvent<HTMLDivElement>, operation: StandaloneOperation) => void
}

export const OperationMenuItem = ({ operation, onClick }: OperationMenuItemProps) => {
    return (
        <React.Fragment>
            <MenuItem
                onClick={(event) => { onClick(event, operation) }}
                variant={getOperationButtonVariant(operation)}
                color={getOperationButtonColor(operation)}>
                <ListItemDecorator sx={{ color: 'inherit' }}>{<OperationIcon operation={operation} />}</ListItemDecorator>{' '}
                <OperationLabel operation={operation} mode="human" />
            </MenuItem>
        </React.Fragment>
    );
}