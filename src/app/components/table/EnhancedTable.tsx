import {
    findRunnableOperationsFromSchema,
    getReferenceObjectOrUndefined,
    resolveSchemaFromSchemaOrReference
} from "@/app/lib/openapi/utils";
import { ArrayItemActionsMenu } from "@/app/components/operation/ArrayItemActionsMenu";
import { SingleRowAnyPropertyViewer } from "@/app/components/property-viewer/SingleRowAnyPropertyViewer";
import { ArrayContext } from "@/app/context/ArrayContext";
import { AutoFixHigh, KeyboardArrowLeft, KeyboardArrowRight, Settings } from "@mui/icons-material";
import { Dropdown, ListItemDecorator, Menu, MenuButton, MenuItem, Sheet, Stack, SvgIcon } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import { OpenAPIV3 } from "openapi-types";
import React, { useContext, useState } from "react";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { ResponseSchemaSelectedObserver } from "@/app/lib/model/ResponseSchemaSelectedObserver";
import { ResponsiveModal } from "../modal/ResponsiveModal";
import { ObjectView } from "@/app/components/property-viewer/ObjectView";
import ReferenceObject = OpenAPIV3.ReferenceObject;
import ArraySchemaObject = OpenAPIV3.ArraySchemaObject;
import {
    OperationFromObjectModal
} from "@/app/components/foreign-keys/OperationFromObjectModal/OperationFromObjectModal";
import { AdminContext, shouldShowAdminContent } from "@/app/context/AdminContext";
import { SingleRowScalarPropertyViewer } from "../property-viewer/SingleRowScalarPropertyViewer";

interface HeadCell {
    id: keyof TableData;
    label: string;
}

export interface TableData {
    tableRow: string
}

function getHeadCells(array: object[], arraySchemaObject: ArraySchemaObject | undefined, apiContext: ApiContext): HeadCell[] {
    if (!array) { // Should not be possible but hey TypeScript
        return [];
    }

    const uniqueKeys = new Set<string>();

    const arrayItemsSchemaReferenceObject =
        arraySchemaObject && getReferenceObjectOrUndefined(arraySchemaObject.items);

    const arrayItemsSchemaExtension = (apiContext.extension?.schemas || [])
        .find(schemaExtension => schemaExtension.schemaRef === arrayItemsSchemaReferenceObject?.$ref);

    // We only want to "scan" the first X elements to avoid performance issues (at the moment).
    array.toSpliced(0, Math.min(0, array.length - (array.length - 100))).forEach(object => {
        if (object) {
            Object.keys(object).forEach(objectKey => {
                if (arrayItemsSchemaExtension) {
                    const arrayPropertyExtension = arrayItemsSchemaExtension.properties.find(p => p.propertyName === objectKey);

                    if (arrayPropertyExtension) {
                        if (!arrayPropertyExtension.visibility || arrayPropertyExtension.visibility === "everywhere") {
                            uniqueKeys.add(objectKey);
                        }
                    } else {
                        uniqueKeys.add(objectKey);
                    }
                } else {
                    uniqueKeys.add(objectKey);
                }
            })
        } else {
            uniqueKeys.add('undefined header');
        }
    });

    return Array.from(uniqueKeys).map(value => {
        const propertyExtension = arrayItemsSchemaExtension?.properties.find(pe => pe.propertyName === value);

        return {
            id: value,
            label: propertyExtension?.label || value,
        } as HeadCell
    });
}

