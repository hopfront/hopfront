import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {OperationMenuItem} from "@/app/components/operation/OperationMenuItem";
import {MoreVert} from "@mui/icons-material";
import {Dropdown, Menu, MenuButton} from "@mui/joy";
import {useState} from "react";
import {ModalObjectOperationExecutor} from "./ModalObjectOperationExecutor";

export interface ArrayItemActionsMenuProps {
    arrayItemObject: any
    arrayItemSchema: SchemaOrReference
    runnableOperations: StandaloneOperation[]
    onOperationExecuted: (operation: StandaloneOperation) => void
    apiContext: ApiContext
}

export const ArrayItemActionsMenu = ({
                                         arrayItemObject,
                                         arrayItemSchema,
                                         runnableOperations,
                                         onOperationExecuted,
                                         apiContext
                                     }: ArrayItemActionsMenuProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState<StandaloneOperation | undefined>();

    function onMenuItemClicked(event: React.MouseEvent<HTMLDivElement>, operation: StandaloneOperation) {
        event.stopPropagation();
        setModalOpen(true);
        setSelectedOperation(operation);
    }

    return (
        <>
            <Dropdown>
                <MenuButton
                    variant="plain"
                    size="sm"
                    disabled={runnableOperations.length === 0}>
                    <MoreVert/>
                </MenuButton>
                <Menu placement="left-start">
                    {runnableOperations.map(op =>
                        <OperationMenuItem
                            key={op.getOperationId()}
                            operation={op}
                            onClick={(event) => onMenuItemClicked(event, op)}
                        />)}
                </Menu>
                {selectedOperation &&
                    <ModalObjectOperationExecutor
                        open={modalOpen}
                        onCancel={() => setModalOpen(false)}
                        object={arrayItemObject}
                        objectSchema={arrayItemSchema}
                        operation={selectedOperation}
                        onOperationExecuted={() => onOperationExecuted(selectedOperation)}
                        apiContext={apiContext}/>}
            </Dropdown>
        </>
    );
}