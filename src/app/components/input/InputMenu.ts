import {SvgIconComponent} from "@mui/icons-material";

export interface InputMenuItem {
    icon: SvgIconComponent
    text: string
    onClick: () => void
}

export interface InputMenu {
    icon?: SvgIconComponent
    items: InputMenuItem[]
}