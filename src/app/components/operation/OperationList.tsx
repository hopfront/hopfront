import { OperationListItem } from "@/app/components/operation/OperationListItem";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { uniqueFilter } from "@/app/lib/openapi/utils";
import { Box, List, ListDivider } from "@mui/joy";
import { Fragment, useEffect, useMemo, useState } from "react";

const SELECTED_OPERATION_LOCAL_STORAGE_KEY = 'hopfront:browse:selected-operation';
const PINNED_OPERATIONS_LOCAL_STORAGE_KEY = 'hopfront:browse:pinned-operations';

const operationSorter = (a: StandaloneOperation, b: StandaloneOperation) => a.path.localeCompare(b.path);

interface SerializableOperation {
    apiSpecId: string
    operationId: string
}

const getPinnedOperations = (allOperations: StandaloneOperation[]): StandaloneOperation[] => {
    const pinnedOperationsString = localStorage.getItem(PINNED_OPERATIONS_LOCAL_STORAGE_KEY);

    if (!pinnedOperationsString) {
        return [];
    }

    const pinnedSerializedOperations = JSON.parse(pinnedOperationsString) as PinnedOperations;

    return pinnedSerializedOperations.operations.flatMap(op => {
        const pinnedListedOperation = allOperations.find(listedOperation => listedOperation.apiSpec.id === op.apiSpecId && listedOperation.getOperationId() === op.operationId);

        if (pinnedListedOperation) {
            return [pinnedListedOperation];
        } else {
            return [];
        }
    })
};

const savePinnedOperations = (operation: StandaloneOperation) => {
    const pinnedOperationsString = localStorage.getItem(PINNED_OPERATIONS_LOCAL_STORAGE_KEY);
    const pinnedSerializedOperations = pinnedOperationsString ? JSON.parse(pinnedOperationsString) as PinnedOperations : { operations: [] } as PinnedOperations;
    const storedSerializableOperations = pinnedSerializedOperations.operations

    if (storedSerializableOperations.find(op => op.operationId === operation.operation.operationId)) { // save unpinned
        const updated = storedSerializableOperations.filter(op => op.operationId !== operation.operation.operationId);
        localStorage.setItem(PINNED_OPERATIONS_LOCAL_STORAGE_KEY, JSON.stringify({
            operations: updated,
        } as PinnedOperations));
    } else { // save pinned
        localStorage.setItem(PINNED_OPERATIONS_LOCAL_STORAGE_KEY, JSON.stringify({
            operations: [...storedSerializableOperations, {
                apiSpecId: operation.apiSpec.id,
                operationId: operation.getOperationId()
            } as SerializableOperation],
        } as PinnedOperations));
    }
}

interface PinnedOperations {
    operations: SerializableOperation[];
}

interface OperationListProps {
    operations: StandaloneOperation[],
    selectedOperation?: StandaloneOperation
    onlyDisplayTechnicalName: boolean
    onOperationSelected: (operation: StandaloneOperation) => void
}

const operationEquals = (other: StandaloneOperation) => {
    return (operation: StandaloneOperation) => operation.apiSpec.id === other.apiSpec.id && operation.getOperationId() === other.getOperationId();
};

const getUnpinnedOperations = (operations: StandaloneOperation[], pinnedOperations: StandaloneOperation[]) => {
    return operations.filter(op => !pinnedOperations.find(operationEquals(op)));
};

export const OperationList = ({ operations, selectedOperation, onlyDisplayTechnicalName: onlyDisplayTechnicalNames, onOperationSelected }: OperationListProps) => {
    const cachedSelectedOperation: SerializableOperation | undefined = useMemo(() => {
        try {
            const cachedSelectedOperationString = localStorage.getItem(SELECTED_OPERATION_LOCAL_STORAGE_KEY);
            return cachedSelectedOperationString ? JSON.parse(cachedSelectedOperationString) as SerializableOperation : undefined;
        } catch (error: any) {
            return undefined;
        }
    }, []);

    const distinctApiSpecIds = operations.map(op => op.apiSpec.id).filter(uniqueFilter);
    const shouldDisplayApiSpec = distinctApiSpecIds.length > 1;

    if (!selectedOperation) {
        if (cachedSelectedOperation) {
            const existingCachedSelectedOperation = operations.find(op => op.apiSpec.id === cachedSelectedOperation.apiSpecId && op.getOperationId() === cachedSelectedOperation.operationId);

            if (existingCachedSelectedOperation) {
                onOperationSelected(existingCachedSelectedOperation);
            }
        } else if (operations.length > 0) {
            onOperationSelected(operations[0]);
        }
    }

    const [pinnedOperations, setPinnedOperations] = useState(getPinnedOperations(operations));
    const [unpinnedOperations, setUnpinnedOperations] = useState(getUnpinnedOperations(operations, pinnedOperations));

    useEffect(() => {
        const newPinnedOperations = getPinnedOperations(operations);
        setPinnedOperations(newPinnedOperations);
        setUnpinnedOperations(getUnpinnedOperations(operations, newPinnedOperations))
    }, [operations]);

    const onOperationClicked = (op: StandaloneOperation) => {
        localStorage.setItem(SELECTED_OPERATION_LOCAL_STORAGE_KEY, JSON.stringify({
            apiSpecId: op.apiSpec.id,
            operationId: op.getOperationId(),
        } as SerializableOperation));

        onOperationSelected(op);
    };

    const onOperationPinned = (op: StandaloneOperation) => {
        if (!pinnedOperations.find(operationEquals(op))) {
            pinnedOperations.push(op);
            setPinnedOperations(pinnedOperations);
            savePinnedOperations(op);
            setUnpinnedOperations(getUnpinnedOperations(operations, pinnedOperations));
        }
    };

    const onOperationUnpinned = (unpinnedOperation: StandaloneOperation) => {
        const updatedPinnedOperations = pinnedOperations
            .flatMap(pinnedOperation => operationEquals(unpinnedOperation)(pinnedOperation) ? [] : [pinnedOperation]);

        setPinnedOperations(updatedPinnedOperations);
        savePinnedOperations(unpinnedOperation);
        setUnpinnedOperations(getUnpinnedOperations(operations, updatedPinnedOperations));
    };

    const buildOperationListItem = (op: StandaloneOperation, pinned: boolean) => {
        return <Fragment key={op.apiSpec.id + op.getOperationId()}>
            <OperationListItem
                operation={op}
                selected={selectedOperation?.getOperationId() === op.getOperationId()}
                pinned={pinned}
                displayApiSpec={shouldDisplayApiSpec}
                onlyDisplayTechnicalNames={onlyDisplayTechnicalNames}
                onClick={() => onOperationClicked(op)}
                onPin={() => pinned ? onOperationUnpinned(op) : onOperationPinned(op)} />
        </Fragment>;
    };

    // total - paddingTop - inputs heights - margins
    // TODO: use global variables
    const height = 'calc(100vh - (var(--operation-list-panel-padding-top)) - 36px - 6px)'

    return <Box
        sx={{
            overflowY: 'auto',
            width: '100%',
            height: height,
        }}>
        <List
            size="sm"
        >
            {pinnedOperations
                .sort(operationSorter)
                .map(op => buildOperationListItem(op, true))}
            {pinnedOperations.length > 0 && <ListDivider />}
            {unpinnedOperations
                .filter(op => !pinnedOperations.find(po => po.apiSpec.id === op.apiSpec.id && po.getOperationId() === op.getOperationId()))
                .sort(operationSorter)
                .map(op => buildOperationListItem(op, false))}
        </List>
    </Box>;
}