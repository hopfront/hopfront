'use client';

import "allotment/dist/style.css";
import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { OperationListSidebar } from "@/app/browse/components/OperationListSidebar";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { StandaloneOperationWidget } from "@/app/components/operation/StandaloneOperationWidget";
import React, { useState } from "react";
import { Allotment } from "allotment";
import Box from "@mui/joy/Box";
import { useDebouncedCallback } from "use-debounce";

const PANE_SIZES_LOCAL_STORAGE_KEY = 'hopfront:browse:panes:sizes';

interface SerializableSizes {
    sizes: number[]
}

export default function Page() {
    const { usePageView } = useAnalytics();
    const [operation, setOperation] = useState<StandaloneOperation | undefined>();

    const sizesCacheString = localStorage.getItem(PANE_SIZES_LOCAL_STORAGE_KEY);
    const initialSizes = sizesCacheString ? (JSON.parse(sizesCacheString) as SerializableSizes).sizes : [33, 66];
    const [sizes, setSizes] = useState<number[]>(initialSizes);

    usePageView("/browse");

    const onSizesChange = useDebouncedCallback(
        (sizes: number[]) => {
            localStorage.setItem(PANE_SIZES_LOCAL_STORAGE_KEY, JSON.stringify({ sizes: sizes } as SerializableSizes));
            setSizes(sizes);
        },
        500
    );

    const onOperationSelected = (op: StandaloneOperation) => {
        setOperation(op);
    }

    return (
        <>
            <Allotment defaultSizes={sizes} onChange={onSizesChange}>
                <Allotment.Pane minSize={200}>
                    <OperationListSidebar
                        selectedOperation={operation}
                        onOperationSelected={onOperationSelected} />
                </Allotment.Pane>
                <Allotment.Pane snap>
                    <Box sx={{
                        height: '100%'
                    }}>
                        {operation && <StandaloneOperationWidget operation={operation} />}
                    </Box>
                </Allotment.Pane>
            </Allotment>
        </>
    );
}
