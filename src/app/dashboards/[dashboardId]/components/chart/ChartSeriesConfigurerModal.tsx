import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import {useState} from "react";
import {SchemaPropertyPicker} from "@/app/components/foreign-keys/SchemaPropertyPicker/SchemaPropertyPicker";
import {getSchemaPropertyType} from "@/app/lib/openapi/utils";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import {Box, Button, Option, Select, Stack, Switch} from "@mui/joy";
import {PaletteRounded} from "@mui/icons-material";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import {Chart} from "@/app/components/chart/Chart";
import {paletteKeyToColorFromMaterialTheme} from "@/app/dashboards/[dashboardId]/components/chart/utils";
import {ButtonRow} from "@/app/components/button/ButtonRow";
import {ChartSeriesTypeIcon} from "@/app/components/chart/ChartSeriesTypeIcon";
import {LineSeriesProperties} from "@/app/lib/model/chart/LineSeriesProperties";
import {BarSeriesProperties} from "@/app/lib/model/chart/BarSeriesProperties";
import {AreaSeriesProperties} from "@/app/lib/model/chart/AreaSeriesProperties";
import {ScatterSeriesProperties, ScatterSeriesShape} from "@/app/lib/model/chart/ScatterSeriesProperties";
import {ChartSeries, ChartSeriesType} from "@/app/lib/model/chart/ChartSeries";
import {ManualInput} from "@/app/components/input/ManualInput";

interface PreviewDataStructure {
    name: string
    uv: number,
    pv: number,
    amt: number
}

const PREVIEW_DATA: PreviewDataStructure[] = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

interface ColorChoice {
    paletteKey: string
    label: string
}

const COLOR_CHOICES: ColorChoice[] = [
    {
        paletteKey: 'primary',
        label: 'Primary',
    },
    {
        paletteKey: 'neutral',
        label: 'Neutral',
    },
    {
        paletteKey: 'success',
        label: 'Success',
    },
    {
        paletteKey: 'warning',
        label: 'Warning'
    },
    {
        paletteKey: 'danger',
        label: 'Danger',
    }
]

export interface ChartSeriesConfigurerModalProps {
    open: boolean,
    onClose: () => void
    defaultSeries?: ChartSeries
    schemaRef: string
    onSeriesConfigured: (chartSeries: ChartSeries) => void,
    apiSpec: ApiSpec
}

interface ColorChoiceTypographyProps {
    colorChoice: ColorChoice
}

interface SeriesTypeOption {
    seriesType: ChartSeriesType
    label: string
}

const SERIES_TYPES_OPTIONS: SeriesTypeOption[] = [
    {
        seriesType: "bar",
        label: "Bar",
    },
    {
        seriesType: "area",
        label: "Area",
    },
    {
        seriesType: "line",
        label: "Line",
    },
    {
        seriesType: "scatter",
        label: "Scatter",
    }
]

const ColorChoiceTypography = ({colorChoice}: ColorChoiceTypographyProps) => {
    return <>
        <Stack direction="row">
            <Typography>
                <Stack alignContent="center">
                    <PaletteRounded sx={theme => {
                        return {
                            color: paletteKeyToColorFromMaterialTheme(colorChoice.paletteKey, theme),
                        };
                    }}/>
                </Stack>
            </Typography>
            <Typography sx={{ml: 1}}>
                {colorChoice.label}
            </Typography>
        </Stack>
    </>;
};

const seriesTypeOptionLabel = (seriesTypeOption: SeriesTypeOption) => <>
    <Stack direction="row">
        <Typography>
            <Stack justifyContent="center">
                <ChartSeriesTypeIcon
                    chartSeriesType={seriesTypeOption.seriesType}/>
            </Stack>
        </Typography>
        <Typography sx={{ml: 1}}>{seriesTypeOption.label}</Typography>
    </Stack>
</>

