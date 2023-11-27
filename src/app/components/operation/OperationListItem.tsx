import { OperationLabel } from "@/app/components/typography/OperationLabel";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { PushPin } from "@mui/icons-material";
import { Box, ListItem, ListItemButton, ListItemContent, Tooltip, Typography } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import { useEffect, useRef, useState } from "react";

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
    const itemLabelRef = useRef<HTMLDivElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            const current = itemLabelRef.current;
            if (current) {
                console.log(operation.path, current.offsetWidth, current.scrollWidth)
                const isOverflowing = current.offsetWidth < current.scrollWidth;
                setShowTooltip(isOverflowing);
            }
        }

        checkOverflow();
    }, [])

    const getItemLabelComponent = () => {
        return (
            <>
                {operation.operation.summary && !onlyDisplayTechnicalNames
                    ?
                    <Typography component='span' noWrap>{operation.operation.summary}</Typography>
                    :
                    <OperationLabel operation={operation} mode="technical" alignPaths={true} />}
                {displayApiSpec &&
                    <Typography component='span' noWrap level="body-xs" sx={{ ml: 1 }}>
                        {operation.apiSpec.document.info.title || 'Untitled API'}
                    </Typography>}
            </>
        )
    }

    return (
        <ListItem
            endAction={(showPin || pinned) &&
                <IconButton size="sm" onClick={onPin} title={pinned ? "Unpin" : "Pin"}>
                    <PushPin />
                </IconButton>}
            onMouseEnter={() => setShowPin(true)}
            onMouseLeave={() => setShowPin(false)}
            sx={{ px: 2 }}>
            <ListItemButton
                selected={selected}
                onClick={onClick}>
                <ListItemContent>
                    <Tooltip
                        describeChild
                        disableFocusListener={!showTooltip}
                        disableHoverListener={!showTooltip}
                        enterDelay={500}
                        title={getItemLabelComponent()}
                        variant='outlined'>
                        <Typography
                            ref={itemLabelRef}
                            overflow='hidden'
                            textOverflow='ellipsis'>
                            {getItemLabelComponent()}
                        </Typography>
                    </Tooltip>
                </ListItemContent>
            </ListItemButton>
        </ListItem>
    );
}