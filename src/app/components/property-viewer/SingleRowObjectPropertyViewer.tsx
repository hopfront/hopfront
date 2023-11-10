import Chip from "@mui/joy/Chip";
import React, {ReactNode} from "react";
import {ObjectLabel} from "@/app/components/typography/ObjectLabel";
import Typography from "@mui/joy/Typography";
import {Skeleton} from "@mui/joy";

export interface SingleRowObjectPropertyViewerProps {
    property: any
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
    loading?: boolean
    startDecorator?: ReactNode
}

export const SingleRowObjectPropertyViewer = ({
                                                  property,
                                                  onClick,
                                                  loading,
                                                  startDecorator
                                              }: SingleRowObjectPropertyViewerProps) => {

    if (property === null) {
        return <Typography fontFamily="monospace"><Skeleton loading={loading}>-</Skeleton></Typography>
    } else if (property === undefined) {
        return null;
    } else {
        return (
            <Chip
                disabled={loading}
                variant="outlined"
                size="md"
                onClick={(event) => {
                    onClick(event)
                }} startDecorator={startDecorator}>
                <ObjectLabel object={property} loading={loading}/>
            </Chip>
        );
    }
}