export const ChartSeriesConfigurerModal = ({
                                               open,
                                               onClose,
                                               defaultSeries,
                                               schemaRef,
                                               onSeriesConfigured,
                                               apiSpec
                                           }: ChartSeriesConfigurerModalProps) => {

    const [dataKey, setDataKey] = useState(defaultSeries?.dataKey);
    const [unit, setUnit] = useState<string | undefined>(defaultSeries?.unit);
    const [seriesType, setSeriesType] = useState(defaultSeries?.type || 'bar');
    const [valueMultiplier, setValueMultiplier] = useState(defaultSeries?.valueMultiplier || 1);
    const [paletteKey, setPaletteKey] = useState(defaultSeries?.paletteKey || 'primary');
    const [animationActive, setAnimationActive] = useState<boolean>(defaultSeries?.properties?.isAnimationActive || true);
    const [showDot, setShowDot] = useState<boolean | undefined>(defaultSeries?.properties && (defaultSeries?.properties as LineSeriesProperties).dot);
    const [scatterShape, setScatterShape] = useState<ScatterSeriesShape | undefined>(defaultSeries?.properties && (defaultSeries?.properties as ScatterSeriesProperties).shape);

    const buildSeriesProperties = () => {
        switch (seriesType) {
            case "area": {
                return {
                    isAnimationActive: animationActive,
                } as AreaSeriesProperties;
            }
            case "bar": {
                return {
                    isAnimationActive: animationActive,
                } as BarSeriesProperties;
            }
            case "line": {
                return {
                    isAnimationActive: animationActive,
                    dot: showDot
                } as LineSeriesProperties;
            }
            case "scatter": {
                return {
                    isAnimationActive: animationActive,
                    shape: scatterShape,
                } as ScatterSeriesProperties;
            }
            default: {
                return undefined;
            }
        }
    }

    return (
        <ResponsiveModal open={open} onClose={onClose}>
            <Typography level="title-lg" sx={{mb: 2}}>Series configuration</Typography>
            <Card>
                <Typography level="title-md">Data Source</Typography>
                <SchemaPropertyPicker
                    schemaRef={schemaRef}
                    defaultSchemaProperty={dataKey ? {
                        schemaRef: schemaRef,
                        propertyName: dataKey
                    } : undefined}
                    schemaPropertyPredicate={schemaProperty => {
                        const schemaPropertyType = getSchemaPropertyType(schemaProperty, apiSpec);
                        return schemaPropertyType === "number" || schemaPropertyType === "integer";
                    }}
                    onSchemaPropertySelected={schemaPropertySelected => {
                        setDataKey(schemaPropertySelected.propertyName);
                    }}
                    apiSpec={apiSpec}/>

                <FormControl sx={{mt: 2}}>
                    <FormLabel>Unit</FormLabel>
                    <ManualInput
                        type="text"
                        defaultValue={unit}
                        placeholder="€"
                        onChange={value => setUnit(value as string)}/>
                </FormControl>
                <FormControl sx={{mt: 2}}>
                    <FormLabel>Multiply by a number</FormLabel>
                    <ManualInput
                        type="number"
                        defaultValue={valueMultiplier}
                        placeholder="1"
                        onChange={value => setValueMultiplier(value as number)}/>
                </FormControl>
            </Card>
            <Card sx={{mt: 2}}>
                <Typography level="title-md">Style</Typography>
                <Stack direction="row">
                    <Box sx={{mr: 2, minWidth: 300}}>
                        <FormControl>
                            <FormLabel>Type</FormLabel>
                            <Select
                                value={seriesType}
                                renderValue={option => {
                                    if (!option) {
                                        return null;
                                    }

                                    const seriesTypeOption =
                                        SERIES_TYPES_OPTIONS.find(sto => sto.seriesType === option.value)!;

                                    return seriesTypeOptionLabel(seriesTypeOption);
                                }}
                                onChange={(event, value) => {
                                    setSeriesType(value || "bar");

                                    switch (value) {
                                        case "line": {
                                            setShowDot(true);
                                            setScatterShape(undefined);
                                            break;
                                        }
                                        case "scatter": {
                                            setShowDot(false);
                                            setScatterShape(ScatterSeriesShape.Circle);
                                            break;
                                        }
                                        default: {
                                            setShowDot(undefined);
                                            setScatterShape(undefined);
                                            break;
                                        }
                                    }
                                }}>
                                {SERIES_TYPES_OPTIONS.map(option =>
                                    <Option
                                        key={option.seriesType}
                                        value={option.seriesType}>
                                        {seriesTypeOptionLabel(option)}
                                    </Option>
                                )}
                            </Select>
                        </FormControl>
                        <FormControl sx={{mt: 2}}>
                            <FormLabel>Color Palette</FormLabel>
                            <Select
                                value={paletteKey}
                                onChange={(event, value) => value && setPaletteKey(value)}
                                renderValue={option => {
                                    const selectedColorChoice = COLOR_CHOICES.find(cc => cc.paletteKey === (option && option.value));

                                    if (selectedColorChoice) {
                                        return <ColorChoiceTypography colorChoice={selectedColorChoice}/>;
                                    } else {
                                        return null;
                                    }
                                }}>
                                {COLOR_CHOICES.map(colorChoice => (
                                    <Option key={colorChoice.paletteKey}
                                            value={colorChoice.paletteKey}>
                                        <ColorChoiceTypography colorChoice={colorChoice}/>
                                    </Option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{mt: 2}}>
                            <Typography
                                startDecorator={<Switch
                                    checked={animationActive}
                                    onChange={event => setAnimationActive(event.target.checked)}/>
                                }>
                                Show Animation
                            </Typography>
                        </FormControl>
                        {seriesType === "line" && <FormControl sx={{mt: 2}}>
                            <Typography startDecorator={<Switch checked={showDot} onChange={event => setShowDot(event.target.checked)}/>}>
                                Show Dot
                            </Typography>
                        </FormControl>}
                        {seriesType === "scatter" && <FormControl sx={{mt: 2}}>
                            <FormLabel>Shape</FormLabel>
                            <Select
                                value={scatterShape || ScatterSeriesShape.Circle}
                                onChange={(event, value) => setScatterShape(value || undefined)}>
                                {Object.values(ScatterSeriesShape).map(scatterSeriesShapeValue => (
                                    <Option key={scatterSeriesShapeValue}
                                            value={scatterSeriesShapeValue}>
                                        {scatterSeriesShapeValue}
                                    </Option>
                                ))}
                            </Select>
                        </FormControl>}
                    </Box>
                    <Chart options={{
                        showTooltip: false,
                        showLegend: false,
                        showXAxis: false,
                        showYAxis: false,
                        height: 200,
                    }} data={PREVIEW_DATA} xAxes={[]}
                           series={[
                               {
                                   dataKey: "pv",
                                   paletteKey: paletteKey,
                                   unit: unit,
                                   type: seriesType,
                                   properties: buildSeriesProperties()
                               }
                           ]}/>
                </Stack>
            </Card>
            <ButtonRow align="right" sx={{mt: 2}}>
                <Button color="primary" disabled={!dataKey} onClick={() => {
                    if (dataKey) {
                        onSeriesConfigured({
                            dataKey: dataKey,
                            type: seriesType,
                            unit: unit,
                            valueMultiplier: valueMultiplier,
                            paletteKey: paletteKey,
                            properties: buildSeriesProperties(),
                        });
                    }
                }}>
                    OK
                </Button>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
            </ButtonRow>
        </ResponsiveModal>
    );
}