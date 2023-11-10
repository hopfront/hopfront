import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { ChangeEvent, useEffect, useState } from "react";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { debounce } from "@mui/material";
import { BrowseLocalStorage } from "@/app/lib/localstorage/BrowseLocalStorage";
import { useApiSpecs } from "@/app/hooks/useApiSpecs";
import { parseOperations } from "@/app/lib/openapi/utils";
import EmptyApiSpecsView from "@/app/browse/components/EmptyApiSpecsView";
import { Search } from "@mui/icons-material";
import { Box, Input, Stack } from "@mui/joy";
import { ApiSpecSelect } from "@/app/components/select/ApiSpecSelect";
import LinearProgress from "@mui/joy/LinearProgress";
import { OpenAPIV3 } from "openapi-types";
import PathsObject = OpenAPIV3.PathsObject;
import { OperationList } from "@/app/components/operation/OperationList";

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

    return (
        <Stack sx={(theme) => ({
            '--operation-list-panel-padding-top': {
                xs: `calc(${theme.spacing(2)} + var(--Header-height))`,
                md: '24px',
            },
            pt: 'var(--operation-list-panel-padding-top)',
        })}>
            <Stack direction="row" sx={(theme) => ({
                mb: 1,
                mx: 3
            })}>
                <Input
                    disabled={isLoading}
                    placeholder="Search operation..."
                    startDecorator={<Search />}
                    onChange={onSearchOperation}
                    sx={{ width: showApiSpecFilter ? '60%' : '100%', mr: 1 }}
                />
                {showApiSpecFilter && <ApiSpecSelect
                    onApiSpecSelected={onApiFilterSelected}
                    isSelectionForced={false}
                    defaultApiSpecId={getSavedFilter()?.id}
                    sx={{ width: '40%' }}
                />}
            </Stack>
            <Box>
                {isLoading ? <LinearProgress /> :
                    <OperationList
                        operations={operations}
                        selectedOperation={selectedOperation}
                        onOperationSelected={onOperationSelected} />}
            </Box>
        </Stack>
    );
}