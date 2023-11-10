import {Theme as JoyTheme} from "@mui/joy";
import {Theme as MaterialTheme} from "@mui/material";
import {Mode} from "@mui/system/cssVars/useCurrentColorScheme";

export const paletteKeyToColorFromJoyTheme = (paletteKey: string, theme: JoyTheme, mode: Mode | undefined): string => {
    // @ts-ignore
    const paletteElement = theme.colorSchemes[mode || 'light'].palette[paletteKey] as PaletteColor;
    // @ts-ignore
    const mainChannel = paletteElement['mainChannel'];
    return `rgba(${mainChannel})`;
}

export const paletteKeyToColorFromMaterialTheme = (paletteKey: string, theme: MaterialTheme): string => {
    // @ts-ignore
    const paletteElement = theme.palette[paletteKey] as PaletteColor;
    // @ts-ignore
    const mainChannel = paletteElement['mainChannel'];
    return `rgba(${mainChannel})`;
}