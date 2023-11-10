import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {useRouter} from "next/navigation";
import React, {Fragment} from "react";
import {KeyboardArrowDown} from "@mui/icons-material";
import {
    Box,
    List,
    ListDivider,
    ListItem,
    ListItemButton,
    ListItemContent,
    ListItemDecorator,
    Typography
} from "@mui/joy";

import {OperationLabel} from "@/app/components/typography/OperationLabel";

interface OperationsByTagsProps {
    operations: StandaloneOperation[]
}

export default function OperationsByTags({ operations }: OperationsByTagsProps) {
    const router = useRouter();
    const untaggedKey: string = "untagged";
    const isOperationWithoutTag: (op: StandaloneOperation) => boolean = (op: StandaloneOperation) => {
        return (!op.operation.tags || op.operation.tags.length == 0);
    };

    const tagsArrays = operations.map(op => isOperationWithoutTag(op) ? [untaggedKey] : op.operation.tags!!);
    let duplicateTags: string[] = [];
    for (const tagArray of tagsArrays) {
        duplicateTags = duplicateTags.concat(tagArray);
    }
    const uniqueTags = Array.from(new Set(duplicateTags));
    const operationsByTag: { [key: string]: StandaloneOperation[] } = {};

    const setTagOpen = (tag: string, open: boolean) => {
        const tmpTagsOpen: { [key: string]: boolean } = {};
        for (const tag of uniqueTags) {
            tmpTagsOpen[tag] = false;
        }
        tmpTagsOpen[tag] = open;
        setTagsOpen(tmpTagsOpen);
    };

    for (const tag of uniqueTags) {
        if (tag === untaggedKey) {
            operationsByTag[untaggedKey] = operations.filter(op => isOperationWithoutTag(op));
        } else {
            operationsByTag[tag] = operations.filter(op => op.operation.tags?.includes(tag));
        }
    }

    const [tagsOpen, setTagsOpen] = React.useState<{ [key: string]: boolean }>({});

    const operationListComponent = (tag: string) => {
        return (
            <List>
                {operationsByTag[tag]
                    .sort((a, b) => {
                        const summaryA = a.operation.summary?.toUpperCase() ?? "";
                        const summaryB = b.operation.summary?.toUpperCase() ?? "";
                        return (summaryA < summaryB) ? -1 : (summaryA > summaryB) ? 1 : 0;
                    })
                    .map((operation, indexOperation) => {
                        return (
                            <Fragment key={`${tag}-${operation.getOperationId()}`}>
                                <ListItem>
                                    <ListItemButton
                                        onClick={(e) => { e.stopPropagation(); router.push(`/api-specs/${operation.apiSpec.id}/operations/${operation.getOperationId()}/execute`); }}
                                    >
                                        <ListItemContent>
                                            <OperationLabel operation={operation} mode="human" alignPaths={true}/>
                                        </ListItemContent>
                                    </ListItemButton>
                                </ListItem>
                                {operationsByTag[tag].length > indexOperation + 1 && (
                                    <ListDivider inset="startDecorator" sx={{ marginY: 0 }} />
                                )}
                            </Fragment>
                        );
                    })}
            </List>
        )
    }

    const tagIsOpen = (tag: string): boolean => {
        if (!tagsOpen.hasOwnProperty(tag)) {
            return true;
        }

        return tagsOpen[tag]
    }

    return (
        <Box>
            <List
                size="lg"
                sx={{
                    borderRadius: 'sm',
                    p: 0,
                    overflow: 'hidden',
                    '--List-nestedInsetStart': '0.5rem',
                    bgcolor: 'background.surface'
                }}
            >
                {uniqueTags
                    .sort((a, b) => (a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0)
                    .map((tag, indexTag) => (
                        <Fragment key={tag}>
                            {uniqueTags.length === 1 ?
                                operationListComponent(uniqueTags[0]) :
                                <>
                                    <ListItem nested onClick={() => setTagOpen(tag, !tagIsOpen(tag))}>
                                        <ListItemButton>
                                            <ListItemDecorator>
                                                <KeyboardArrowDown sx={{ transform: tagIsOpen(tag) ? 'initial' : 'rotate(-90deg)' }} />
                                            </ListItemDecorator>
                                            <ListItemContent>
                                                <Typography level="h3">
                                                    {tag}
                                                </Typography>
                                            </ListItemContent>

                                        </ListItemButton>
                                        {tagIsOpen(tag) && operationsByTag[tag] && operationsByTag[tag].length > 0 && (
                                            operationListComponent(tag)
                                        )}
                                    </ListItem>
                                    {uniqueTags.length > indexTag + 1 && (
                                        <ListDivider sx={{ marginY: 0 }} />
                                    )}
                                </>
                            }
                        </Fragment>
                    ))
                }
            </List>
        </Box>
    )
}