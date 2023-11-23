import { Box, Button, Input, List, ListItem, ListItemButton } from "@mui/joy";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getStandaloneOperations } from "@/app/lib/openapi/utils";
import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { SxProps } from "@mui/joy/styles/types";
import { OperationLabel } from "@/app/components/typography/OperationLabel";
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { Search, UnfoldMore } from "@mui/icons-material";

export interface OperationSelectProps {
    defaultOperationId?: string
    onOperationSelected: (operation: StandaloneOperation | undefined) => void
    apiSpec: ApiSpec
    onComponentLoaded?: (component: StandaloneOperation) => void
    disabled?: boolean
    sx?: SxProps
}

export const OperationSelect = ({ defaultOperationId, onOperationSelected, onComponentLoaded, apiSpec, disabled = false, sx }: OperationSelectProps) => {
    const [operationId, setOperationId] = useState<string | undefined>(defaultOperationId);
    const [open, setOpen] = useState(false);
    const [searchInput, setSearchInput] = useState<string | undefined>();

    const standaloneOperations = useMemo(() => {
        return getStandaloneOperations(apiSpec)
            .sort((a, b) => {
                if (a.path === b.path) {
                    return a.method.localeCompare(b.method);
                } else {
                    return a.path.localeCompare(b.path);
                }
            });
    }, [apiSpec.id]);

    const selectedOperation = standaloneOperations.find(op => op.getOperationId() === operationId) ?? standaloneOperations[0];

    if (!operationId && standaloneOperations.length > 0) {
        const firstOperation = standaloneOperations[0];
        setOperationId(firstOperation.getOperationId());
        onOperationSelected(firstOperation);
    }

    onComponentLoaded?.(selectedOperation);

    return (
        <Box sx={sx}>
            <Button
                disabled={disabled}
                variant="outlined"
                color="neutral"
                onClick={() => setOpen(true)}
                endDecorator={<UnfoldMore />}>
                {selectedOperation
                    ? <OperationLabel operation={selectedOperation} mode="technical" alignPaths={false} />
                    : 'Select an operation...'
                }
            </Button>
            <ResponsiveModal open={open} onClose={() => setOpen(false)}>
                <Input
                    autoFocus
                    value={searchInput}
                    onChange={event => setSearchInput(event.currentTarget.value)}
                    type="text"
                    endDecorator={<Search />}
                    placeholder="Search an operation..." />
                <List>
                    {standaloneOperations
                        .filter(op => {
                            return !searchInput ||
                                op.path.toLowerCase().indexOf(searchInput.toLowerCase()) > -1 ||
                                op.operation.summary && op.operation.summary.toLowerCase().indexOf(searchInput.toLowerCase()) > -1;
                        })
                        .map(op => (
                            <ListItem key={op.getOperationId()}>
                                <ListItemButton onClick={() => {
                                    setOperationId(op.getOperationId());
                                    setOpen(false);
                                    onOperationSelected(op);
                                }}>
                                    <OperationLabel operation={op} mode="technical" alignPaths={true} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>
            </ResponsiveModal>
        </Box>
    );
}