import { SingleRowAnyPropertyViewer } from "@/app/components/property-viewer/SingleRowAnyPropertyViewer";
import { ArrayContext } from "@/app/context/ArrayContext";
import { Box } from "@mui/joy";
import { OpenAPIV3 } from "openapi-types";
import { useContext } from "react";
import {EnhancedTable, TableData} from "../table/EnhancedTable";
import { SingleRowScalarPropertyViewer } from "./SingleRowScalarPropertyViewer";
import ArraySchemaObject = OpenAPIV3.ArraySchemaObject;
import { ApiContext } from "@/app/lib/model/ApiContext";
import { ResponseSchemaSelectedObserver } from "@/app/lib/model/ResponseSchemaSelectedObserver";
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;

export interface SingleRowArrayPropertyViewerProps {
    property: any[]
    schema?: ArraySchemaObject | undefined
    loading?: boolean
    responseSchemaSelectedObserver?: ResponseSchemaSelectedObserver
    apiContext: ApiContext,
    fromObjectView?: boolean // to know if we are displaying an array inside an object
}

export const SingleRowArrayPropertyViewer = ({
    property,
    schema,
    loading,
    responseSchemaSelectedObserver,
    apiContext,
    fromObjectView }: SingleRowArrayPropertyViewerProps) => {
    const arrayContext = useContext(ArrayContext);
    const maxNumberToDisplay = 4;
    const array = property as any[];

    const getObjectListView = (array: any[]) => {
        // we do not show an array if it's nested into an array
        // if array level > 1 but fromObjectView is true, it means we are displaying an array from a object view modal
        if (arrayContext.level > 1 && !fromObjectView) {
            const rows = [];
            for (let index = 0; (index < array.length) && index < maxNumberToDisplay; index++) {
                rows.push(<SingleRowAnyPropertyViewer
                    key={index}
                    propertyValue={array[index]}
                    propertySchema={schema}
                    loading={loading}
                    responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                    apiContext={apiContext}
                    sx={{
                        marginBottom: '0.25rem',
                        marginRight: '0.25rem'
                    }} />)
            }
            if (maxNumberToDisplay < array.length) {
                rows.push(<span key={array.length}>...</span>)
            }
            return rows;
        }

        return (
            <EnhancedTable
                rows={array as TableData[]}
                schema={schema}
                loading={loading}
                responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                onRefreshNeeded={() => { }}
                isPreviewTable={true}
                sx={{ mt: 1 }}
                apiContext={apiContext}
            />
        );
    }

    const getPrimitiveListView = (array: any[]) => {
        const items = array.slice(0, maxNumberToDisplay);

        return (
            <>
                <Box sx={{ display: 'flex' }}>
                    {items.map((item, index) =>
                        <>
                            <SingleRowScalarPropertyViewer
                                property={item}
                                schema={schema?.items as NonArraySchemaObject}
                                loading={loading}/>
                            {index !== items.length - 1 &&
                                <span style={{ marginRight: '4px' }}>,</span>}
                        </>
                    )}
                </Box>
            </>
        );
    }

    if (array.length === 0) {
        return null;
    } else if (array.length === 1) {
        return <SingleRowAnyPropertyViewer
            propertyValue={array[0]}
            propertySchema={schema}
            loading={loading}
            responseSchemaSelectedObserver={responseSchemaSelectedObserver}
            apiContext={apiContext} />;
    } else if (typeof array[0] === 'object') {
        return getObjectListView(array);
    } else if (!Array.isArray(array[0]) && typeof array[0] !== 'object') {
        return getPrimitiveListView(array);
    } else {
        return <span>{JSON.stringify(array)}</span>
    }
}