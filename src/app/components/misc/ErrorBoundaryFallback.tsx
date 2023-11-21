import Typography from "@mui/joy/Typography";
import {Box, Button, Link, Textarea} from "@mui/joy";
import Card from "@mui/joy/Card";
import {ContentCopy, Error} from "@mui/icons-material";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import {EventType, useSnackbar} from "@/app/hooks/useSnackbar";

export interface ErrorBoundaryFallbackProps {
    error: any
}

export const ErrorBoundaryFallback = ({error}: ErrorBoundaryFallbackProps) => {
    const {showSnackbar, Snackbar} = useSnackbar();

    return (
        <Box
            sx={{
                mt: 20,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>

            <Card sx={{width: '33%'}}>
                <Typography level="title-lg" startDecorator={<Error color="warning"/>}>
                    Something went wrong :(
                </Typography>
                <Typography>
                    HopFront is still in an early development stage, you can help us fix this bug by either:<br/>
                - creating a <Link href="https://github.com/hopfront/hopfront/issues/" target="_blank">GitHub issue</Link>,<br/>
                - sending an email at:<Link href="mailto:support@hopfront.com">support@hopfront.com</Link>.
                </Typography>

                <FormControl sx={{mt: 2}}>
                    <FormLabel>Error details:</FormLabel>
                    <Textarea
                        value={error.stack}
                        maxRows={10}
                        readOnly={true}
                        startDecorator={
                            <Box sx={{display: 'flex', gap: 0.5, flex: 1}}>
                                <Button
                                    variant="outlined"
                                    color="neutral"
                                    sx={{ml: 'auto'}}
                                    startDecorator={<ContentCopy/>}
                                    onClick={() => {
                                        navigator.clipboard.writeText(error.stack)
                                            .then(() => {
                                                showSnackbar(EventType.Success, 'Error details copied to clipboard.');
                                            });
                                    }}>
                                    Copy to Clipboard
                                </Button>
                            </Box>
                        }
                    />
                </FormControl>

                <Button onClick={() => {
                    window.location.href = '/';
                }}>
                    Go back to HopFront
                </Button>
            </Card>

            {Snackbar}
        </Box>
    );
}