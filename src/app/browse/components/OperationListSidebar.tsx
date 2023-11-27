import EmptyApiSpecsView from "@/app/browse/components/EmptyApiSpecsView";
import { OperationList } from "@/app/components/operation/OperationList";
import { ApiSpecSelect } from "@/app/components/select/ApiSpecSelect";
import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { useApiSpecs } from "@/app/hooks/useApiSpecs";
import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { BrowseLocalStorage } from "@/app/lib/localstorage/BrowseLocalStorage";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { parseOperations } from "@/app/lib/openapi/utils";
import { Search, Tune } from "@mui/icons-material";
import { Box, Checkbox, Dropdown, IconButton, Input, Menu, MenuButton, MenuItem, Stack, Typography } from "@mui/joy";
import LinearProgress from "@mui/joy/LinearProgress";
import { debounce } from "@mui/material";
import { OpenAPIV3 } from "openapi-types";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import PathsObject = OpenAPIV3.PathsObject;

const isOperationMatchingSearch = (op: StandaloneOperation, search: string) => {
    const target = search.toLowerCase();

    // by summary
    if (op.operation.summary?.toLowerCase()?.includes(target)) {
        return true;
        // by path
    } else if (op.path?.toLowerCase()?.includes(target)) {
        return true;
        // by id
    } else if (op.getOperationId()?.toLowerCase()?.includes(target)) {
        return true;
    } else if (op.operation.tags?.find(tag => tag.toLowerCase().includes(target))) {
        return true;
    }

    return false;
}

const isSearchEmpty = (search: string) => {
    return !search && search.trim().length === 0;
}

const getSavedFilter = () => {
    return BrowseLocalStorage.getFilter();
}

export interface OperationListSidebarProps {
    selectedOperation?: StandaloneOperation
    onOperationSelected: (operation: StandaloneOperation) => void
}

export const OperationListSidebar = ({ selectedOperation, onOperationSelected }: OperationListSidebarProps) => {
    const { registerEvent } = useAnalytics();
    const [operations, setOperations] = useState<StandaloneOperation[]>([]);
    const [search, setSearch] = useState('');
    const [apiSpecFilter, setApiSpecFilter] = useState<ApiSpec | undefined>(getSavedFilter());
    const { data: apiSpecs, error, isLoading } = useApiSpecs();
    const [onlyDisplayTechnicalName, setOnlyDisplayTechnicalName] = useState(
        BrowseLocalStorage.getIsOnlyDisplayTechnicalNames()
    );

    const onSearchOperation = debounce((event: ChangeEvent<HTMLInputElement>) => {
        registerEvent({ category: 'browse', action: 'browse-search-operation' });
        setSearch(event.target.value);
    }, 500);

    const onApiFilterSelected = (apiSpec: ApiSpec | undefined) => {
        registerEvent({ category: 'browse', action: 'browse-filter-api' });
        BrowseLocalStorage.setFilter(apiSpec);
        setApiSpecFilter(apiSpec);
    };

    useEffect(() => {
        const operations = (apiSpecs?.apiSpecs || [])
            .filter(apiSpec => !apiSpecFilter || apiSpec.id === apiSpecFilter.id)
            .flatMap((spec: ApiSpec) => {
                const pathsObject = spec.document.paths as PathsObject;
                return parseOperations(pathsObject, spec);
            })
            .filter(op => isSearchEmpty(search) || isOperationMatchingSearch(op, search));

        setOperations(operations);
    }, [apiSpecs, apiSpecFilter, search]);

    if (apiSpecs && apiSpecs.apiSpecs.length === 0) {
        return <EmptyApiSpecsView />;
    }

    const showApiSpecFilter = !apiSpecs || apiSpecs.apiSpecs.length > 1;

    const setDisplayNamePreference = () => {
        const newPreference = !onlyDisplayTechnicalName;
        setOnlyDisplayTechnicalName(newPreference);
        BrowseLocalStorage.setOnlyDisplayTechnicalNames(newPreference);
    }

    return (
        <Stack sx={(theme) => ({
            '--operation-list-panel-padding-top': {
                xs: `calc(${theme.spacing(2)} + var(--Header-height))`,
            },
            pt: 'var(--operation-list-panel-padding-top)',
        })}>
            <Stack direction="row" gap={1} sx={(theme) => ({
                mb: 1,
                mx: 3
            })}>
                <Input
                    disabled={isLoading}
                    placeholder="Search operation..."
                    startDecorator={<Search />}
                    onChange={onSearchOperation}
                    sx={{ width: showApiSpecFilter ? '60%' : '100%' }}
                />
                {showApiSpecFilter && <ApiSpecSelect
                    onApiSpecSelected={onApiFilterSelected}
                    isSelectionForced={false}
                    defaultApiSpecId={getSavedFilter()?.id}
                    sx={{ width: '40%' }}
                />}
                <Dropdown>
                    <MenuButton
                        slots={{ root: IconButton }}
                    >
                        <Tune />
                    </MenuButton>
                    <Menu placement="bottom-end">
                        <MenuItem onClick={setDisplayNamePreference}>
                            <Stack direction='row' alignItems='center' gap={1}>
                                <Typography level="body-sm">Only technical names</Typography>
                                <Checkbox
                                    checked={onlyDisplayTechnicalName}
                                    size="sm"
                                />
                            </Stack>
                        </MenuItem>
                    </Menu>
                </Dropdown>
            </Stack>
            <Box>
                {isLoading ? <LinearProgress /> :
                    <OperationList
                        operations={operations}
                        selectedOperation={selectedOperation}
                        onlyDisplayTechnicalName={onlyDisplayTechnicalName}
                        onOperationSelected={onOperationSelected} />}
            </Box>
        </Stack>
    );
}