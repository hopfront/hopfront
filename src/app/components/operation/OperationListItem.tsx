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
            sx={{ width: '100%' }}
            startAction={showPin || pinned ? <IconButton size="sm" onClick={onPin} title={pinned ? "Unpin" : "Pin"}><PushPin /></IconButton> : undefined}
            onMouseEnter={() => setShowPin(true)}
            onMouseLeave={() => setShowPin(false)}>
            <ListItemButton
                selected={selected}
                onClick={onClick}
                sx={{
                    width: '100%',
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                }}>
                <ListItemContent sx={{ width: '100%' }}>
                    <Box display='flex' flexDirection='row' alignItems='baseline' overflow='visible' gap={2} width="100%">
                        {operation.operation.summary
                            ? <>
                                <Typography noWrap overflow='visible'>{operation.operation.summary}</Typography>
                                <OperationLabel operation={operation} mode="technical" level="body-xs" />
                            </>
                            :
                            <OperationLabel operation={operation} mode="human" alignPaths={true} />}
                        {displayApiSpec &&
                            <Typography noWrap overflow='visible' level="body-xs" sx={{ ml: 2 }}>
                                {operation.apiSpec.document.info.title}
                            </Typography>}
                    </Box>
                </ListItemContent>
            </ListItemButton>
        </ListItem>
    );
}