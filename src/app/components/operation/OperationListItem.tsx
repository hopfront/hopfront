import { OperationLabel } from "@/app/components/typography/OperationLabel";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { PushPin } from "@mui/icons-material";
import { Box, ListItem, ListItemButton, ListItemContent, Typography } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import { useState } from "react";

export interface OperationListItemProps {
    operation: StandaloneOperation
    selected: boolean
    pinned: boolean
    displayApiSpec: boolean
    onlyDisplayTechnicalNames: boolean
    onClick: () => void
    onPin: () => void
}

export const OperationListItem = ({
    operation,
    selected,
    pinned,
    displayApiSpec,
    onlyDisplayTechnicalNames,
    onClick,
    onPin
}: OperationListItemProps) => {
    const [showPin, setShowPin] = useState(pinned);

    return (
        <ListItem
            endAction={showPin || pinned ? <IconButton size="sm" onClick={onPin} title={pinned ? "Unpin" : "Pin"}><PushPin /></IconButton> : undefined}
            onMouseEnter={() => setShowPin(true)}
            onMouseLeave={() => setShowPin(false)}
            sx={{ px: 2 }}>
            <ListItemButton
                selected={selected}
                onClick={onClick}>
                <ListItemContent>
                    <Typography overflow='hidden' textOverflow='ellipsis'>
                        {operation.operation.summary && !onlyDisplayTechnicalNames
                            ?
                            <Typography component='span' noWrap>{operation.operation.summary}</Typography>
                            :
                            <OperationLabel operation={operation} mode="technical" alignPaths={true} />}
                        {displayApiSpec &&
                            <Typography component='span' noWrap level="body-xs" sx={{ ml: 1 }}>
                                {operation.apiSpec.document.info.title || 'Untitled API'}
                            </Typography>}
                    </Typography>
                </ListItemContent>
            </ListItemButton>
        </ListItem>
    );
}