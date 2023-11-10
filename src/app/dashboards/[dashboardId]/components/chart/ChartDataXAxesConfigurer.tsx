import {useState} from "react";
import {
    SchemaPropertyPickerModal,
    SchemaPropertyPickerModalProps
} from "@/app/components/foreign-keys/SchemaPropertyPickerModal";
import {getSchemaPropertyType} from "@/app/lib/openapi/utils";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import {IconButton, ListItem, ListItemButton} from "@mui/joy";
import {AddCircle, DataArray, Delete} from "@mui/icons-material";
import {TitledList} from "@/app/dashboards/[dashboardId]/components/chart/TitledList";
import {Monospace} from "@/app/components/typography/Monospace";
import {SchemaProperty} from "@/app/components/foreign-keys/SchemaPropertyPicker/SchemaPropertyPicker";
import {ChartDataConfigXAxis} from "@/app/lib/model/chart/ChartDataConfig";

export interface ChartDataXAxesConfigurerProps {
    schemaRef: string
    xAxes: ChartDataConfigXAxis[]
    onXAxesConfigured: (xAxes: ChartDataConfigXAxis[]) => void
    apiSpec: ApiSpec
}

export const ChartDataXAxesConfigurer = ({
                                             schemaRef,
                                             xAxes,
                                             onXAxesConfigured,
                                             apiSpec
                                         }: ChartDataXAxesConfigurerProps) => {

    const [modalProps, setModalProps] = useState<SchemaPropertyPickerModalProps | undefined>();

    const schemaPropertyPredicate = (schemaProperty: SchemaProperty) => {
        const existingDataKey = xAxes.find(xAxis => xAxis.dataKey === schemaProperty.propertyName);

        if (existingDataKey) {
            return false;
        }

        const schemaPropertyType = getSchemaPropertyType(schemaProperty, apiSpec);
        return schemaPropertyType === "string" || schemaPropertyType === "integer" || schemaPropertyType === "number";
    };

    return (
        <>
            <TitledList title="X Axes">
                {xAxes.map(xAxis => {
                    return (
                        <ListItem key={xAxis.dataKey} endAction={
                            <IconButton
                                aria-label="Delete"
                                size="sm"
                                color="danger"
                                onClick={() => {
                                    onXAxesConfigured(xAxes.filter(x => x.dataKey !== xAxis.dataKey));
                                }}>
                                <Delete/>
                            </IconButton>}>
                            <DataArray/>
                            <Monospace>{xAxis.dataKey}</Monospace>
                        </ListItem>
                    );
                })}
                <ListItem sx={{mt: xAxes.length > 0 ? 1 : 0}}>
                    <ListItemButton onClick={() => {
                        setModalProps({
                            open: true,
                            onClose: () => setModalProps(undefined),
                            schemaRef: schemaRef,
                            defaultSchemaProperty: undefined,
                            schemaPropertyPredicate: schemaPropertyPredicate,
                            onSchemaPropertySelected: schemaPropertySelected => {
                                xAxes.push({
                                    dataKey: schemaPropertySelected.propertyName,
                                });

                                setModalProps(undefined);
                                onXAxesConfigured(xAxes);
                            },
                            apiSpec: apiSpec
                        });
                    }}>
                        <AddCircle color="primary"/> Add
                    </ListItemButton>
                </ListItem>
            </TitledList>

            {modalProps && <SchemaPropertyPickerModal
                open={modalProps.open}
                onClose={modalProps.onClose}
                schemaRef={modalProps.schemaRef}
                defaultSchemaProperty={modalProps.defaultSchemaProperty}
                schemaPropertyPredicate={modalProps.schemaPropertyPredicate}
                onSchemaPropertySelected={modalProps.onSchemaPropertySelected}
                apiSpec={modalProps.apiSpec}/>}
        </>
    )
}