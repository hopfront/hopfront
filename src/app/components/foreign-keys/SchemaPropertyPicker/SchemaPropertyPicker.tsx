import {
    getSchemaByRef,
    getSchemaPropertySchemaRef, getSchemaPropertyType,
    resolveSchemaFromSchemaOrReference,
    schemaRefTuHumanLabel
} from "@/app/lib/openapi/utils";
import TreeView, {flattenTree} from "react-accessible-treeview";
import {OpenAPIV3} from "openapi-types";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import {ArrowDropDown, ArrowRight} from "@mui/icons-material";
import {Radio, RadioGroup} from "@mui/joy";
import React, {useState} from "react";
import "@/app/components/foreign-keys/SchemaPropertyPicker/styles.css";
import Typography from "@mui/joy/Typography";
import ReferenceObject = OpenAPIV3.ReferenceObject;
import ArraySchemaObject = OpenAPIV3.ArraySchemaObject;
import {Monospace} from "../../typography/Monospace";
import {NodeId} from "react-accessible-treeview/dist/TreeView/types";

interface SchemaPropertyNode {
    id: NodeId;
    name: string
    children?: SchemaPropertyNode[];
}

export interface SchemaProperty {
    schemaRef: string
    propertyName: string
}

const buildNodeFromProperty = (
    property: SchemaProperty,
    propertiesByNodeId: Map<NodeId, SchemaProperty>,
    apiSpec: ApiSpec): SchemaPropertyNode => {

    const propertyType = getSchemaPropertyType(property, apiSpec);

    switch (propertyType) {
        case "object":
            return buildNodeFromObjectProperty(property, propertiesByNodeId, apiSpec);
        case "array":
            return buildNodeFromArrayProperty(property, propertiesByNodeId, apiSpec);
        default:
            return buildEmptyNode(property, propertiesByNodeId);
    }
}

const buildEmptyNode = (property: SchemaProperty, propertiesByNodeId: Map<NodeId, SchemaProperty>): SchemaPropertyNode => {
    const nodeId = property.schemaRef + "." + property.propertyName;
    propertiesByNodeId.set(nodeId, property);

    return {
        id: nodeId,
        name: nodeId,
        children: [],
    }
}

const buildNodeFromSchemaRef = (
    property: SchemaProperty,
    schemaRef: string,
    propertiesByNodeId: Map<NodeId, SchemaProperty>,
    apiSpec: ApiSpec): SchemaPropertyNode => {

    const nodeId = property.schemaRef + "." + property.propertyName;

    const schemaObject = getSchemaByRef(schemaRef, apiSpec.document);
    const childrenPropertyNames = Object.keys(schemaObject.properties || {});

    propertiesByNodeId.set(nodeId, property);

    return {
        id: nodeId,
        name: nodeId,
        children: childrenPropertyNames.flatMap(childPropertyName => {
            return buildNodeFromProperty({
                    schemaRef: schemaRef,
                    propertyName: childPropertyName
                },
                propertiesByNodeId,
                apiSpec);
        })
    };
}

const buildNodeFromObjectProperty = (
    property: SchemaProperty,
    propertiesByNodeId: Map<NodeId, SchemaProperty>,
    apiSpec: ApiSpec): SchemaPropertyNode => {

    const nodeId = property.schemaRef + "." + property.propertyName;

    const propertySchemaRef = getSchemaPropertySchemaRef(property, apiSpec);

    if (!propertySchemaRef) {
        return {
            id: nodeId,
            name: nodeId,
            children: [],
        };
    }

    return buildNodeFromSchemaRef(property, propertySchemaRef, propertiesByNodeId, apiSpec);
}

const buildNodeFromArrayProperty = (
    property: SchemaProperty,
    propertiesByNodeId: Map<NodeId, SchemaProperty>,
    apiSpec: ApiSpec): SchemaPropertyNode => {

    const propertyParentSchemaObject = getSchemaByRef(property.schemaRef, apiSpec.document);
    const arrayPropertySchema = propertyParentSchemaObject.properties && propertyParentSchemaObject.properties[property.propertyName] as ArraySchemaObject;

    if (!arrayPropertySchema) {
        return buildEmptyNode(property, propertiesByNodeId);
    }

    if (arrayPropertySchema?.items.hasOwnProperty('$ref')) {
        const arrayItemsSchemaReferenceObject = arrayPropertySchema?.items as ReferenceObject;
        return buildNodeFromSchemaRef(property, arrayItemsSchemaReferenceObject.$ref, propertiesByNodeId, apiSpec);
    } else {
        return buildEmptyNode(property, propertiesByNodeId);
    }
}


class ResponseSchemaTree {
    constructor(public nodes: SchemaPropertyNode[], public propertiesByNodeId: Map<NodeId, SchemaProperty>) {
    }

    static empty(): ResponseSchemaTree {
        return new ResponseSchemaTree([], new Map());
    }
}

