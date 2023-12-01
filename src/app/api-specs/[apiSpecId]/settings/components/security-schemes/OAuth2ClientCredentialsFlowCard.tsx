import Card from "@mui/joy/Card";
import {WarningAlert} from "@/app/components/alert/WarningAlert";
import Typography from "@mui/joy/Typography";

export const OAuth2ClientCredentialsFlowCard = () => {
    return (
        <Card variant="soft">
            <Typography level="title-sm">Client Credentials</Typography>
            <WarningAlert title="This flow is not implemented by HopFront (yet)."/>
        </Card>
    )
}