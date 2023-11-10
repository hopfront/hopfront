import {
    getObjectHumanLabelValue,
    getObjectPropertyNames,
} from "@/app/lib/openapi/utils";
import {Monospace} from "@/app/components/typography/Monospace";
import { Skeleton } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {array} from "prop-types";

interface ObjectIdentifier {
    key: string
    value: string
}

const getObjectIdentifier = (object: any): ObjectIdentifier | undefined => {
    if (!object) {
        return undefined;
    } else if (object["id"]) {
        return {key: "id", value: object["id"]};
    } else {
        const objectPropertyNames = getObjectPropertyNames(object);
        const someIdField = objectPropertyNames.find(objectPropertyName => objectPropertyName.endsWith("Id"));

        if (someIdField) {
            return {key: someIdField, value: object[someIdField]};
        } else {
            return undefined;
        }
    }
}

export interface ObjectLabelProps {
    object: any | undefined | null
    loading?: boolean
}

export const ObjectLabel = ({object, loading = false}: ObjectLabelProps) => {
    if (typeof object !== "object") {
        return object;
    }

    const humanLabelValue = getObjectHumanLabelValue(object);
    const objectIdentifier = getObjectIdentifier(object);
    const firstKeyName = getObjectPropertyNames(object)[0];
    const firstValue = object ? object[firstKeyName] : undefined;

    if (humanLabelValue) {
        const objectHumanProperty = object[humanLabelValue];

        if (typeof objectHumanProperty === "object") {
            return <ObjectLabel object={objectHumanProperty}/>
        } else {
            return <Typography><Skeleton loading={loading}>{objectHumanProperty}</Skeleton></Typography>;
        }
    } else if (objectIdentifier) {
        return <Typography><Skeleton loading={loading}><Monospace>{objectIdentifier.key}</Monospace>: {objectIdentifier.value}</Skeleton></Typography>;
    } else if (firstKeyName && firstValue) {
        return <Typography><Skeleton loading={loading}>{firstKeyName + ': ' + JSON.stringify(firstValue)}</Skeleton></Typography>
    } else {
        return <Typography><Skeleton loading={loading}>{JSON.stringify(object)}</Skeleton></Typography>
    }
}