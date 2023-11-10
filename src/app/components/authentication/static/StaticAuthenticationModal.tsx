import { Button, FormControl, FormHelperText, Input } from "@mui/joy";
import { ResponsiveModal } from "../../modal/ResponsiveModal";
import { useMemo, useState } from "react";
import { ApiContext } from "@/app/lib/model/ApiContext";
import {AuthLocalStorage, StaticAuthCredentials} from "@/app/lib/localstorage/AuthLocalStorage";
import {ButtonRow} from "@/app/components/button/ButtonRow";

interface StaticAuthenticationModalProps {
    apiContext: ApiContext,
    open: boolean,
    onClose: () => void,
    onStaticAuthenticationSubmit(secret: StaticAuthCredentials): void
}

type FormData = {
    secret: string
}

export default function StaticAuthenticationModal({
    apiContext,
    open,
    onClose,
    onStaticAuthenticationSubmit
}: StaticAuthenticationModalProps) {
    const savedAuthentication = useMemo(() => {
        return AuthLocalStorage.getStaticAuthCredentials(apiContext.apiSpec.id);
    }, [apiContext.apiSpec.id]);
    const [formData, setFormData] = useState<FormData>(savedAuthentication ? { secret: '***************' } : { secret: '' });

    const onFormSubmit = (event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        const authentication = {
            secret: formData.secret
        } as StaticAuthCredentials
        onStaticAuthenticationSubmit(authentication);
    }

    return (
        <ResponsiveModal
            open={open}
            onClose={onClose}>
            <form onSubmit={onFormSubmit}>
                <FormControl>
                    <FormHelperText sx={{ width: '60px' }}>Secret</FormHelperText>
                    <Input
                        sx={{ mt: 1, width: '25%', minWidth: '350px' }}
                        onChange={(event) => {
                            setFormData({ ...formData, secret: event.target.value });
                        }}
                        name="custom_key"
                        placeholder="Your secret"
                        value={formData.secret}
                        required
                    />
                </FormControl>
                <ButtonRow align="right">
                    <Button type='submit' sx={{ mt: 2 }}>Authenticate</Button>
                </ButtonRow>
            </form>
        </ResponsiveModal>
    )
}