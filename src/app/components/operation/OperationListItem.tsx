import { OperationLabel } from "@/app/components/typography/OperationLabel";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { PushPin } from "@mui/icons-material";
import { Box, ListItem, ListItemButton, ListItemContent, Stack, Typography } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import { useState } from "react";

export interface OperationListItemProps {
    operation: StandaloneOperation
    selected: boolean
    pinned: boolean
    displayApiSpec: boolean
    onClick: () => void
    onPin: () => void
}

export const OperationListItem = ({ operation, selected, pinned, displayApiSpec, onClick, onPin }: OperationListItemProps) => {
    const [showPin, setShowPin] = useState(pinned);

    return (
        <ListItem
            endAction={showPin || pinned ? <IconButton size="sm" onClick={onPin} title={pinned ? "Unpin" : "Pin"}><PushPin /></IconButton> : undefined}
            onMouseEnter={() => setShowPin(true)}
            onMouseLeave={() => setShowPin(false)}
        sx={{ml: 3, mr: 3}}>
            <ListItemButton
                selected={selected}
                onClick={onClick}>
                <ListItemContent>
                    <Box display='flex' flexDirection='row' alignItems='baseline' gap={2}>
                        {operation.operation.summary
                            ? <>
                                <Typography noWrap>{operation.operation.summary}</Typography>
                                <OperationLabel operation={operation} mode="technical" level="body-xs" />
                            </>
                            :
                            <OperationLabel operation={operation} mode="human" alignPaths={true} />}
                        {displayApiSpec &&
                            <Typography noWrap level="body-xs" sx={{ ml: 2 }}>
                                {operation.apiSpec.document.info.title || 'Untitled API'}
                            </Typography>}
                    </Box>
                </ListItemContent>
            </ListItemButton>
        </ListItem>
    );
}