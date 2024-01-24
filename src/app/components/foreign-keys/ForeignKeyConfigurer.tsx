import { ForeignKeyConfigurerModal } from "@/app/components/foreign-keys/ForeignKeyConfigurerModal";
import { ForeignKey } from "@/app/lib/dto/OpenApiExtensions";
import { schemaRefToHumanLabel } from "@/app/lib/openapi/utils";
import { Add, Edit } from "@mui/icons-material";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import React, { useState } from "react";

export interface ForeignKeyConfigurerProps {
    source: React.ReactNode
    inputWithoutForeignKeyPreview: React.ReactNode
    foreignKey?: ForeignKey
    onForeignKeySelected: (foreignKey: ForeignKey) => void
    onDelete: () => void
    readOnly: boolean
    foreignKeyIcon?: React.ReactNode
}

export const ForeignKeyConfigurer = ({
    source,
    foreignKey,
    inputWithoutForeignKeyPreview,
    onForeignKeySelected,
    onDelete,
    readOnly,
    foreignKeyIcon = <Edit />
}: ForeignKeyConfigurerProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            {foreignKey
                ?
                <Chip size="md" onClick={() => setModalOpen(true)} disabled={readOnly}>
                    <Typography fontFamily="monospace">
                        {schemaRefToHumanLabel(foreignKey.schemaRef)}.{foreignKey.propertyName}
                    </Typography>
                </Chip>
                : <IconButton variant="outlined" size="sm" onClick={() => setModalOpen(true)} disabled={readOnly}><Add /></IconButton>}

            <ForeignKeyConfigurerModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                inputWithoutForeignKeyPreview={inputWithoutForeignKeyPreview}
                source={source}
                foreignKey={foreignKey}
                onForeignKeySelected={selectedForeignKey => {
                    setModalOpen(false);
                    onForeignKeySelected(selectedForeignKey);
                }}
                onDelete={onDelete}
                readOnly={readOnly}
                foreignKeyIcon={foreignKeyIcon} />
        </>
    );
}