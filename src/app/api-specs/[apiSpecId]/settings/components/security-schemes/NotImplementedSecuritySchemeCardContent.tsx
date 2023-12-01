import {CardContent} from "@mui/joy";
import {WarningAlert} from "@/app/components/alert/WarningAlert";

export const NotImplementedSecuritySchemeCardContent = () => {
    return (
      <CardContent>
          <WarningAlert title="This security scheme is not handled by HopFront (yet)."/>
      </CardContent>
    );
}