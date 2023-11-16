import { Button, FormControl, FormHelperText, Input } from "@mui/joy";
import { ResponsiveModal } from "../../modal/ResponsiveModal";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { useMemo, useState } from "react";
import {AuthLocalStorage, BasicAuthCredentials} from "@/app/lib/localstorage/AuthLocalStorage";
import {ButtonRow} from "@/app/components/button/ButtonRow";

interface BasicAuthModalProps {
    apiContext: ApiContext,
    open: boolean,
    onClose: () => void
    onBasicAuthSubmit: (basicAuth: BasicAuthCredentials) => void
}

type FormData = {
    username: string,
    password: string
}

export default function BasicAuthModal({ apiContext, open, onClose, onBasicAuthSubmit }: BasicAuthModalProps) {
    const savedCredentials = useMemo(() => {
        let saved = AuthLocalStorage.getBasicAuthCredentials(apiContext);
        if (saved?.password) {
            saved = { ...saved, password: '***************' };
        }
        return saved;
    }, [apiContext.apiSpec.id]);
    const [formData, setFormData] = useState<FormData>(savedCredentials ?? { username: '', password: '' });

    const onFormSubmit = (event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        const credentials = {
            username: formData.username,
            password: formData.password
        } as BasicAuthCredentials;
        onBasicAuthSubmit(credentials);
    }

    return (
        <ResponsiveModal
            open={open}
            onClose={onClose}
        >
            <form onSubmit={onFormSubmit}>
                <FormControl>
                    <FormHelperText>Username</FormHelperText>
                    <Input
                        sx={{ mt: 1, width: '25%', minWidth: '350px', mr: 1 }}
                        onChange={(event) => {
                            setFormData({ ...formData, username: event.target.value });
                        }}
                        name="basic_auth_username"
                        placeholder="My username"
                        value={formData.username}
                        required
                    />
                </FormControl>
                <FormControl>
                    <FormHelperText>Password</FormHelperText>
                    <Input
                        sx={{ mt: 1, width: '25%', minWidth: '350px' }}
                        onChange={(event) => {
                            setFormData({ ...formData, password: event.target.value });
                        }}
                        name="basic_auth_secret"
                        placeholder="My strong password"
                        value={formData.password}
                        required
                    />
                </FormControl>
                <ButtonRow align="right">
                    <Button type="submit">
                        Submit
                    </Button>
                </ButtonRow>
            </form>
        </ResponsiveModal>
    )
}