const getResponseSchemaTree = (schemaRef: string, apiSpec: ApiSpec): ResponseSchemaTree => {
    const propertiesByNodeId = new Map<NodeId, SchemaProperty>();
    const rootNode = buildNodeFromSchemaRef({
        schemaRef: schemaRef,
        propertyName: "root"
    }, schemaRef, propertiesByNodeId, apiSpec);
    return new ResponseSchemaTree([rootNode], propertiesByNodeId);
}

export interface SchemaPropertyPickerProps {
    schemaRef: string
    defaultSchemaProperty?: SchemaProperty,
    schemaPropertyPredicate: (schemaProperty: SchemaProperty) => boolean
    onSchemaPropertySelected: (schemaPropertySelected: SchemaProperty) => void
    disabled?: boolean
    apiSpec: ApiSpec
}

export const SchemaPropertyPicker = ({
                                         schemaRef,
                                         defaultSchemaProperty,
                                         schemaPropertyPredicate,
                                         onSchemaPropertySelected,
                                         disabled = false,
                                         apiSpec
                                     }: SchemaPropertyPickerProps) => {

    const [selectedSchemaProperty, setSelectedSchemaProperty] = useState(defaultSchemaProperty);

    const responseSchemaTree = getResponseSchemaTree(schemaRef, apiSpec);

    const tree = {
        id: "root",
        name: "",
        children: responseSchemaTree.nodes,
    };

    const data = flattenTree(tree);

    return (
        <>
            <div>
                <div className="checkbox">
                    <RadioGroup name="property-select-radio">
                        <TreeView
                            data={data}
                            defaultExpandedIds={Array.from(responseSchemaTree.propertiesByNodeId.keys())}
                            aria-label="Radio tree"
                            nodeRenderer={({
                                               element,
                                               isBranch,
                                               isExpanded,
                                               getNodeProps,
                                               level,
                                               handleSelect,
                                               handleExpand,
                                           }) => {


                                const schemaProperty = responseSchemaTree.propertiesByNodeId.get(element.id);

                                if (!schemaProperty) {
                                    return null;
                                }

                                const isSelectable = schemaPropertyPredicate(schemaProperty);

                                const propertyParentSchemaObject = getSchemaByRef(schemaProperty.schemaRef, apiSpec.document);
                                const propertySchema = propertyParentSchemaObject.properties && propertyParentSchemaObject.properties[schemaProperty.propertyName];
                                const propertySchemaObject = propertySchema && resolveSchemaFromSchemaOrReference(propertySchema, apiSpec.document);

                                const propertyName = schemaProperty.propertyName + (propertySchemaObject?.type === "array" ? "[]" : "");

                                const opacitySx = {opacity: isSelectable ? 1 : 0.3};
                                const label = isBranch
                                    ? <Typography>
                                        {level > 1
                                            ? <Typography sx={opacitySx}>
                                                <Monospace
                                                    level="title-sm">{propertyName}</Monospace>
                                                <Typography
                                                    fontFamily="monospace"
                                                    level="body-xs"
                                                    sx={{ml: 1}}>({schemaRefTuHumanLabel(schemaProperty.schemaRef)})</Typography>
                                            </Typography>
                                            : <Typography
                                                sx={opacitySx}><Monospace>{schemaRefTuHumanLabel(schemaProperty.schemaRef)}</Monospace></Typography>}
                                    </Typography>
                                    : <Typography
                                        level="body-md"
                                        sx={opacitySx}
                                        fontFamily="monospace">{propertyName}</Typography>;

                                return (
                                    <div
                                        {...getNodeProps({onClick: handleExpand})}
                                        style={{marginLeft: 20 * (level - 1)}}
                                    >
                                        <Typography sx={{mt: 0.5}}>
                                            {isBranch && (isExpanded
                                                ? <Typography><ArrowDropDown/></Typography>
                                                : <Typography><ArrowRight/></Typography>)}

                                            {isSelectable
                                                ? <Radio
                                                    className="checkbox-icon"
                                                    value={schemaProperty.schemaRef + schemaProperty.propertyName}
                                                    disabled={!isSelectable || disabled}
                                                    checked={selectedSchemaProperty?.schemaRef === schemaProperty.schemaRef && selectedSchemaProperty.propertyName === schemaProperty.propertyName}
                                                    label={label}
                                                    onClick={(e) => {
                                                        handleSelect(e);
                                                        e.stopPropagation();
                                                    }}
                                                    onChange={event => {
                                                        if (event.target.checked) {
                                                            setSelectedSchemaProperty(schemaProperty);
                                                            onSchemaPropertySelected(schemaProperty);
                                                        }
                                                    }}
                                                />
                                                : label}

                                        </Typography>
                                    </div>
                                );
                            }}
                        />
                    </RadioGroup>
                </div>
            </div>
        </>
    );
}