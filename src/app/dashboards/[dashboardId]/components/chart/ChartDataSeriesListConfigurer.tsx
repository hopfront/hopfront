import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import {useState} from "react";
import {IconButton, ListItem, ListItemButton} from "@mui/joy";
import {AddCircle, Delete} from "@mui/icons-material";
import Typography from "@mui/joy/Typography";
import {Monospace} from "@/app/components/typography/Monospace";
import {
    ChartSeriesConfigurerModal,
    ChartSeriesConfigurerModalProps
} from "@/app/dashboards/[dashboardId]/components/chart/ChartSeriesConfigurerModal";
import {ChartSeriesTypeIcon} from "@/app/components/chart/ChartSeriesTypeIcon";
import {TitledList} from "@/app/dashboards/[dashboardId]/components/chart/TitledList";
import {ChartSeries} from "@/app/lib/model/chart/ChartSeries";

export interface ChartDataSeriesListConfigurerProps {
    schemaRef: string
    series: ChartSeries[]
    onSeriesConfigured: (series: ChartSeries[]) => void
    apiSpec: ApiSpec
}

export const ChartDataSeriesListConfigurer = ({
                                                  schemaRef,
                                                  series,
                                                  onSeriesConfigured,
                                                  apiSpec,
                                              }: ChartDataSeriesListConfigurerProps) => {

    const [modalProps, setModalProps] = useState<ChartSeriesConfigurerModalProps | undefined>();

    return (
        <>
            <TitledList title="Series">
                {series.length === 0 && <ListItem><Typography color="warning">No series configured</Typography></ListItem>}
                {series.map(singleSeries => {
                    return (
                        <ListItem
                            key={'series-' + singleSeries.dataKey + '-' + singleSeries.type}
                            endAction={
                                <IconButton
                                    aria-label="Delete"
                                    size="sm"
                                    color="danger">
                                    <Delete
                                        onClick={() => {
                                            onSeriesConfigured(series.flatMap(s => s.dataKey === singleSeries.dataKey && s.type === singleSeries.type ? [] : s));
                                        }}/>
                                </IconButton>}>
                            <ListItemButton onClick={() => {
                                setModalProps({
                                    open: true,
                                    onClose: () => setModalProps(undefined),
                                    schemaRef: schemaRef,
                                    defaultSeries: singleSeries,
                                    onSeriesConfigured: configuredChartSeries => {
                                        onSeriesConfigured(series.flatMap(s => s.dataKey === configuredChartSeries.dataKey ? [configuredChartSeries] : [s]))
                                        setModalProps(undefined);
                                    },
                                    apiSpec: apiSpec
                                })
                            }}>
                                <ChartSeriesTypeIcon chartSeriesType={singleSeries.type} paletteKey={singleSeries.paletteKey}/>
                                <Monospace>{singleSeries.dataKey}</Monospace>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
                <ListItem sx={{mt: 1}}>
                    <ListItemButton onClick={() => {
                        setModalProps({
                            open: true,
                            onClose: () => setModalProps(undefined),
                            schemaRef: schemaRef,
                            defaultSeries: undefined,
                            onSeriesConfigured: configuredChartSeries => {
                                series.push(configuredChartSeries);
                                onSeriesConfigured(series);
                                setModalProps(undefined);
                            },
                            apiSpec: apiSpec
                        });
                    }}>
                        <AddCircle color="primary"/> Add
                    </ListItemButton>
                </ListItem>
            </TitledList>

            {modalProps && <ChartSeriesConfigurerModal
                open={modalProps.open}
                onClose={modalProps.onClose}
                schemaRef={modalProps.schemaRef}
                defaultSeries={modalProps.defaultSeries}
                onSeriesConfigured={modalProps.onSeriesConfigured}
                apiSpec={modalProps.apiSpec}/>}
        </>
    )
}