const labelDisplayedRows = ({
    from,
    to,
    count,
}: {
    from: number;
    to: number;
    count: number;
}) => {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

export interface EnhancedTableProps {
    title?: string
    rows: TableData[];
    schema?: ArraySchemaObject | undefined
    loading?: boolean
    onRefreshNeeded: () => void
    apiContext: ApiContext
    responseSchemaSelectedObserver?: ResponseSchemaSelectedObserver
    isPreviewTable?: boolean
    sx?: {}
}

export const EnhancedTable = ({
    title,
    rows,
    schema,
    loading,
    onRefreshNeeded,
    apiContext,
    responseSchemaSelectedObserver,
    isPreviewTable = false,
    sx
}: EnhancedTableProps) => {

    const arrayContext = useContext(ArrayContext);
    const adminContext = useContext(AdminContext);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(isPreviewTable ? 5 : 10);
    const minRowsToDisplayFooter = 5;

    const headCells = getHeadCells(rows, schema, apiContext);
    const arrayItemSchemaReference = schema?.items ? schema.items as ReferenceObject : undefined;
    const arrayItemSchema =
        arrayItemSchemaReference && resolveSchemaFromSchemaOrReference(arrayItemSchemaReference, apiContext.apiSpec.document);

    const [rowDetails, setRowDetails] = React.useState<TableData | undefined>();
    const [showAddOperationModal, setShowAddOperationModal] = useState(false);

    const isArrayItemSelectable = (): boolean => {
        if (!responseSchemaSelectedObserver) {
            return false;
        }

        return responseSchemaSelectedObserver.schemaRef === arrayItemSchemaReference?.$ref;
    }

    const runnableOperations = arrayItemSchemaReference
        ? findRunnableOperationsFromSchema(arrayItemSchemaReference.$ref, apiContext).map(op => op.operation)
        : [];

    const isActionsDisplayed = (): boolean => {
        return responseSchemaSelectedObserver === undefined;
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any, newValue: number | null) => {
        setRowsPerPage(parseInt(newValue!.toString(), 10));
        setPage(0);
    };

    const getLabelDisplayedRowsTo = () => {
        if (rows.length === -1) {
            return (page + 1) * rowsPerPage;
        }
        return rowsPerPage === -1
            ? rows.length
            : Math.min(rows.length, (page + 1) * rowsPerPage);
    };

    const onRowClicked = (event: React.MouseEvent<HTMLTableRowElement>, row: TableData) => {
        event.stopPropagation();
        setRowDetails(row);
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const columnCount = (isArrayItemSelectable() ? 1 : 0) + headCells.length + (isActionsDisplayed() ? 1 : 0);
    const actionColumnWidth = 80;
    const lastColumnShadowWidth = isActionsDisplayed() ? actionColumnWidth - 20 : 0;
    const borderTableStyle = isPreviewTable ? {
        border: '1px solid',
        borderColor: 'divider',
    } : {};

    return (
        <ArrayContext.Provider value={{ level: arrayContext.level + 1 }}>
            <Sheet
                sx={{
                    pl: 0.5,
                    overflow: 'auto',
                    borderRadius: 'sm',
                    '--TableCell-height': '40px',
                    // the number is the amount of the header rows.
                    '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
                    '--Table-firstColumnWidth': '0px',
                    '--Table-lastColumnWidth': `${lastColumnShadowWidth}px`,
                    // background needs to have transparency to show the scrolling shadows
                    '--TableRow-stripeBackground': 'rgba(0 0 0 / 0.04)',
                    '--TableRow-hoverBackground': 'rgba(0 0 0 / 0.08)',
                    background: (
                        theme,
                    ) => `linear-gradient(to right, ${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
            linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
            radial-gradient(
              farthest-side at 0 50%,
              rgba(0, 0, 0, 0.12),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
                farthest-side at 100% 50%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              )
              0 100%`,
                    backgroundSize:
                        '40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'local, local, scroll, scroll',
                    backgroundPosition:
                        'var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)',
                    backgroundColor: 'background.surface',
                    ...borderTableStyle,
                    ...sx
                }}
            >
                {title && <Typography
                    level="body-lg"
                    id="tableTitle"
                    sx={{
                        p: 1
                    }}>
                    {title}
                </Typography>}
                <Table
                    aria-labelledby="tableTitle"
                    hoverRow
                    noWrap
                    borderAxis="none"
                    sx={{
                        tableLayout: 'auto',
                        '--TableCell-headBackground': 'transparent',
                        '--TableCell-selectedBackground': (theme) =>
                            theme.vars.palette.success.softBg,
                        '& tbody tr > *:last-child, & thead tr > *:last-child': isActionsDisplayed() ? {
                            position: 'sticky',
                            right: 0,
                            backgroundColor: (theme) =>
                                theme.vars.palette.background.surface,
                            zIndex: 2
                        } : {}
                    }}
                >
                    <thead>
                        <tr>
                            {isArrayItemSelectable() && <th></th>}
                            {headCells.map((headCell) => {
                                return (
                                    <th key={headCell.label}>
                                        {headCell.label}
                                    </th>
                                );
                            })}
                            {(isActionsDisplayed() && rows?.length > 0) && shouldShowAdminContent(adminContext) && schema &&
                                <th
                                    style={{ width: `${actionColumnWidth}px` }}>
                                    <Stack direction="row"
                                        justifyContent="center">
                                        <Dropdown>
                                            <MenuButton
                                                disabled={loading}
                                                tabIndex={-1}
                                                slots={{ root: IconButton }}
                                                slotProps={{ root: { color: 'neutral', size: 'sm' } }}
                                            >
                                                <SvgIcon
                                                    slots={{ root: Settings }} />
                                            </MenuButton>
                                            {schema?.items && <Menu placement="bottom-start">
                                                <MenuItem onClick={() => setShowAddOperationModal(true)}>
                                                    <ListItemDecorator>
                                                        <SvgIcon slots={{ root: AutoFixHigh }} />
                                                    </ListItemDecorator>
                                                    Add smart operation
                                                </MenuItem>
                                            </Menu>}
                                        </Dropdown>
                                    </Stack>
                                </th>}
                        </tr>
                    </thead>
                    <tbody>
                        {(rows || [])
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((rowData, index) => {
                                if (!rowData) {
                                    return (
                                        <SingleRowScalarPropertyViewer key={index} property={null} />
                                    )
                                }
                                const rowValues = headCells.map(headCell => {
                                    const objectPropertyValue = rowData[headCell.id];
                                    const objectPropertySchemaRef = arrayItemSchema?.properties
                                        ? arrayItemSchema.properties[headCell.id]
                                        : undefined;

                                    return (
                                        <td style={{ minWidth: '100px', maxWidth: "550px" }}
                                            key={headCell.id || index}>
                                            <SingleRowAnyPropertyViewer
                                                propertyValue={objectPropertyValue}
                                                propertySchema={objectPropertySchemaRef}
                                                loading={loading}
                                                responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                                                apiContext={apiContext} />
                                        </td>
                                    );
                                });

                                const onArrayItemSelected = (event: React.MouseEvent<HTMLAnchorElement>) => {
                                    event.stopPropagation();
                                    if (responseSchemaSelectedObserver) {
                                        responseSchemaSelectedObserver.onValueSelected(rowData);
                                    }
                                }

                                return (
                                    <tr key={rowData.tableRow || index}
                                        onClick={(event) => onRowClicked(event, rowData)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {isArrayItemSelectable() &&
                                            <td><Button
                                                disabled={loading}
                                                onClick={(event) => {
                                                    onArrayItemSelected(event)
                                                }} size="sm">Pick</Button></td>}
                                        {rowValues}
                                        {arrayItemSchema && isActionsDisplayed()
                                            && <td
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                }}>
                                                <Stack direction="row" justifyContent="center">
                                                    <ArrayItemActionsMenu
                                                        arrayItemObject={rowData}
                                                        arrayItemSchema={arrayItemSchemaReference}
                                                        runnableOperations={runnableOperations}
                                                        onOperationExecuted={operation => {
                                                            if (["POST", "PUT", "DELETE", "PATCH"].indexOf(operation.method.toUpperCase()) >= 0) {
                                                                onRefreshNeeded();
                                                            }
                                                        }}
                                                        apiContext={apiContext} />
                                                </Stack>
                                            </td>}
                                    </tr>
                                );
                            })}
                        {emptyRows > 0 && (
                            <tr>
                                <td colSpan={columnCount} />
                            </tr>
                        )}
                    </tbody>
                    {(rows || []).length > minRowsToDisplayFooter &&
                        <tfoot>
                            <tr>
                                <td colSpan={columnCount}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            justifyContent: 'flex-start',
                                        }}
                                    >
                                        <FormControl orientation="horizontal" size="sm">
                                            <FormLabel>Rows per page:</FormLabel>
                                            <Select disabled={loading} onChange={handleChangeRowsPerPage}
                                                value={rowsPerPage}>
                                                <Option value={5}>5</Option>
                                                <Option value={10}>10</Option>
                                                <Option value={50}>50</Option>
                                                <Option value={100}>100</Option>
                                            </Select>
                                        </FormControl>
                                        <Typography textAlign="center" sx={{ minWidth: 80 }}>
                                            {labelDisplayedRows({
                                                from: rows.length === 0 ? 0 : page * rowsPerPage + 1,
                                                to: getLabelDisplayedRowsTo(),
                                                count: rows.length === -1 ? -1 : rows.length,
                                            })}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                disabled={loading || page === 0}
                                                size="sm"
                                                color="neutral"
                                                variant="outlined"
                                                onClick={() => handleChangePage(page - 1)}
                                                sx={{ bgcolor: 'background.surface' }}
                                            >
                                                <KeyboardArrowLeft />
                                            </IconButton>
                                            <IconButton
                                                size="sm"
                                                color="neutral"
                                                variant="outlined"
                                                disabled={
                                                    (loading || (rows.length !== -1
                                                        ? page >= Math.ceil(rows.length / rowsPerPage) - 1
                                                        : false))
                                                }
                                                onClick={() => handleChangePage(page + 1)}
                                                sx={{ bgcolor: 'background.surface' }}
                                            >
                                                <KeyboardArrowRight />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </td>
                            </tr>
                        </tfoot>}
                </Table>
            </Sheet>
            <ResponsiveModal
                open={rowDetails !== undefined}
                onClose={() => {
                    setRowDetails(undefined);
                }}>
                <ObjectView
                    object={rowDetails}
                    schemaRef={arrayItemSchemaReference?.$ref}
                    loading={loading}
                    apiContext={apiContext} />
            </ResponsiveModal>
            {showAddOperationModal && schema?.items && <OperationFromObjectModal
                open={showAddOperationModal}
                onClose={() => setShowAddOperationModal(false)}
                sampleObject={(rows || []).length > 0 && rows[0]}
                objectSchema={schema.items}
                onConfigurationUpdate={() => {
                    setShowAddOperationModal(false);
                    onRefreshNeeded();
                }}
                apiContext={apiContext} />}
        </ArrayContext.Provider>
    );
}