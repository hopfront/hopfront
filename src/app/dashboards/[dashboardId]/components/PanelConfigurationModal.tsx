import {Box, List, ListItem, ListItemDecorator, Radio, RadioGroup, Typography} from "@mui/joy";
import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import {BarChart, ShowChart, TableChart} from "@mui/icons-material";
import {DashboardPanelTableConfigurationPage} from "./DashboardPanelTableConfigurationPage";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import {
    buildNewVisualizationPanel,
    DashboardPanel, newChartDataConfig
} from "@/app/lib/model/dashboard/DashboardPanel";
import {DashboardPanelType} from "@/app/lib/model/dashboard/DashboardPanelType";
import {ReactNode, useState} from "react";
import {
    DashboardPanelChartConfigurationPage
} from "@/app/dashboards/[dashboardId]/components/chart/DashboardPanelChartConfigurationPage";
import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";

interface PanelTemplate {
    type: DashboardPanelType
    label: string
    icon: ReactNode
    disabled: boolean
}

const PANEL_TEMPLATES: PanelTemplate[] = [
    {
        type: "Visualization",
        label: "Table",
        icon: <TableChart/>,
        disabled: false
    },
    {
        type: "chart",
        label: "Chart",
        icon: <BarChart/>,
        disabled: false
    }];

export interface PanelConfigurationModalProps {
    dashboard: Dashboard
    defaultPanel: DashboardPanel
    isLoading: boolean
    isOpen: boolean
    onSave: (panel: DashboardPanel) => void
    onClose: () => void
    onVariableCreated: (variable: DashboardVariable) => void
}

export default function PanelConfigurationModal({
                                                    dashboard,
                                                    defaultPanel,
                                                    isLoading,
                                                    isOpen,
                                                    onSave,
                                                    onClose,
                                                    onVariableCreated
                                                }: PanelConfigurationModalProps) {

    const [panel, setPanel] = useState(defaultPanel);

    return (
        <ResponsiveModal
            key={panel.id}
            open={isOpen}
            onClose={onClose}>
            <Box sx={{}}>
                <Typography id="modal-modal-title" level='title-lg'>
                    Panel configuration
                </Typography>
                <RadioGroup
                    sx={{mt: 2}}
                    defaultValue={panel.type}>
                    <List
                        orientation='horizontal'
                        sx={{
                            px: 0,
                            width: '100%',
                            '--List-gap': '1rem',
                            '--ListItem-paddingY': '1rem',
                            '--ListItem-radius': '8px',
                            '--ListItemDecorator-size': '32px',
                        }}
                    >

                        {PANEL_TEMPLATES.map((panelTemplate, index) => (
                            <ListItem
                                variant="outlined" key={panelTemplate.type}
                                sx={{boxShadow: 'sm', flexGrow: 1, flexBasis: '0%'}}>
                                <ListItemDecorator>
                                    {[<TableChart key="tableChart"/>, <ShowChart key="addChart"/>][index]}
                                </ListItemDecorator>
                                <Radio
                                    overlay
                                    value={panelTemplate.type}
                                    label={panelTemplate.label}
                                    disabled={panelTemplate.disabled}
                                    onChange={event => {
                                        if (event.target.checked) {
                                            switch (panelTemplate.type) {
                                                case "Visualization": {
                                                    setPanel(buildNewVisualizationPanel(panel.id, panel.title));
                                                    break;
                                                }
                                                case "chart": {
                                                    setPanel({
                                                        ...panel,
                                                        type: panelTemplate.type,
                                                        config: newChartDataConfig()
                                                    })
                                                    break;
                                                }
                                                default: {
                                                    setPanel({
                                                        ...panel,
                                                        type: panelTemplate.type,
                                                        config: newChartDataConfig()
                                                    })
                                                    break;
                                                }
                                            }
                                        }
                                    }}
                                    sx={{flexGrow: 1, flexDirection: 'row-reverse'}}
                                    slotProps={{
                                        action: ({checked}) => ({
                                            sx: (theme) => ({
                                                ...(checked && {
                                                    inset: -1,
                                                    border: '2px solid',
                                                    borderColor: theme.vars.palette.primary[500],
                                                }),
                                            }),
                                        }),
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </RadioGroup>

                {panel.type === "Visualization" &&
                    <DashboardPanelTableConfigurationPage
                        dashboard={dashboard}
                        defaultPanel={panel}
                        onSave={onSave}
                        isLoading={isLoading}
                        onVariableCreated={onVariableCreated}
                    />}

                {panel.type === "chart" && <DashboardPanelChartConfigurationPage
                    dashboard={dashboard}
                    defaultPanel={panel}
                    onSave={onSave}
                    onCancel={onClose}
                    isLoading={isLoading}
                    onVariableCreated={onVariableCreated}
                />}
            </Box>
        </ResponsiveModal>
    )
};